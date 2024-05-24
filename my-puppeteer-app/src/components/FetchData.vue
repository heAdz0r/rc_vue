<template>
    <div>
      <h1>Fetched Data</h1>
      <pre>{{ data }}</pre>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        data: null
      };
    },
    methods: {
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
  
  <style scoped>
  pre {
    background: #f4f4f4;
    padding: 10px;
  }
  </style>
  