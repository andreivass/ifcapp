<template>
  <div v-if="currentProject" class="project-details">
    <h4>Projekt: {{ currentProject.code }} - {{ currentProject.name }}</h4>
    <div>Rakenduse olek: {{ statusMessage }}</div>
  </div>
  <div v-else>
    <br />
    <p>Projekti ei leitud.</p>
  </div>
  <div v-if="currentProject" class="container-xxl" id="app-container">
        <div class="row row-cols-auto">
            <div class="col-2">
                <NavigationMenu />
            </div>
            <div class="col-10">
                <Viewer 
                ref="viewer"
                :ifcFileName="ifcFileName" 
                @ifcTreeLoaded="updateIfcTree" 
                @saveIfcName="saveIfcName" 
                @setIfcStatusReady="setIfcStatusReady"
                @selectionChange="updateListSelectedElements"/>

                <ListOfIfcElements 
                ref="elementsSection"
                :ifcModelReady="ifcModelReady" 
                @listElementsSelectionChange="updateViewerSelectedElements" />
            </div>
        </div>
    </div>
</template>

<script>
import ProjectDataService from "../../services/projectDataService";
import NavigationMenu from '../main/NavigationMenu.vue'
import Viewer from '../main/Viewer.vue'
import ListOfIfcElements from '../main/ListOfIfcElements.vue'

export default {
  name: "project-details",
  components: {
    NavigationMenu,
    Viewer,
    ListOfIfcElements
  },
  data() {
    return {
      currentProject: null,
      ifcTree : new Array,
      statusMessage: "",
      projectSelectedElements : new Array,
      ifcFileName:'',
      ifcModelReady: false
    };
  },
  methods: {
    getProject(id) {
      ProjectDataService.get(id)
        .then(response => {
          this.currentProject = response.data;
          this.ifcFileName = this.currentProject.ifcFileName;
          // console.log("Project loaded in details", response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    updateIfcTree(loadedIfcTree) {
        // console.log('project details tree: ', loadedIfcTree);
        this.statusMessage = "Vali IFC elemendid tööpaketi loomiseks."
        this.ifcTree = loadedIfcTree;
        this.$refs.elementsSection.updateListOfElements(loadedIfcTree);
    },
    updateViewerSelectedElements(selectedElements){
        // console.log('boobs')
        this.projectSelectedElements = selectedElements;
        this.$refs.viewer.updateSelectedItems(this.projectSelectedElements);
    },
    updateListSelectedElements(selectedElementId){
        // selectedElementId is express id of clicked element
        // TODO: remove from selected items, if there or add over from ifcTree
        var existing = this.projectSelectedElements.find(x => x.expressID === selectedElementId);
        if (existing !== null){
          console.log('remove existing')
          this.projectSelectedElements = this.projectSelectedElements.filter(x => x.expressID !== selectedElementId)
        }
        else{
          var addedElement = this.ifcTree.find(x => x.expressID === selectedElementId);
          this.projectSelectedElements.push(addedElement);
          console.log('didnt find existing')
        }
        this.$refs.elementsSection.updateSelectedElements(this.projectSelectedElements, selectedElementId);
    },
    saveIfcName(ifcFileName){
      this.currentProject.ifcFileName = ifcFileName;
      this.updateProject();
    },
    updateProject() {
      ProjectDataService.update(this.currentProject.projectId, this.currentProject)
        .then(response => {
          console.log(response.data);
          this.message = 'Projekt salvestatud!';
        })
        .catch(e => {
          console.log(e);
        });
      
        this.ifcModelReady = true;
    },
    setIfcStatusReady(){
      this.ifcModelReady = true;
    }
  },
  mounted() {
    this.statusMessage = "Vali IFC fail ja lae sisse andmed";
    this.getProject(this.$route.params.id);
  }
};
</script>

<style>
.project-details {
  max-width: 600px;
  height: auto;
  margin: auto;
}
</style>