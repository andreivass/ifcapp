<template>
    <section>
        <div class="row viewer">
            <div v-if="dataLoaded == false && fileLoaded == false" class="col-sm">
                <input type="file" id="file-input"/>
            </div>
            <div v-if="dataLoaded == false && fileLoaded == true && this.ifcFileNameSaved == false" class="col-sm">
                <button type="button" @click.prevent="reloadPage()">Vali teine IFC fail</button>
            </div>
            <div v-if="dataLoaded == false && fileLoaded == true" class="col-sm">
                <button type="button" @click.prevent="loadIfcData">Lae IFC andmed</button>
            </div>
            <div v-if="dataLoaded == true && fileLoaded == true && savedFileLoaded == false" class="col-sm">
                <button type="button" @click.prevent="saveIfcName">Salvesta IFC fail projektile</button>
            </div>
            <div v-if="warningMessage.length > 0">
                {{ warningMessage }}
            </div>
        </div>
        <canvas id="viewer" />
    </section>
</template>

<script>
import IfcManager from '../../IFC/IfcManager'
import { Raycaster, Vector2, MeshLambertMaterial } from 'three'

export default {
    name: 'Viewer',
    props: ['ifcTree', 'selectedElements', 'ifcFileName'],
    emits: ['ifc-Tree-Loaded', 'save-Ifc-Name'],
    data() {
        return {
            entityData: '',
            dataLoaded: false,
            fileLoaded: false,
            ifcFileNameSaved: false,
            updatedIfcFileName: '',
            warningMessage: '',
            savedFileLoaded: false
        }
    },
    methods: {
        onLoaded() {
            this.addPicking()
            this.setupPick(this)
            this.dataLoaded = false
        },
        addPicking() {
            this.raycaster = new Raycaster()
            this.raycaster.firstHitOnly = true
            this.mouse = new Vector2()
        },
        cast(event) {
            this.bounds = this.threeCanvas.getBoundingClientRect()
            this.x1 = event.clientX - this.bounds.left
            this.x2 = this.bounds.right - this.bounds.left
            this.mouse.x = (this.x1 / this.x2) * 2 - 1
            this.y1 = event.clientY - this.bounds.top
            this.y2 = this.bounds.bottom - this.bounds.top
            this.mouse.y = -(this.y1 / this.y2) * 2 + 1
            this.raycaster.setFromCamera(
                this.mouse,
                this.IFCManager.scene.camera
            )

            return this.raycaster.intersectObjects(this.IFCManager.scene.ifcModels)
        },
        async pick(event) {
            // Creates subset material
            this.found = this.cast(event)[0]
            if (this.found) {
                let ifc = this.IFCManager;
                let modelId = this.found.object.modelID;

                this.index = this.found.faceIndex
                this.geometry = this.found.object.geometry
                this.id = ifc.scene.ifcModel.getExpressId(this.geometry, this.index);
                this.entityData = this.id

                let props = await ifc.ifcLoader.ifcManager.getItemProperties(modelId, this.id);
                console.log('selected element props: ', JSON.stringify(props, null, 2))

                var elementIds = [this.id];
                this.highlightElements(modelId, ifc, elementIds)
            }
        },
        highlightElements(modelId, ifcManager, elementIds){
            const preselectMat = new MeshLambertMaterial({
                transparent: true,
                opacity: 0.6,
                color: 0xff88ff,
                depthTest: false
            });

            ifcManager.ifcLoader.ifcManager.createSubset({
                    modelID: modelId,
                    ids: elementIds,
                    material: preselectMat,
                    scene: ifcManager.scene,
                    removePrevious: true
                });
        },
        setupPick(component) {
            component.threeCanvas = document.getElementById('viewer')
            component.threeCanvas.ondblclick = component.pick
        },
        async loadIfcData() {
            let ifcProject = await this.IFCManager.ifcLoader.ifcManager.getSpatialStructure(this.IFCManager.scene.ifcModel.modelID);
            console.log('viewer tree: ', ifcProject);
            let elementArray = new Array;
            
            await this.parseTree(ifcProject, elementArray);

            this.$emit('ifc-Tree-Loaded', elementArray)

            this.dataLoaded = true;

            if (this.savedFileLoaded == true){
                this.setIfcStatusReady();
            }
        },
        async parseTree(ifcNode, buidingArray, storeyName){
            //console.log("ifcManager: ", this.IFCManager);
            if (ifcNode.children.length === 0) {

                return buidingArray;
            } else {
                for (let i = 0; i < ifcNode.children.length; i++) {
                    let element = ifcNode.children[i];                    

                    // Get detailed property object.
                    let elementAllProps = await this.IFCManager.ifcLoader.ifcManager.getItemProperties(0, element.expressID, true);
                    
                    if (element.type === 'IFCBUILDINGSTOREY') {
                        storeyName = elementAllProps.Name.value;
                    }

                    // Transfer IFC Type property to detailt property object.
                    elementAllProps.ifcType = element.type;

                    // Add storey nr property.
                    elementAllProps.buildingStorey = storeyName;

                    // Add prop for selection.
                    elementAllProps.selected = false;

                    // Add object to parent building storey.
                    buidingArray.push(elementAllProps);
                    
                    // Call method recursively on child elements.
                    await this.parseTree(element, buidingArray, storeyName);
                }
            }
        },
        reloadPage() {
            window.location.reload();
        },
        setIfcName(ifcName){
            this.updatedIfcFileName = ifcName;
        },
        saveIfcName() {
            this.$emit('save-Ifc-Name', this.updatedIfcFileName)
            this.savedFileLoaded = true;
        },
        setIfcStatusReady(){
            this.$emit('set-Ifc-Status-Ready');
        }
    },
    mounted() {
        const self = this
        this.IFCManager = new IfcManager('viewer');

        if (this.ifcFileName.length > 0){
            this.ifcFileNameSaved = true;
        }

        let input = document.getElementById('file-input');

        input.addEventListener(
            'change',
             async function(changed) {
                let file = changed.target.files[0];
                
                if (self.ifcFileNameSaved == false || file.name == self.ifcFileName){
                    let ifcURL = URL.createObjectURL(file);
                    self.IFCManager.scene.ifcModel = await self.IFCManager.ifcLoader.loadAsync(ifcURL);
                    self.IFCManager.scene.add(self.IFCManager.scene.ifcModel.mesh);

                    self.onLoaded();
                    self.fileLoaded = true;
                    self.setIfcName(file.name);
                    self.warningMessage = '';

                    if (file.name == self.ifcFileName){
                        self.savedFileLoaded = true;
                    }
                } else {
                    self.warningMessage = 'Vallitud vale IFC fail , vali: ' + self.ifcFileName;
                }
            },
            false
        );      
    },
    watch: {
        async selectedElements(newVal) {
            // TODO: somehow highliht selected items
            // console.log("new selected items value: ", newVal);
            if (newVal.length > 0){
                console.log(this.IFCManager);
                this.highlightElements(0, this.IFCManager, 59553)
                //console.log(newVal[0].object.modelId);
                // await this.IFCManager.scene.ifcModel.hideAllItems(0);
                await this.IFCManager.ifcLoader.ifcManager.hideItems(59753);
            } else {
                console.log("Empty list")
                // await self.IFCManager.ifcLoader.showAllItems();
            }
        }
    }
}
</script>

<style>
.viewer {
    width: 100%;
    height: auto;
}


#viewer {
    width: 100% !important;
    height: auto !important;
}

#file-input {
    /* position: absolute; */
    left: 0%;
    top: 0%;
    z-index: 100;
}

#properties-text {
    position: absolute;
    left: 0%;
    bottom: 0%;
    z-index: 100;
}
</style>
