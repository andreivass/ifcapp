<template>
    <table class="table table-hover" id="materials-table">
        <thead>
            <tr>
                <th scope="col">Guid</th>
                <th scope="col">Id</th>
                <th scope="col">IFC Type</th>
                <th scope="col">Name</th>
                <th scope="col">ObjectType</th>
            </tr>
        </thead>
        <tbody v-if="ifcTree.length > 0">
            <tr v-for="element in ifcTree" :key=element.expressId>
                <td>{{ element.GlobalId.value }}</td>
                <td>{{ element.expressID }}</td>
                <td>{{ element.ifcType }}</td>
                <td>{{ element.Name?.value }}</td>
                <td>{{ element.ObjectType?.value }}</td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr>
                <td>ID</td>
                <td>Prop2</td>
                <td>Prop3</td>
                <td>Prop4</td>
                <td>Prop5</td>
            </tr>
        </tbody>
    </table>
    <!-- <div v-if="ifcTree.type">
        ifc tree type: {{ ifcTree.type }}
        <p v-for="element in ifcTree.children[0].children[0].children[0].children" :key=element.getExpressId>{{ element.getExpressId }}, {{ element.type }}</p>
    </div> -->
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
};
</script>

<style>
#materials-table {
    min-height: 200px;
}
</style>