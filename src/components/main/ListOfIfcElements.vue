<template>
  <div v-if="ifcModelReady == true">
    <button type="button" @click.prevent="createWp()">Uus tööpakett</button>
  </div>
    <table class="table table-hover" id="materials-table">
        <thead>
            <tr>
                <th scope="col">Vali</th>
                <th scope="col">Jrk nr</th>
                <th scope="col">Korrus</th>
                <th scope="col">IFC Tüüp</th>
                <th scope="col">Nimi</th>
            </tr>
        </thead>
        <tbody v-if="ifcElementsArray.length > 0">
            <tr v-for="(element, index) in ifcElementsArray" :key=element.expressId>
                <td><input type="checkbox" id="checkbox" v-model="element.selected" @change="elementSelect(element)"></td>
                <td>{{ index + 1 }}</td>
                <td>{{ element.buildingStorey }}</td>
                <td>{{ element.ifcType }}</td>
                <td>{{ element.Name?.value }}</td>
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
            <slot name="header">default header</slot>
            <button
                class="modal-default-button"
                @click="closeModal"
              >X</button>
          </div>

          <div class="modal-body">
            <slot name="body">default body</slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              default footer
              <button
                class="modal-default-button"
              >Save</button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>

</template>

<script>

export default {
  name: 'ListOfIfcElements',
  props: [
      'ifcModelReady'
  ],
  emits: ['listElementsSelectionChange', 'asd'],
  data() {
    return {
        ifcElementsArray: new Array,
        materialsListSelectedElements: new Array,
        showModal: false
    }
  },
  methods: {
    // Update elements array on change from ProjectDetails
    updateListOfElements(elementsArray){
      this.ifcElementsArray = elementsArray;
    },
    // Update selected elements array on change from ProjectDetails
    updateSelectedElements(selectedElements, changedId){
      this.materialsListSelectedElements = selectedElements;
      var changedElement = this.ifcElementsArray.find(x => x.expressID === changedId);
      changedElement.selected = !changedElement.selected;
    },
    // Create new work package
    createWp(){
      this.showModal = true;
      // TODO: open modal and create WP.
    },
    // Close WP modal
    closeModal(){
      this.showModal = false;
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
    }
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
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

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