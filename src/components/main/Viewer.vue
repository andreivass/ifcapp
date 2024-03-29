<template>
    <section>
        <div class="row viewer">
            <div v-if="dataLoaded == false && fileLoaded == false" class="col-sm">
                <label class="btn btn-primary"> Vali IFC fail
                    <input type="file" id="file-input" hidden/>
                </label>
            </div>
            <div v-if="dataLoaded == false && fileLoaded == true && this.ifcFileNameSaved == false" class="col-sm">
                <button type="button" class="btn btn-primary" @click.prevent="reloadPage()">Vali teine IFC fail</button>
            </div>
            <div v-if="dataLoaded == false && fileLoaded == true" class="col-sm">
                <button type="button" class="btn btn-primary" @click.prevent="loadIfcData">Lae IFC andmed</button>
            </div>
            <div v-if="dataLoaded == true && fileLoaded == true && savedFileLoaded == false" class="col-sm">
                <button type="button" class="btn btn-primary" @click.prevent="saveIfcName">Salvesta IFC fail projektile</button>
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
    props: ['ifcFileName'],
    emits: ['ifcElementsArrayLoaded', 'saveIfcName', 'setIfcStatusReady', 'selectionChange'],
    data() {
        return {
            dataLoaded: false,
            fileLoaded: false,
            ifcFileNameSaved: false,
            updatedIfcFileName: '',
            warningMessage: '',
            savedFileLoaded: false,
            viewerSelectedElementIds: new Array,
            higlihgtingMaterial: new MeshLambertMaterial({
                transparent: true,
                opacity: 0.6,
                color: 0xff88ff,
                depthTest: false
            })
        }
    },
    methods: {
        onLoaded() {
            this.dataLoaded = false
        },
        // Enable click picking
        enablePicking() {
            this.addPicking()
            this.setupPick(this)
        },
        // IFC.js framework loading click picking
        addPicking() {
            this.raycaster = new Raycaster()
            this.raycaster.firstHitOnly = true
            this.mouse = new Vector2()
        },
        // IFC.js framework click picking
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
        // IFC.js framework click picking
        async pick(event) {
            // Creates subset material
            this.found = this.cast(event)[0]
            if (this.found) {
                let ifc = this.IFCManager;
                let modelId = this.found.object.modelID;
                this.index = this.found.faceIndex;
                this.geometry = this.found.object.geometry;
                this.id = ifc.scene.ifcModel.getExpressId(this.geometry, this.index);
                
                // Syncing viewer selection with ListOfIfcElements
                if (this.viewerSelectedElementIds.includes(this.id)) {
                    this.viewerSelectedElementIds = this.viewerSelectedElementIds.filter(item => item !== this.id);
                    this.selected = false;
                }
                else {
                    this.viewerSelectedElementIds.push(this.id);
                    this.selected = true;
                }

                this.highlightElements(modelId, ifc, this.viewerSelectedElementIds)
                this.$emit('selectionChange', this.id)
            }
        },
        // Highlight selected elements
        highlightElements(modelId, ifcManager, elementIds){
            const ifc = ifcManager.ifcLoader.ifcManager;

            ifc.createSubset({
                    modelID: modelId,
                    ids: elementIds,
                    material: this.higlihgtingMaterial,
                    scene: ifcManager.scene,
                    removePrevious: true
                });           
        },
        // IFC.js framework loading click picking
        setupPick(component) {
            component.threeCanvas = document.getElementById('viewer')
            component.threeCanvas.ondblclick = component.pick
        },
        // Get elements data from IFC model
        async loadIfcData() {
            let ifcProject = await this.IFCManager.ifcLoader.ifcManager.getSpatialStructure(this.IFCManager.scene.ifcModel.modelID);
            let elementArray = new Array;
            
            await this.parseTree(ifcProject, elementArray);

            this.$emit('ifcElementsArrayLoaded', elementArray);

            this.dataLoaded = true;

            if (this.savedFileLoaded == true){
                this.setIfcStatusReady();
            }
        },
        // Modify IFC data to a more usable form
        async parseTree(ifcNode, buidingArray, storeyName){
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

                    // Add object to parent building storey, filter out site and building elements
                    if (element.type !== 'IFCSITE' 
                    && element.type !== 'IFCBUILDING'
                    && element.type !== 'IFCSPACE'){
                        buidingArray.push(elementAllProps);
                    }
                    // Call method recursively on child elements.
                    await this.parseTree(element, buidingArray, storeyName);
                }
            }
        },
        // Reload page
        reloadPage() {
            window.location.reload();
        },
        // Set name of IFC file
        setIfcName(ifcName){
            this.updatedIfcFileName = ifcName;
        },
        // Save name of IFC file
        saveIfcName() {
            this.$emit('saveIfcName', this.updatedIfcFileName)
            this.savedFileLoaded = true;
        },
        // Set app status to IFC ready
        setIfcStatusReady(){
            this.$emit('setIfcStatusReady');
            this.enablePicking();
        },
        // Update selection changes coming in from ListOfIfcElements component
        updateSelectedItems(selectedElements){
            var elementIds = new Array;
            if (selectedElements.length > 0){
                selectedElements.forEach( e => {
                    elementIds.push(e.expressID)
                });
                this.highlightElements(0, this.IFCManager, elementIds);
            }
            else {
                this.IFCManager.ifcLoader.ifcManager.removeSubset(0, this.higlihgtingMaterial);
            }
            
            this.viewerSelectedElementIds = elementIds;
        }
    },
    mounted() {
        const self = this
        this.IFCManager = new IfcManager('viewer');

        if (this.ifcFileName.length > 0){
            this.ifcFileNameSaved = true;
        }

        let input = document.getElementById('file-input');

        // File selection
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
                    self.warningMessage = 'Valitud vale IFC fail , vali: ' + self.ifcFileName;
                }
            },
            false
        );      
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
