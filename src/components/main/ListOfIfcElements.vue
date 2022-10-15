<template>
  <div v-if="ifcModelReady == true && workPackageViewEnabled == false">
    <button type="button" class="btn btn-primary" @click.prevent="openWpModal()">Uus tööpakett</button>
  </div>
    <table class="table table-hover" id="materials-table">
        <thead>
            <tr>
                <th scope="col">Vali</th>
                <th scope="col">Jrk nr</th>
                <th scope="col">Korrus</th>
                <th scope="col">IFC Tüüp</th>
                <th scope="col">Nimi</th>
                <th scope="col">Kasutusel</th>
            </tr>
        </thead>
        <tbody v-if="ifcElementsArray.length > 0">
            <tr v-for="(element, index) in ifcElementsArray" :key=element.expressId>
                <td><input type="checkbox" id="checkbox" v-model="element.selected" @change="elementSelect(element)"></td>
                <td>{{ index + 1 }}</td>
                <td>{{ element.buildingStorey }}</td>
                <td>{{ element.ifcType }}</td>
                <td>{{ element.Name?.value }}</td>
                <td v-if="element.existsInWorkpackage === true">+</td>
                <td v-else></td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr>
                Andmed ei ole veel sisse laetud.
            </tr>
        </tbody>
    </table>

  <Transition name="modal">
    <div v-if="showModal" class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <slot name="header"><h4>{{ this.wpModalHeader }}</h4></slot>
            <button class="btn btn-secondary mt-2"
                @click="closeWpModal">
                X
              </button>
          </div>

          <div class="modal-body">
            <div v-if="materialsListSelectedElements.length < 1" class="error">
              Teade: Palun vali vähemalt üks element enne tööpaketi loomist.
            </div>
            <slot name="body">
              <form>
                <div class="form-group">
                  <label for="name" class="align-left">Nimi</label>
                  <label v-if="showNameRequiredError" class="error">Nimi on kohustuslik</label>
                  <input type="text" class="form-control" id="name"
                    v-model="workPackageFormModel.name"/>
                </div>
                <div class="form-group">
                  <label for="description" class="align-left">Kirjeldus</label>
                  <input type="text" class="form-control" id="description"
                    v-model="workPackageFormModel.description"/>
                </div>
                <div class="form-group">
                  <label for="code" class="align-left">Kood</label>
                  <label v-if="showCodeRequiredError" class="error">Kood on kohustuslik</label>
                  <input type="text" class="form-control" id="code"
                    v-model="workPackageFormModel.code"/>
                </div>
              </form>
              <table class="table table-sm table-hover" id="materials-table">
                  <thead>
                      <tr>
                          <th scope="col"></th>
                          <th scope="col">Lvl1</th>
                          <th scope="col">Lvl2</th>
                          <th scope="col">Nimetus</th>
                          <th scope="col">Kirjeldus</th>
                      </tr>
                  </thead>
                  <tbody v-if="classificators.length > 0">
                      <tr v-for="(classificator) in classificators" :key=classificator.cciEePpId>
                          <td><input type="checkbox" id="modal-checkbox" 
                            v-model="classificator.selected" 
                            @change="classificatorSelect(classificator)"></td>
                          <td>{{ classificator.level1 }}</td>
                          <td>{{ classificator.level2 }}</td>
                          <td>{{ classificator.termEe }}</td>
                          <td>{{ classificator.definitionEe }}</td>
                      </tr>
                  </tbody>
                  <tbody v-else>
                      <tr>
                          Andmed ei ole veel sisse laetud.
                      </tr>
                  </tbody>
              </table>
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn-secondary mt-2"
                @click="closeWpModal">
                Loobu
              </button>
              <button class="btn btn-success mt-2"
                :disabled="modalSaveDisabled"
                @click="saveWorkPackage">
                Salvesta
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>

</template>

<script>
import ClassificatorDataService from "../../services/classificatorDataService"
import WorkPackageDataService from "../../services/workPackageDataService";

export default {
  name: 'ListOfIfcElements',
  props: [
      'ifcModelReady', 'projectId', 'workPackageViewEnabled'
  ],
  emits: ['listElementsSelectionChange', 'workPackagesUpdated'],
  data() {
    return {
        ifcElementsArray: new Array,
        materialsListSelectedElements: new Array,
        showModal: false,
        wpModalHeader: '',
        classificators: [],
        anyClassificator: false,
        workPackages: [],
        workPackageFormModel: {
          name: '',
          description: '',
          code: ''
        },
        showNameRequiredError: false,
        showCodeRequiredError: false
    }
  },
  computed: {
    modalSaveDisabled(){
      return (this.materialsListSelectedElements.length < 1 || !this.anyClassificator);
    }
  },
  methods: {
    // Section IFC elements
    clearSelectedElements(){
      this.materialsListSelectedElements = [];
      this.ifcElementsArray.forEach(x => x.selected = false);
      this.$emit('listElementsSelectionChange', this.materialsListSelectedElements);
    },
    // Update elements array on change from ProjectDetails
    updateListOfElements(elementsArray){
      this.ifcElementsArray = elementsArray;
      if (this.workPackages.length == 0){
        this.getExistingWorkPackages()
      }
    },
    // Update selected elements array on change from ProjectDetails
    updateSelectedElements(selectedElements, changedId){
      this.materialsListSelectedElements = selectedElements;
      var changedElement = this.ifcElementsArray.find(x => x.expressID === changedId);
      changedElement.selected = !changedElement.selected;
    },
    // Add IFC element to selected elements
    elementSelect(element){
      if (this.materialsListSelectedElements.includes(element)) {
        this.materialsListSelectedElements = this.materialsListSelectedElements.filter(e => e !== element);
        element.selected = false;
      }
      else {
        this.materialsListSelectedElements.push(element);
        element.selected = true;
      }
      this.$emit('listElementsSelectionChange', this.materialsListSelectedElements);
    },
    // Section Work packages
    // Open work package modal
    openWpModal(){
      if (this.classificators.length === 0){
        this.getClassificators();
      }
      this.wpModalHeader = 'Vali elementidele klassifikaator ja loo uus tööpakett'
      this.showModal = true;
    },
    // Close WP modal
    closeWpModal(){
      this.showModal = false;
      var classificator = this.classificators.find(x => x.selected === true);
      if (classificator != null){
        classificator.selected = false;
      }
      this.anyClassificator = false;
    },
    // Save WP
    saveWorkPackage(){
      if (this.workPackageFormModel.name == '') {
        this.showNameRequiredError = true;
      } else if (this.workPackageFormModel.code == ''){
        this.showNameRequiredError = false;
        this.showCodeRequiredError = true;
      } else {
        var classificator = this.classificators.find(x => x.selected === true);

        var workPackage = {
          workPackageId: 0,
          name: this.workPackageFormModel.name,
          cciEePpId: classificator.cciEePpId,
          description: this.workPackageFormModel.description,
          code: this.workPackageFormModel.code,
          projectId: this.projectId,
          modelElements: [],
          selected: false
        };
        
        this.materialsListSelectedElements.forEach(x => workPackage.modelElements.push(
          {
            guid: x.GlobalId.value,
            expressId: x.expressID,
            ifcType: x.ifcType,
            ifcStorey: x.buildingStorey,
            name: x.Name.value,
            objectType: x.ObjectType == null ? "No object type found" : x.ObjectType.value
          }
        ));

        WorkPackageDataService.create(workPackage)
          .then(response => {
            console.log('wp save api response: ', response.data);
            this.submitted = true;
            workPackage.workPackageId = response.data.workPackageId;
            workPackage.classificatorNameEe = response.data.classificatorNameEe;
            this.workPackages.push(workPackage);
          })
          .catch(e => {
            console.log(e);
          });

        // update element exist in wp
        this.materialsListSelectedElements.forEach(x => x.existsInWorkpackage = true);
        this.$emit('workPackagesUpdated', this.workPackages);
        
        this.closeWpModal();
        this.showCodeRequiredError = false;
      }
    },
    // Get list of classificators
    getClassificators() {
      ClassificatorDataService.getAll()
        .then(response => {
          this.classificators = response.data;
          this.classificators.forEach(x => x.selected = false);
        })
        .catch(e => {
          console.log(e);
        });
    },
    // Select classificator for WP
    classificatorSelect(classificator){
      this.classificators.forEach(x => x.selected = false);
      classificator.selected = true;
      this.anyClassificator = true;
    },
    // Load all existing work packages for this project
    getExistingWorkPackages(){
      WorkPackageDataService.getByProject(this.projectId)
        .then(response => {
          this.workPackages = response.data;
          this.workPackages.forEach(wp => {
            if (wp.modelElements != null){
              wp.modelElements.forEach(element => {
                var elementInArray = this.ifcElementsArray.find(x => x.expressID == element.expressId);
                if (elementInArray != null){
                  elementInArray.existsInWorkpackage = true;
                }
              });
            }
            wp.selected = false;
          });
          this.$emit('workPackagesUpdated', this.workPackages);
        })
        .catch(e => {
          console.log(e);
        });
    }
  }
}
</script>

<style>
.error {
  color: red;
}

.align-left {
  text-align: left;
  float: left;
}

#materials-table {
    min-height: 200px;
    width: 100% !important;
    height: auto !important;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 800px;
  margin: 0px auto;
  padding: 10px 10px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-body {
  max-height: 700px;
  overflow-y: auto;
}

.modal-header h3 {
  position: absolute;
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 0 0;
}

.modal-default-button {
  float: right;
}

.modal-enter-from {
  opacity: 0;
}

.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.error {
  color: red;
}
</style>