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
</template>

<script>
export default {
  name: 'ListOfMaterials',
  props: [
      'ifcTree'
  ],
  watch: {
      ifcTree: {
          setImmediate: true,
          handler() {
              console.log('Tree value changed');
              this.prepareIfcTreeData();
          }
      }
  },
  methods: {
      prepareIfcTreeData() 
      {
        
      }
  }
}
</script>

<style>
#materials-table {
    min-height: 200px;
}
</style>