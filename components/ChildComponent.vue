<template>
  <div>
    <p>Data fetched from server: {{ dataFetch }}</p>
    <NCard class="h-4/5">
      <n-config-provider :hljs="hljs">
        <NCode v-if="dataFetch" language="json" :code="dataFetch" show-line-numbers />
      </n-config-provider>
    </NCard>
  </div>
</template>

<script>
import { NCode, NCard, NConfigProvider } from "naive-ui";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage("json", json);

export default defineComponent({
  name: "ChildComponent",
  props: {
    data: {
      type: String,
      default: "",
    },
  },
  setup(props, { emit }) {
    const dataFetch = ref("");

    const fetchData = async () => {
      if (!props.data) return (dataFetch.value = "");
      dataFetch.value = await useFetch(`${props.data}`);
      emit("onData", dataFetch);
    };

    onMounted(() => {
      fetchData();
    });

    watchEffect(() => {
      fetchData();
    });

    return {
      dataFetch,
    };
  },
});
</script>

<!--
// export default {
//   name: "ChildComponent",
//   data() {
//     return {
//         dataFetch: ''
//     }
//   },
//   props: {
//     data: {
//       type: String,
//       default: "",
//     },
//   },
//   methods: {
//     sendDataToParent() {
//       this.$emit("onData", "Data sent from ChildComponent");
//     },
//     fetchData() {
//         this.dataFetch = await useFetch(`${data}`)
//     }
//   },
// };
// </script>

// <script>
// export default {
//   name: "ChildComponent",
//   setup() {
//     const state = ref({
//       dataFetch: "",
//     });

//     const fetchData = async () => {
//       state.dataFetch = await useFetch(`${data}`);
//     };

//     return {
//       ...state,
//       fetchData,
//     };
//   },
// };
// </script>
-->
<!-- <p>{{ data }}</p>
    <button @click="sendDataToParent">Send Data to Parent</button> -->
