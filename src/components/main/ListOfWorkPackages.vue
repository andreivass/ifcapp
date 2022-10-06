<template>
    <div>Mudeli peal saab korraga kuvada ainult ühte tööpaketti</div>
    <table class="table table-hover" id="wp-table">
        <thead>
            <tr>
                <th scope="col">Id</th>
                <th scope="col">Kood</th>
                <th scope="col">Nimi</th>
                <th scope="col">Klassifikaator</th>
                <th scope="col">Kogus elemente</th>
                <th scope="col">Näita/peida mudelil</th>
                <th scope="col">Muuda</th>
            </tr>
        </thead>
        <tbody v-if="workPackages.length > 0">
            <tr v-for="(wp) in workPackages" :key=wp.workPackageId>
                <td>{{ wp.workPackageId }}</td>
                <td>{{ wp.code }}</td>
                <td>{{ wp.name }}</td>
                <td>{{ wp.classificatorNameEe }}</td>
                <td>{{ wp.modelElements.length }}</td>
                <td><button class="btn btn-light" @click.prevent="wpSelect(wp)">Vali</button></td>
                <td><button class="btn btn-light" @click.prevent="editWp(wp)">Muuda</button></td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr>
                Tööpaketid puuduvad või andmed ei ole veel sisse laetud.
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
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
            <button v-if="!showDeleteConfirm" class="btn btn-danger mt-2"
                @click="showConfirmDelete">
                Kustuta
              </button>
              <button v-if="!showDeleteConfirm" class="btn btn-secondary mt-2"
                @click="closeWpModal">
                Loobu
              </button>
              <button v-if="!showDeleteConfirm" class="btn btn-success mt-2"
                @click="saveWp">
                Salvesta
              </button>
              <button v-if="showDeleteConfirm" class="btn btn-secondary mt-2" @click="showConfirmDelete">
                Loobu
                </button>
                <button v-if="showDeleteConfirm" class="btn btn-danger mt-2" @click="deleteWp">
                Kinnita kustutamine
                </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import WorkPackageDataService from "../../services/workPackageDataService";

export default {
  name: 'ListOfWorkPackages',
  props: [
      'workPackages', 'workPackageViewEnabled'
  ],
  emits: [ 'listElementsSelectionChange', 'workPackageDeleted' ],
  data() {
    return {
        wpListSelectedElements: [],
        ifcElementsArray: [],
        wpModalHeader: '',
        workPackageFormModel: {
          name: '',
          description: '',
          code: ''
        },
        showModal: false,
        showNameRequiredError: false,
        showCodeRequiredError: false,
        showDeleteConfirm: false,
        modalWorkPackage: null
    }
  },
  methods: {
    // Update list of elements
    updateListOfElements(elementsArray){
      this.ifcElementsArray = elementsArray;
    },
    // Add IFC element to selected elements
    wpSelect(element){
        if (this.wpListSelectedElements.length == 0){
            element.modelElements.forEach(element => {
                element.expressID = element.expressId;
                this.wpListSelectedElements.push(element)
            });
        } else {
            this.wpListSelectedElements = [];
        }
        
        this.$emit('listElementsSelectionChange', this.wpListSelectedElements);
    },
    // Clear all selected items
    clearSelectedElements(){
        this.wpListSelectedElements = [];
        this.workPackages.forEach(x => x.selected = false);
        this.$emit('listElementsSelectionChange', this.wpListSelectedElements);
    },
    // Open work package edit modal
    editWp(wp){
      this.modalWorkPackage = wp;
      this.wpModalHeader = 'Muuda tööpaketti'

      this.workPackageFormModel.code = wp.code;
      this.workPackageFormModel.description = wp.description;
      this.workPackageFormModel.name = wp.name;

      this.showModal = true;
    },
    // Close work package modal
    closeWpModal(){
      this.showModal = false;
      this.workPackageFormModel.code = '';
      this.workPackageFormModel.description = '';
      this.workPackageFormModel.name = '';
    },
    // Delte work package
    deleteWp(){
        WorkPackageDataService.delete(this.modalWorkPackage.workPackageId)
            .then(response => {
            console.log(response.data);
            this.$emit('workPackageDeleted', this.modalWorkPackage);
            
            })
            .catch(e => {
            console.log(e);
            });

        this.closeWpModal();
    },
    // Save work package
    saveWp(){
        if (this.workPackageFormModel.name == '') {
        this.showNameRequiredError = true;
      } else if (this.workPackageFormModel.code == ''){
        this.showNameRequiredError = false;
        this.showCodeRequiredError = true;
      } else {
        console.log('save wp');
        var workPackage = {
          workPackageId: this.modalWorkPackage.workPackageId,
          name: this.workPackageFormModel.name,
          cciEePpId: this.modalWorkPackage.cciEePpId,
          description: this.workPackageFormModel.description,
          code: this.workPackageFormModel.code,
          projectId: this.modalWorkPackage.projectId,
          modelElements: [],
          selected: false
        };

        WorkPackageDataService.update(workPackage.workPackageId, workPackage)
          .then(response => {
            console.log('wp save api response: ', response.data);
            this.modalWorkPackage.name = workPackage.name;
            this.modalWorkPackage.description = workPackage.description;
            this.modalWorkPackage.code = workPackage.code;
          })
          .catch(e => {
            console.log(e);
          });
      }

      this.closeWpModal();
    },
    // Confitm delete
    showConfirmDelete(){
      this.showDeleteConfirm = !this.showDeleteConfirm;
    },
  }
}
</script>

<style>
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
</style>