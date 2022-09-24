<template>
  <div v-if="ifcModelReady == true">
    <button type="button" @click.prevent="createWp()">Uus tööpakett</button>
  </div>
    <table class="table table-hover" id="materials-table">
        <thead>
            <tr>
                <th scope="col">Select</th>
                <th scope="col">Row nr</th>
                <th scope="col">Storey</th>
                <!-- <th scope="col">Guid</th>
                <th scope="col">Id</th> -->
                <th scope="col">IFC Type</th>
                <th scope="col">Name</th>
                <th scope="col">ObjectType</th>
            </tr>
        </thead>
        <tbody v-if="ifcTree.length > 0">
            <tr v-for="(element, index) in ifcTree" :key=element.expressId>
                <td><input type="checkbox" id="checkbox" v-model="element.selected" @change="elementSelect(element)"></td>
                <td>{{ index + 1 }}</td>
                <td>{{ element.buildingStorey }}</td>
                <!-- <td>{{ element.GlobalId.value }}</td>
                <td>{{ element.expressID }}</td> -->
                <td>{{ element.ifcType }}</td>
                <td>{{ element.Name?.value }}</td>
                <td>{{ element.ObjectType?.value }}</td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr>
                Andmed ei ole veel sisse laetud.
            </tr>
        </tbody>
    </table>

  <Transition name="modal">
    <div v-if="show" class="modal-mask">
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
        treeData: {},
        showTreeTable: false,
        ifcTree: new Array,
        materialsListSelectedElements: new Array,
        show: false
    }
  },
  // watch: {
  //     ifcTree: {
  //         setImmediate: true,
  //         handler() {
  //             console.log('Tree value changed');
  //             // if (!this.showTreeTable) {
  //             //   this.prepareIfcTreeData();
  //             // }
              
  //         }
  //     }
  // },
  methods: {
    updateListOfElements(list){
      this.ifcTree = list;
    },
    updateSelectedElements(selectedElements, changedId){
      // TODO: remove checkbox selection from rendered list?
      this.materialsListSelectedElements = selectedElements;
      var changedElement = this.ifcTree.find(x => x.expressID === changedId);
      changedElement.selected = !changedElement.selected;
    },
    createWp(){
      this.show = true;
      // TODO: open modal and create WP.
    },
    elementSelect(element){
      if (this.materialsListSelectedElements.includes(element)) {
        console.log('element unselected');
        this.materialsListSelectedElements = this.materialsListSelectedElements.filter(e => e !== element);
        element.selected = false;
      }
      else {
        console.log('element selected');
        this.materialsListSelectedElements.push(element);
        element.selected = true;
      }

      this.$emit('listElementsSelectionChange', this.materialsListSelectedElements);
    },
    closeModal(){
      this.show = false;
    }
  }
}
</script>

<style>
#materials-table {
    min-height: 200px;
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