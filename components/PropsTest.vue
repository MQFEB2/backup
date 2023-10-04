<template>
  <NCard class="h-4/5 overflow-auto">
    <n-config-provider :hljs="hljs">
      <NCode
        v-if="propsDatass"
        language="json"
        :code="propsDatass"
        show-line-numbers
        word-wrap
        class="basis-1/2"
      />
    </n-config-provider>
  </NCard>
</template>

<script setup>
import { NCode, NCard, NConfigProvider } from "naive-ui";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage("json", json);

const props = defineProps({
  propsDatass: {
    type: String,
    required: true,
  },
});

const inputData = ref("");
const childData = ref("");
const receivedData = ref("");

try {
  childData.value = props.propsDatass.replace(/\\n/g, "<br>").replace(/\\"/g, '"');
  console.log(childData);
} catch (err) {
  childData.value = props.propsDatass;
}

const fetchData = async () => {
  const { data: test } = await useFetch(inputData.value);
  receivedData.value = JSON.stringify(test.value, undefined, 2);
};
</script>
