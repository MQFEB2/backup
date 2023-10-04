<template>
  <div>
    <n-dropdown
      trigger="click"
      placement="bottom-end"
      :options="Options"
      @select="handleSelect"
    >
      <NIcon size="18" class="w-5 h-5 text-gray-400">
        <EllipsisHorizontalOutline />
      </NIcon>
    </n-dropdown>
  </div>
</template>

<script setup>
import { NIcon, NDropdown } from "naive-ui";
import { EllipsisHorizontalOutline } from "@vicons/ionicons5";

const props = defineProps({
  Options: {
    type: Array,
    required: true,
  },
  Target: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["selectedOption"]);

function handleSelect(Key) {
  emit("selectedOption", { key: Key, id: props.Target });
}
</script>
