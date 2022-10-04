<template>
  <div v-if="currentProject" class="edit-form">
    <h4>Projekt</h4>
    <form>
      <div class="form-group">
        <label for="name">Nimi</label>
        <input type="text" class="form-control" id="name"
          v-model="currentProject.name"/>
      </div>
      <label v-if="showNameRequiredError" class="error">Väli Nimi on kohustuslik</label>
      <div class="form-group">
        <label for="description">Kirjeldus</label>
        <input type="text" class="form-control" id="description"
          v-model="currentProject.description"/>
      </div>
      <div class="form-group">
        <label for="code">Kood</label>
        <input type="text" class="form-control" id="code"
          v-model="currentProject.code"/>
          <label v-if="showCodeRequiredError" class="error">Väli Kood on kohustuslik</label>
      </div>
    </form>
    <button v-if="!showDeleteConfirm" class="btn btn-danger mt-2" @click="showConfirmDelete">
      Kustuta
    </button>
    <button v-if="!showDeleteConfirm" type="submit" class="btn btn-success mt-2" @click="updateProject">
      Salvesta
    </button>
    <button v-if="showDeleteConfirm" class="btn btn-secondary mt-2" @click="showConfirmDelete">
      Loobu
    </button>
    <button v-if="showDeleteConfirm" class="btn btn-danger mt-2" @click="deleteProject">
      Kinnita kustutamine
    </button>
    <p>{{ message }}</p>
  </div>
  <div v-else>
    <br />
    <p>Projekti ei leitud.</p>
  </div>
</template>

<script>
import ProjectDataService from "../../services/projectDataService";

export default {
  name: "edit-project",
  data() {
    return {
      currentProject: null,
      message: '',
      showNameRequiredError: false,
      showCodeRequiredError: false,
      showDeleteConfirm: false
    };
  },
  methods: {
    // Get project
    getProject(id) {
      ProjectDataService.get(id)
        .then(response => {
          this.currentProject = response.data;
          console.log(response.data);
        })
        .catch(e => {
          console.log(e);
        });
    },
    // Save updated project
    updateProject() {
      if (this.currentProject.name == '') {
        this.showNameRequiredError = true;
      } else if (this.currentProject.code == '') { 
        this.showNameRequiredError = false;
        this.showCodeRequiredError = true;
      } else {
        ProjectDataService.update(this.currentProject.projectId, this.currentProject)
        .then(response => {
          console.log(response.data);
          this.message = 'Projekt salvestatud!';
          this.$router.push({ name: "projects" });
        })
        .catch(e => {
          console.log(e);
        });
      }
    },
    // Confitm delete
    showConfirmDelete(){
      this.showDeleteConfirm = !this.showDeleteConfirm;
    },
    // Delete project
    deleteProject() {
      ProjectDataService.delete(this.currentProject.projectId)
        .then(response => {
          console.log(response.data);
          this.$router.push({ name: "projects" });
        })
        .catch(e => {
          console.log(e);
        });
    }
  },
  mounted() {
    this.message = '';
    this.getProject(this.$route.params.id);
  }
};
</script>

<style>
.edit-form {
  max-width: 300px;
  margin: auto;
}

.error {
  color: red;
}
</style>