<template>
    <PageHeader />
    <div class="container-xxl">
        <div class="row">
            <div class="col-2">
                <NavigationMenu />
            </div>
            <div class="col-10">
                <Viewer :ifcTree="ifcTree" @ifc-Tree-Loaded="updateIfcTree"/>
                <ListOfMaterials :ifcTree="ifcTree" />
            </div>
        </div>
    </div>
</template>

<script>
import PageHeader from './PageHeader.vue'
import NavigationMenu from './NavigationMenu.vue'
import Viewer from './Viewer.vue'
import ListOfMaterials from './ListOfMaterials.vue'

export default {
  name: 'MainLayout',
  components: {
    PageHeader,
    NavigationMenu,
    Viewer,
    ListOfMaterials
  },
  data() {
      return {
          ifcTree : new Object
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
