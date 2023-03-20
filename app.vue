<script>
export default defineComponent({
  setup () {
    return {
      selectValue: ref(null),
      options: [
        {
          label: 'Drive My Car',
          value: 'song1'
        },
        {
          label: 'Norwegian Wood',
          value: 'song2'
        },
        {
          label: 'Nowhere Man',
          value: 'song4'
        },
      ]
    }
  }
})
</script>

<template>
  <n-space vertical>
    <n-select v-model:value="selectValue" filterable tag :options="options" />
  </n-space>
</template>
<script setup>
import { NSpace,NSelect } from 'naive-ui';
</script>
