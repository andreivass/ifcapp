<template>
  <div v-if="currentProject" class="project-details">
    <h4>Projekt: {{ currentProject.name }} {{ currentProject.code }}</h4>
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
                <Viewer :ifcTree="ifcTree" @ifc-Tree-Loaded="updateIfcTree" :selectedElements="selectedElements" />
                <ListOfIfcElements :ifcTree="ifcTree" @ifc-elements-selected="updateSelectedElements" />
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
      selectedElements : new Array,
    };
  },
  methods: {
    getProject(id) {
      ProjectDataService.get(id)
        .then(response => {
          this.currentProject = response.data;
          console.log("Project loaded in details", response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    updateIfcTree(loadedIfcTree) {
        console.log('project details tree: ', loadedIfcTree);
        this.statusMessage = "Vali IFC elemendid tööpaketi loomiseks."
        this.ifcTree = loadedIfcTree;
    },
    updateSelectedElements(selectedElements){
        this.selectedElements = selectedElements;
    }
  },
  mounted() {
    this.statusMessage = "Vali IFC fail";
    this.getProject(this.$route.params.id);
  }
};
</script>

<style>
.project-details {
  max-width: 300px;
  margin: auto;
}
</style>