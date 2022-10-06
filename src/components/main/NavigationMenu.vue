<template>
    <nav class="nav flex-column nav-pills">
        <div class="sidebar-header">
            <h4>Vali vaade</h4>
        </div>
      <div class="navbar-nav mr-auto">
        <li class="nav-item">
          <button @click.prevent="onClickViewIfcElements" class="nav-link">IFC elemendid</button>
        </li>
        <li class="nav-item">
          <button @click.prevent="onClickViewWorkPackages" class="nav-link">Tööpaketid</button>
        </li>
      </div>
    </nav>
</template>

<script>
  export default {
    name: 'NavigationMenu',
    emits: ['changeViewToIfc', 'changeViewToWp'],
    data() {
      return {
          ifcElementsArray: new Array,
          materialsListSelectedElements: new Array,
          showModal: false,
          wpModalHeader: '',
          classificators: [],
          anyClassificator: false,
          workPackages: []
      }
    },
    methods: {
      onClickViewIfcElements(){
        this.$emit('changeViewToIfc');
      },
      onClickViewWorkPackages(){
        this.$emit('changeViewToWp');
      }
    }
  }
  </script>