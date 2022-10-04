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
                <NavigationMenu 
                @changeViewToIfc="changeViewToIfcList"
                @changeViewToWp="changeViewToWpList"
                />
            </div>
            <div class="col-10">
                <Viewer 
                ref="viewer"
                :ifcFileName="ifcFileName" 
                @ifcElementsArrayLoaded="updateIfcElementsArray" 
                @saveIfcName="saveIfcName" 
                @setIfcStatusReady="setIfcStatusReady"
                @selectionChange="updateListSelectedElements"
                />
                <div v-show="!workPackageViewEnabled">
                  <ListOfIfcElements
                  ref="listOfIfcElements"
                  :ifcModelReady="ifcModelReady" 
                  :projectId="this.projectId"
                  :workPackageViewEnabled="workPackageViewEnabled"
                  @listElementsSelectionChange="updateViewerSelectedElements" 
                  @workPackagesUpdated="workPackagesUpdatedInIfcList"
                  />
                </div>
                <div v-show="workPackageViewEnabled">
                  <ListOfWorkPackages 
                  ref="listOfWorkPackages"
                  @listElementsSelectionChange="updateViewerSelectedElements" 
                  @workPackageDeleted="workPackageDeleted"
                  :workPackages="this.workPackages"
                  />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ProjectDataService from "../../services/projectDataService";
import NavigationMenu from '../main/NavigationMenu.vue'
import Viewer from '../main/Viewer.vue'
import ListOfIfcElements from '../main/ListOfIfcElements.vue'
import ListOfWorkPackages from "../main/ListOfWorkPackages.vue";

export default {
  name: "project-details",
  components: {
    NavigationMenu,
    Viewer,
    ListOfIfcElements,
    ListOfWorkPackages
},
  data() {
    return {
      currentProject: null,
      ifcElementsArray : new Array,
      statusMessage: "",
      projectSelectedElements : new Array,
      ifcFileName:'',
      ifcModelReady: false,
      projectId: 0,
      workPackageViewEnabled: false,
      workPackages: []
    };
  },
  methods: {
    // Get project
    getProject(id) {
      ProjectDataService.get(id)
        .then(response => {
          this.currentProject = response.data;
          this.ifcFileName = this.currentProject.ifcFileName;
        })
        .catch(e => {
          console.log(e);
        });
    },
    // Update IFC elements array on change from Viewer
    updateIfcElementsArray(loadedIfcElementsArray) {
        this.statusMessage = "Vali IFC elemendid tööpaketi loomiseks."
        this.ifcElementsArray = loadedIfcElementsArray;
        this.$refs.listOfIfcElements.updateListOfElements(loadedIfcElementsArray);
    },
    // Update selected elements on change from ListOfIfcElements
    updateViewerSelectedElements(selectedElements){
        this.projectSelectedElements = selectedElements;
        this.$refs.viewer.updateSelectedItems(this.projectSelectedElements);
    },
    // Update selected elements on change from Viewer
    updateListSelectedElements(selectedElementId){
        var existing = this.projectSelectedElements.find(x => x.expressID === selectedElementId);
        if (existing !== null){
          this.projectSelectedElements = this.projectSelectedElements.filter(x => x.expressID !== selectedElementId)
        }
        else{
          var addedElement = this.ifcElementsArray.find(x => x.expressID === selectedElementId);
          this.projectSelectedElements.push(addedElement);
        }
        this.$refs.listOfIfcElements.updateSelectedElements(this.projectSelectedElements, selectedElementId);
    },
    // Bind and save project with IFC file name 
    saveIfcName(ifcFileName){
      this.currentProject.ifcFileName = ifcFileName;
      this.updateProject();
    },
    // Save updated project
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
    // Set app status as IFC model ready
    setIfcStatusReady(){
      this.ifcModelReady = true;
    },
    // Change view to IFC list
    changeViewToIfcList(){
      this.workPackageViewEnabled = false;
      this.projectSelectedElements = [];
      this.$refs.listOfIfcElements.clearSelectedElements();
    },
    // Change view to WorkPackage list
    changeViewToWpList(){
      this.workPackageViewEnabled = true;
      this.projectSelectedElements = [];
      this.$refs.listOfWorkPackages.clearSelectedElements();
    },
    // Update work packages on change from IFC list
    workPackagesUpdatedInIfcList(workPackages){
      this.workPackages = workPackages;
    },
    // Update work packages list on delete
    workPackageDeleted(wp){
      this.workPackages = this.workPackages.filter(e => e !== wp)
    }
  },
  mounted() {
    this.statusMessage = "Vali IFC fail ja lae sisse andmed";
    this.projectId = this.$route.params.id;
    this.getProject(this.projectId);
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