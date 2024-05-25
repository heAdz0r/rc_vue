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
          label="Поиск"
          class="mx-4"
        ></v-text-field>
      </template>
      <template v-for="header in headers" :key="header.value" v-slot:[`item.${header.value}`]="{ item }">
        <span>{{ item[header.value] ? (Array.isArray(item[header.value]) ? item[header.value][1] : item[header.value]) : 'N/A' }}</span>
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
      headers: this.createHeaders(this.data),
      items: this.data ? this.data.result : []
    };
  },
  methods: {
    createHeaders(data) {
      if (!data || !data.result || data.result.length === 0) {
        return [];
      }
      return Object.keys(data.result[0]).map(key => ({
        text: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: key
      }));
    }
  },
  watch: {
    data(newData) {
      this.headers = this.createHeaders(newData);
      this.items = newData ? newData.result : [];
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
