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
import axios from 'axios';

export default {
  name: 'App',
  components: {
    DataTable,
    FilterForm,
  },
  data() {
    return {
      data: null,
      filters: {
        startDate: null,
        endDate: null,
        projectId: '',
        groupBy: [],
      }
    };
  },
  methods: {
    async updateFilters(newFilters) {
      this.filters = newFilters;
      try {
        const response = await axios.post('http://localhost:3000/update-data', this.filters);
        if (response.status === 200) {
          const updatedData = await axios.get('http://localhost:3000/data.json');
          console.log('Fetched Data:', updatedData.data); // Вывод результата в консоль
          this.data = updatedData.data;
        }
      } catch (error) {
        console.error('Failed to update data:', error);
      }
    },
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:3000/data.json');
        console.log('Fetched Data:', response.data); // Вывод результата в консоль
        this.data = response.data;
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
  },
  created() {
    this.fetchData();
  }
};
</script>

<style>
@import '~vuetify/dist/vuetify.min.css';
</style>
