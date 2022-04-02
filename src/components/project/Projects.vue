<template>
  <div class="list row">
    <div class="col-md-6">
      <h4>Projektide nimekiri</h4>
      <ul class="list-group">
        <li class="list-group-item"
          :class="{ active: index == currentIndex }"
          v-for="(project, index) in projects"
          :key="index"
          @click="setActiveProject(project, index)"
        >
          {{ project.name }}
        </li>
      </ul>
    </div>
    <div class="col-md-6">
      <div v-if="currentProject">
        <h4>Projekt</h4>
        <div>
          <label><strong>Nimi:</strong></label> {{ currentProject.name }}
        </div>
        <div>
          <label><strong>Kirjeldus:</strong></label> {{ currentProject.description }}
        </div>
        <div>
          <label><strong>Kood:</strong></label> {{ currentProject.code }}
        </div>
        <div>
          <label><strong>IFC faili nimi:</strong></label> {{ currentProject.ifcfilename }}
        </div>
        <div>
          <label><strong>Loodud tööpakette:</strong></label> {{ currentProject.workpackages ? currentProject.workpackages.count() : 0 }}
        </div>
        <div>
          <router-link  :to="'/project/' + currentProject.projectId" class="btn btn-outline-primary">Ava projekt</router-link>
          <router-link  :to="'/editproject/' + currentProject.projectId" class="btn btn-outline-warning">Muuda projekti</router-link>
       </div>
      </div>
      <div v-else>
        <br />
        <p>Vali projekt nimekirjast...</p>
      </div>
    </div>
    <div class="mt-3">
      <router-link  :to="'/addproject'" class="btn btn-outline-primary">Lisa projekt</router-link>
    </div>
  </div>
</template>

<script>
import ProjectDataService from "../../services/projectDataService"

export default {
  name: "projects",
  data() {
    return {
      projects: [],
      currentProject: null,
      currentIndex: -1,
      name: ""
    };
  },
  methods: {
    retrieveProjects() {
      ProjectDataService.getAll()
        .then(response => {
          this.projects = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    refreshList() {
      this.retrieveTutorials();
      this.currentProject = null;
      this.currentIndex = -1;
    },
    setActiveProject(project, index) {
      this.currentProject = project;
      this.currentIndex = project ? index : -1;
    }
  },
  mounted() {
    this.retrieveProjects();
  }
};
</script>

<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
</style>