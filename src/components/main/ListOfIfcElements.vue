<template>
  <button type="button" @click.prevent="createWp">Uus tööpakett</button>
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
    <!-- <div v-if="showTreeTable">
        <VueTreeList :model="treeData"
        default-tree-node-name="new node"
        default-leaf-node-name="new leaf"
        v-bind:default-expanded="false">
            {{  treeData  }}
        </VueTreeList>
    </div> -->
</template>

<script>
// import { VueTreeList, Tree } from 'vue-tree-list'

export default {
  name: 'ListOfMaterials',
  props: [
      'ifcTree'
  ],
  emits: ['ifc-elements-selected'],
  // components: {
  //     VueTreeList
  // },
  data() {
    return {
        treeData: {},
        showTreeTable: false,
        selectedItems: new Array
    }
  },
  watch: {
      ifcTree: {
          setImmediate: true,
          handler() {
              console.log('Tree value changed');
              // if (!this.showTreeTable) {
              //   this.prepareIfcTreeData();
              // }
              
          }
      }
  },
  methods: {
    createWp(){
      // var selectedItems = this.ifcTree.filter(o => {
      //   return o.selected == true;
      // });

      console.log("Create WP", this.selectedItems);

      this.$emit('ifc-elements-selected', this.selectedItems)
    },
    elementSelect(element){
      if (this.selectedItems.includes(element)) {
        this.selectedItems.splice(this.selectedItems.indexOf(element))
      }
      else {
        this.selectedItems.push(element);
      }
    }
  }
  // methods: {
  //     prepareIfcTreeData() 
  //     {
  //       // TODO: parse array data to some structure
  //       this.treeData = new Tree([
  //         {
  //           name: 'Node 1',
  //           id: 1,
  //           pid: 0,
  //           dragDisabled: true,
  //           addTreeNodeDisabled: true,
  //           addLeafNodeDisabled: true,
  //           editNodeDisabled: true,
  //           delNodeDisabled: true,
  //           children: [
  //             {
  //               name: 'Node 1-2',
  //               id: 2,
  //               isLeaf: true,
  //               pid: 1
  //             }
  //           ]
  //         },
  //         {
  //           name: 'Node 2',
  //           id: 3,
  //           pid: 0,
  //           disabled: true
  //         },
  //         {
  //           name: 'Node 3',
  //           id: 4,
  //           pid: 0
  //         }
  //       ]);

  //       this.showTreeTable = true;
  //     }
  // }
}
</script>

<style>
#materials-table {
    min-height: 200px;
}
</style>