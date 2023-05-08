<template>
  <NDataTable :columns="columns" :data="data" :pagination="pagination" />
  <!-- <pre>{{ JSON.stringify(data, null, 2) }}</pre> -->
</template>

<script>
import { h, defineComponent, ref, watch } from "vue";
import { NDataTable, NInput } from "naive-ui";

export default defineComponent({
  props: {
    data: {
      type: Array,
      required: true,
    },
  },
  emits: ["update:data"],
  setup(props, { emit }) {
    const data = ref(props.data);
    const createColumns = () => [
      {
        title: "KeyPm",
        key: "keyPm",
        render(row, index) {
          return h(NInput, {
            value: props.data[index].keyPm,
            onUpdateValue(v) {
              const newData = [...data.value];
              newData[index].keyPm = v;
              data.value = newData;
              emit("update:data", newData);
            },
          });
        },
      },
      {
        title: "Value",
        key: "value",
        render(row, index) {
          return h(NInput, {
            value: props.data[index].value,
            onUpdateValue(v) {
              const newData = [...data.value];
              newData[index].value = v;
              data.value = newData;
              emit("update:data", newData);
            },
          });
        },
      },
      {
        title: "Description",
        key: "description",
        render(row, index) {
          return h(NInput, {
            value: props.data[index].description,
            onUpdateValue(v) {
              const newData = [...data.value];
              newData[index].description = v;
              data.value = newData;
              emit("update:data", newData);
            },
          });
        },
      },
    ];

    watch(props, (newProps) => {
      data.value = newProps.data;
    });

    return {
      data,
      columns: createColumns(),
      pagination: {
        pageSize: 10,
      },
    };
  },
  components: { NDataTable },
});
</script>
