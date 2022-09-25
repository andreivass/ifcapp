 <template>
  <div class="submit-form">
    <div class="form-group">
      <label for="name">Nimi</label>
      <input
        type="text"
        class="form-control"
        id="name"
        required
        v-model="project.name"
        name="name"
      />
    </div>
    <div class="form-group">
      <label for="code">Kood</label>
      <input
        type="text"
        class="form-control"
        id="code"
        required
        v-model="project.code"
        name="code"
      />
    </div>
    <div class="form-group">
      <label for="description">Kirjeldus</label>
      <input
        class="form-control"
        id="description"
        required
        v-model="project.description"
        name="description"
      />
    </div>
    <button @click="saveProject" class="btn btn-success">Salvesta</button>
  </div>
</template>

<script>
import ProjectDataService from "../../services/projectDataService";

export default {
  name: "add-project",
  data() {
    return {
      project: {
        id: 0,
        name: "",
        code: "",
        description: "",
        ifcfilename: "",
        workpackages: null
      },
      submitted: false
    };
  },
  methods: {
    // Save new project
    saveProject() {
      var data = {
        id: this.project.id,
        name: this.project.name,
        code: this.project.code,
        description: this.project.description,
        ifcfilename: this.project.ifcfilename,
        workpackages: this.project.workpackages
      };
      ProjectDataService.create(data)
        .then(response => {
          this.project.id = response.data.id;
          console.log(response.data);
          this.submitted = true;
          this.$router.push('projects');
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
};
</script>

<style>
.submit-form {
  max-width: 300px;
  margin: auto;
}
</style>