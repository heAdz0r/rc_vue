<template>
    <div>
      <form @submit.prevent="applyFilters">
        <label>
          Дата (диапазон):
          <input type="date" v-model="startDate">
          <input type="date" v-model="endDate">
        </label>
        <label>
          Проект:
          <input type="text" v-model="projectId">
        </label>
        <label>
          Группировка:
          <select v-model="groupBy">
            <option value="user_id">User ID</option>
            <option value="project_id">Project ID</option>
            <option value="task_id">Task ID</option>
          </select>
        </label>
        <button type="submit">Выполнить запрос</button>
      </form>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        startDate: '',
        endDate: '',
        projectId: '',
        groupBy: 'user_id',
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
  