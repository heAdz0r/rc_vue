<template>
  <div>
    <h1>Fetched Data</h1>
    <pre>{{ data }}</pre>
  </div>
</template>

<script>

import data from '../../../data.json';

export default {
  data() {
    return {
      data
    };
  }
};
</script>

<style scoped>
pre {
  background: #f4f4f4;
  padding: 10px;
}
</style>
