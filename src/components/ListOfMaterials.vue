<template>
    <table class="table table-hover">
        <thead>
            <tr>
            <th scope="col">Id</th>
            <th scope="col">Type</th>
            <th scope="col">Prop3</th>
            <th scope="col">Prop4</th>
            </tr>
        </thead>
        <tbody v-if="ifcTree.type">
            <tr v-for="element in ifcTree.children[0].children[0].children[0].children" :key=element.getExpressId>
                <td>ID</td>
                <td>{{ element.type }}</td>
                <td>Prop3</td>
                <td>Prop4</td>
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
              console.log('Tree value changed')
          }
      }
  }
};
</script>