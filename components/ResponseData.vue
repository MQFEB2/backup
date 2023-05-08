<template>
  <NCard class="h-4/5">
    <n-config-provider :hljs="hljs">
      <NCode
        v-if="formattedResponseData"
        language="json"
        :code="formattedResponseData"
        show-line-numbers
      />
    </n-config-provider>
  </NCard>
</template>

<script setup>
import { NCode, NCard, NConfigProvider } from "naive-ui";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage("json", json);

const formattedResponseData = ref(null);

const props = defineProps({
  Url: {
    type: String,
    required: true,
  },
});

const fetchData = async (url) => {
  try {
    const { data } = await useFetch(url);
    formatResponseData(data);
  } catch (error) {
    console.error(error);
    formattedResponseData.value = error.message;
  }
};

watchEffect(() => {
  fetchData(props.Url);
});

const formatResponseData = (data) => {
  const jsonData = JSON.parse(data);
  formattedResponseData.value = JSON.stringify(jsonData, null, 2);
};
</script>
