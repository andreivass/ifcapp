<template>
    <section>
        <input type="file" id="file-input" />
        <p id="properties-text">
            ID: 
            {{ entityData }}
        </p>
        <canvas id="viewer" />
    </section>
</template>

<script>
import IfcManager from '../IFC/IfcManager'
import { Raycaster, Vector2 } from 'three'
// import { mapMutations } from 'vuex';

export default {
    name: 'Viewer',
    // props: ['token', 'projectId', 'discipline'],
    data() {
        return {
            entityData: '',
        }
    },
    methods: {
        // ...mapMutations(['setLoadedIfcTree']),
        onLoaded: function() {
            this.addPicking()
            this.setupPick(this)
        },
        addPicking: function() {
            this.raycaster = new Raycaster()
            this.raycaster.firstHitOnly = true
            this.mouse = new Vector2()
        },
        cast: function(event) {
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
        pick: async function(event) {
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
        setupPick: function(component) {
            component.threeCanvas = document.getElementById('viewer')
            component.threeCanvas.ondblclick = component.pick
        },
        // setLoadedIfcTree: function(ifcTree) {
        //     return ifcTree;
        // }
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
                
                console.log('ifcmodel: ', self.IFCManager.scene.ifcModel);
                // Spacial tree contains all trimmed* elements
                let ifcProject = await self.IFCManager.ifcLoader.ifcManager.getSpatialStructure(self.IFCManager.scene.ifcModel.modelID);
                console.log('Spatial tree: ', ifcProject);

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
