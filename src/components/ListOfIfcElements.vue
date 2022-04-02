<template>
    <table class="table table-hover" id="materials-table">
        <thead>
            <tr>
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
                Load data.
            </tr>
        </tbody>
    </table>
    <div v-if="showTreeTable">
        <VueTreeList :model="treeData"
        default-tree-node-name="new node"
        default-leaf-node-name="new leaf"
        v-bind:default-expanded="false">
            {{  treeData  }}
        </VueTreeList>
    </div>
</template>

<script>
import { VueTreeList, Tree } from 'vue-tree-list'

export default {
  name: 'ListOfMaterials',
  props: [
      'ifcTree'
  ],
  components: {
      VueTreeList
  },
  data() {
    return {
        treeData: {},
        showTreeTable: false
    }
  },
  watch: {
      ifcTree: {
          setImmediate: true,
          handler() {
              console.log('Tree value changed');
              if (!this.showTreeTable) {
                this.prepareIfcTreeData();
              }
              
          }
      }
  },
  methods: {
      prepareIfcTreeData() 
      {
        // TODO: parse array data to some structure
        this.treeData = new Tree([
          {
            name: 'Node 1',
            id: 1,
            pid: 0,
            dragDisabled: true,
            addTreeNodeDisabled: true,
            addLeafNodeDisabled: true,
            editNodeDisabled: true,
            delNodeDisabled: true,
            children: [
              {
                name: 'Node 1-2',
                id: 2,
                isLeaf: true,
                pid: 1
              }
            ]
          },
          {
            name: 'Node 2',
            id: 3,
            pid: 0,
            disabled: true
          },
          {
            name: 'Node 3',
            id: 4,
            pid: 0
          }
        ]);

        this.showTreeTable = true;
      }
  }
}
</script>

<style>
#materials-table {
    min-height: 200px;
}
</style>