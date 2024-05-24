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
          <span>{{ item.user_id[1] }}</span>
        </template>
        <template v-slot:[`item.unit_amount`]="{ item }">
          <span>{{ item.unit_amount }}</span>
        </template>
        <template v-slot:[`item.dateMonth`]="{ item }">
          <span>{{ item.dateMonth }}</span>
        </template>
      </v-data-table>
    </v-container>
  </template>
  
  <script>
  import data from '../../../data.json';
  
  export default {
    data() {
      return {
        search: '',
        headers: [
          {
            text: 'User',
            align: 'start',
            sortable: true,
            value: 'user_id',
          },
          { text: 'Unit Amount', value: 'unit_amount' },
          { text: 'Date (Month)', value: 'dateMonth' },
        ],
        items: data.result.map(item => ({
          ...item,
          dateMonth: item['date:month']
        })),
      };
    },
  };
  </script>
  
  <style scoped>
  .mx-4 {
    margin-left: 16px !important;
    margin-right: 16px !important;
  }
  </style>
  