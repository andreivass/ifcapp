 <template>
  <div class="submit-form">
    <div v-if="!submitted">
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
      <!-- <div class="form-group">
        <label for="ifcfilename">IFC faili nimi</label>
        <input
          type="text"
          class="form-control"
          id="ifc-file-name"
          required
          v-model="project.ifcfilename"
          name="ifc-file-name"
        />
      </div> -->
      <button @click="saveProject" class="btn btn-success">Salvesta</button>
    </div>
    <div v-else>
      <h4>You submitted successfully!</h4>
      <button class="btn btn-success" @click="newProject">Lisa</button>
    </div>
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
        })
        .catch(e => {
          console.log(e);
        });
    },
    
    newProject() {
      this.submitted = false;
      this.project = {};
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