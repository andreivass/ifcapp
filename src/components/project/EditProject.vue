<template>
  <div v-if="currentProject" class="edit-form">
    <h4>Projekt</h4>
    <form>
      <div class="form-group">
        <label for="name">Nimi</label>
        <input type="text" class="form-control" id="name"
          v-model="currentProject.name"
        />
      </div>
      <div class="form-group">
        <label for="description">Kirjeldus</label>
        <input type="text" class="form-control" id="description"
          v-model="currentProject.description"
        />
      </div>
      <div class="form-group">
        <label for="description">Kood</label>
        <input type="text" class="form-control" id="code"
          v-model="currentProject.code"
        />
      </div>
    </form>
    <button class="btn btn-danger mt-2"
      @click="deleteProject"
    >
      Kustuta
    </button>
    <button type="submit" class="btn btn-success mt-2"
      @click="updateProject"
    >
      Salvesta
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
      message: ''
    };
  },
  methods: {
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
    updateProject() {
      ProjectDataService.update(this.currentProject.projectId, this.currentProject)
        .then(response => {
          console.log(response.data);
          this.message = 'The project was updated successfully!';
        })
        .catch(e => {
          console.log(e);
        });
    },
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
</style>