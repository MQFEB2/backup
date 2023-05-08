<template>
  <div>
    <h1>Example Component</h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else>{{ responseData }}</div>
  </div>
</template>

<script>
import { useFetch } from "@nuxtjs/composition-api";

export default {
  setup() {
    const { fetch } = useFetch();

    const fetchData = async () => {
      const url = "https://example.com/api/data";
      const method = "POST";
      const headers = {
        "Content-Type": "application/json",
      };
      const body = {
        param1: "value1",
        param2: "value2",
      };

      const responseData = await fetch(url, { method, headers, body });
      console.log(responseData);

      return responseData;
    };

    return {
      isLoading: fetchData.loading,
      responseData: fetchData.data,
    };
  },
};
</script>
