 <template>
  <form class="submit-form">
    <div class="form-group">
      <label for="name">Nimi</label>
      <input type="text" class="form-control" id="name"
        v-model="project.name" />
      <label v-if="showNameRequiredError" class="error">Väli Nimi on kohustuslik</label>
    </div>
    <div class="form-group">
      <label for="code">Kood</label>
      <input type="text" class="form-control" id="code"
        v-model="project.code" />
    </div>
    <label v-if="showCodeRequiredError" class="error">Väli Kood on kohustuslik</label>
    <div class="form-group">
      <label for="description">Kirjeldus</label>
      <input class="form-control" id="description"
        v-model="project.description" />
    </div>
  </form>
  <button type="submit" class="btn btn-success" @click="saveProject">Salvesta</button>
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
      submitted: false,
      showNameRequiredError: false,
      showCodeRequiredError: false
    };
  },
  methods: {
    // Save new project
    // TODO: add validation
    saveProject() {
      if (this.project.name == '') {
        this.showNameRequiredError = true;
      } else if (this.project.code == '') { 
        this.showNameRequiredError = false;
        this.showCodeRequiredError = true;
      } else {
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
  }
};
</script>

<style>
.submit-form {
  max-width: 300px;
  margin: auto;
}
</style>