<template>
    <section>
        <input type="file" id="file-input" />
        <p id="properties-text">
            ID: 
            {{ entityData }}
        </p>
        <button type="button" @click.prevent="loadIfcData">Load IFC tree</button>
        <canvas id="viewer" />
    </section>
</template>

<script>
import IfcManager from '../IFC/IfcManager'
import { Raycaster, Vector2 } from 'three'
// import { mapMutations } from 'vuex';

export default {
    name: 'Viewer',
    props: ['ifcTree'],
    emits: ['ifc-Tree-Loaded'],
    data() {
        return {
            entityData: '',
        }
    },
    methods: {
        // ...mapMutations(['setLoadedIfcTree']),
        onLoaded() {
            this.addPicking()
            this.setupPick(this)
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
            this.found = this.cast(event)[0]
            if (this.found) {
                let ifc = this.IFCManager;
                let modelId = this.found.object.modelID;

                this.index = this.found.faceIndex
                this.geometry = this.found.object.geometry
                this.id = ifc.scene.ifcModel.getExpressId(
                    this.geometry,
                    this.index
                )
                this.entityData = this.id

                let props = await ifc.ifcLoader.ifcManager.getItemProperties(modelId, this.id);
                console.log('props: ', JSON.stringify(props, null, 2))
            }
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
        },
        // async convertTreeToArray(ifcNode, elArray){
        //     if (ifcNode.children.length === 0) {
        //         // console.log(elArray);
        //         return elArray;
        //     } else {
        //         for (let i = 0; i < ifcNode.children.length; i++) {
        //             let element = ifcNode.children[i];
        //             let elementAllProps = await this.IFCManager.ifcLoader.ifcManager.getItemProperties(0, element.expressID, true);
                    
        //             // let propertySets = await this.IFCManager.ifcLoader.ifcManager.getPropertySets(0, element.expressID, true);
        //             // console.log(i, 'propertySets', propertySets);

        //             elementAllProps.ifcType = element.type;
        //             elArray.push(elementAllProps);
        //             await this.convertTreeToArray(element, elArray);
        //         }
        //     }
        // },
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

                    // Add object to parent building storey.
                    buidingArray.push(elementAllProps);
                    
                    // Call method recursively on child elements.
                    await this.parseTree(element, buidingArray, storeyName);
                }
            }
        }
    },
    mounted() {
        const self = this
        this.IFCManager = new IfcManager('viewer')

        let input = document.getElementById('file-input')

        input.addEventListener(
            'change',
             async function(changed) {
                let file = changed.target.files[0]
                let ifcURL = URL.createObjectURL(file)
                self.IFCManager.scene.ifcModel = await self.IFCManager.ifcLoader.loadAsync(ifcURL);
                self.IFCManager.scene.add(self.IFCManager.scene.ifcModel.mesh)
                
                self.onLoaded()
            },
            false
        )
    },
}
</script>

<style>
#viewer {
    width: 100%;
    height: 100%;
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
