<template>
  <v-form @submit.prevent="applyFilters">
    <v-row>
      <v-col cols="12" md="4">
        <v-menu
          ref="startMenu"
          v-model="startMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="startDate"
              label="Начальная дата"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="startDate" @input="startMenu = false"></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" md="4">
        <v-menu
          ref="endMenu"
          v-model="endMenu"
          :close-on-content-click="false"
          :nudge-right="40"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="endDate"
              label="Конечная дата"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker v-model="endDate" @input="endMenu = false"></v-date-picker>
        </v-menu>
      </v-col>

      <v-col cols="12" md="4">
        <v-text-field v-model="projectId" label="ID проекта"></v-text-field>
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          v-model="groupBy"
          :items="groupByItems"
          label="Группировка"
          multiple
        ></v-select>
      </v-col>

      <v-col cols="12" md="4">
        <v-btn @click="applyFilters" color="primary">Выполнить запрос</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      startDate: null,
      endDate: null,
      startMenu: false,
      endMenu: false,
      projectId: '',
      groupBy: [],
      groupByItems: ['user_id', 'project_id', 'task_id', 'date', 'unit_amount']
    };
  },
  methods: {
    applyFilters() {
      this.$emit('update-filters', {
        startDate: this.startDate,
        endDate: this.endDate,
        projectId: this.projectId,
        groupBy: this.groupBy,
      });
    },
  },
};
</script>
