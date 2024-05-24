<template>
  <v-app>
    <v-main>
      <v-container>
        <DataTable />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import DataTable from './components/DataTable.vue';

export default {
  name: 'App',
  components: {
    DataTable,
  },
};
</script>

<style>
@import '~vuetify/dist/vuetify.min.css';
</style>
