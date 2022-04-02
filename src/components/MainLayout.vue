<template>
    <div class="container-xxl" id="app-container">
        <div class="row row-cols-auto">
            <div class="col-2">
                <NavigationMenu />
            </div>
            <div class="col-10">
                <Viewer :ifcTree="ifcTree" @ifc-Tree-Loaded="updateIfcTree"/>
                <ListOfIfcElements :ifcTree="ifcTree" />
            </div>
        </div>
    </div>
</template>

<script>
import NavigationMenu from './NavigationMenu.vue'
import Viewer from './Viewer.vue'
import ListOfIfcElements from './ListOfIfcElements.vue'

export default {
  name: 'MainLayout',
  components: {
    NavigationMenu,
    Viewer,
    ListOfIfcElements
  },
  data() {
      return {
          ifcTree : new Array
      }
  },
  methods: {
      updateIfcTree(loadedIfcTree) {
          console.log('layout tree: ', loadedIfcTree);
          this.ifcTree = loadedIfcTree;
      }
  }
}
</script>

<style>
#app-container {
    margin-top: 0px;
}
</style>