<template>
  <v-app>
    <v-main>
      <v-container>
        <FilterForm @update-filters="updateFilters" />
        <DataTable :data="data" />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import DataTable from './components/DataTable.vue';
import FilterForm from './components/FilterForm.vue';
import data from '../data.json';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    DataTable,
    FilterForm,
  },
  data() {
    return {
      data
    };
  },
  methods: {
    async updateFilters(filters) {
      try {
        await axios.post('http://localhost:3000/update-data', filters);
        const updatedData = await import('../data.json');
        this.data = updatedData.default;
      } catch (error) {
        console.error('Failed to update data:', error);
      }
    }
  },
};
</script>

<style>
@import '~vuetify/dist/vuetify.min.css';
</style>
