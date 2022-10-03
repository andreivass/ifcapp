<template>
    <div>Mudeli peal saab korraga kuvada ainult ühte tööpaketti</div>
    <table class="table table-hover" id="wp-table">
        <thead>
            <tr>
                <!-- <th scope="col">Vali</th> -->
                <th scope="col">Id</th>
                <th scope="col">Wp nimi</th>
                <th scope="col">Klassifikaator</th>
                <th scope="col">Kogus elemente</th>
                <th scope="col">Näita/peida mudelil</th>
            </tr>
        </thead>
        <tbody v-if="workPackages.length > 0">
            <tr v-for="(wp) in workPackages" :key=wp.workPackageId>
                <!-- <td><input type="checkbox" id="checkbox" v-model="wp.selected" 
                    @change="elementSelect(wp)"></td> -->
                <td>{{ wp.workPackageId }}</td>
                <td>{{ wp.name }}</td>
                <td>{{ wp.cciEePpId }}</td>
                <td>{{ wp.modelElements.length }}</td>
                <td><button @click.prevent="elementSelect(wp)">Vali</button></td>
            </tr>
        </tbody>
        <tbody v-else>
            <tr>
                Andmed ei ole veel sisse laetud.
            </tr>
        </tbody>
    </table>
</template>

<script>
export default {
  name: 'ListOfWorkPackages',
  props: [
      'workPackages', 'workPackageViewEnabled'
  ],
  emits: [ 'listElementsSelectionChange' ],
  data() {
    return {
        wpListSelectedElements: [],
        ifcElementsArray: []
    }
  },
  methods: {
    updateListOfElements(elementsArray){
      this.ifcElementsArray = elementsArray;
    },
    // Add IFC element to selected elements
    elementSelect(element){
        console.log('wp selecetd:', element)
        if (this.wpListSelectedElements.length == 0){
            element.modelElements.forEach(element => {
                element.expressID = element.expressId;
                this.wpListSelectedElements.push(element)
            });
        } else {
            this.wpListSelectedElements = [];
        }
        
        this.$emit('listElementsSelectionChange', this.wpListSelectedElements);
    },
    clearSelectedElements(){
        this.wpListSelectedElements = [];
        this.workPackages.forEach(x => x.selected = false);
        this.$emit('listElementsSelectionChange', this.wpListSelectedElements);
    }
  }
}
</script>