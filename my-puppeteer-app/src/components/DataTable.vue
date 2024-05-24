<template>
    <v-container>
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-text-field
            v-model="search"
            label="Search"
            class="mx-4"
          ></v-text-field>
        </template>
        <template v-slot:[`item.user_id`]="{ item }">
          <span>{{ item.user_id ? item.user_id[1] : 'N/A' }}</span>
        </template>
        <template v-slot:[`item.unit_amount`]="{ item }">
          <span>{{ item.unit_amount }}</span>
        </template>
        <template v-slot:[`item.project_id`]="{ item }">
          <span>{{ item.project_id ? item.project_id[1] : 'N/A' }}</span>
        </template>
        <template v-slot:[`item.task_id`]="{ item }">
          <span>{{ item.task_id ? item.task_id[1] : 'N/A' }}</span>
        </template>
        <template v-slot:[`item.dateMonth`]="{ item }">
          <span>{{ item.dateMonth }}</span>
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script>
  export default {
    props: ['data'],
    data() {
      return {
        search: '',
        headers: [
          { text: 'User', value: 'user_id' },
          { text: 'Unit Amount', value: 'unit_amount' },
          { text: 'Project', value: 'project_id' },
          { text: 'Task', value: 'task_id' },
          { text: 'Date (Month)', value: 'dateMonth' },
        ],
        items: this.data.result.map(item => ({
          ...item,
          dateMonth: item['date:month']
        })),
      };
    },
    watch: {
      data(newData) {
        this.items = newData.result.map(item => ({
          ...item,
          dateMonth: item['date:month']
        }));
      }
    }
  };
  </script>
  
  <style scoped>
  .mx-4 {
    margin-left: 16px !important;
    margin-right: 16px !important;
  }
  </style>
  