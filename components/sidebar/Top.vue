<template>
  <div class="p2 z-20 flex flex-row mt-2">
    <button
      class="p0 h-7 bg-slate-50 border-none hover:bg-gray-100 active:bg-gray-200 rounded items-center"
    >
      <NIcon size="28">
        <Add />
      </NIcon>
    </button>
    <div class="relative pl-1">
      <div class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
        <NIcon size="18" class="w-5 h-5 text-gray-400">
          <Filter />
        </NIcon>
      </div>
      <input
        v-model="tempid"
        type="text"
        placeholder="Filter"
        class="h-6 border-1 border-slate-200 bg-slate-50 pl-9 p-0.5 text-gray-900 hover:bg-gray-100 hover:focus:bg-white focus:bg-white focus:outline-none"
      />
    </div>
    <NUpload :show-file-list="false" accept=".json">
      <button
        class="ml-2 px-1 h-7 bg-slate-50 border-none hover:bg-gray-100 active:bg-gray-200 rounded items-center"
      >
        <NIcon size="20"> <DocumentImport /> </NIcon>
      </button>
    </NUpload>
  </div>
</template>

<script setup>
import {
  NInput,
  NButton,
  NDropdown,
  NIcon,
  NCollapse,
  NCollapseItem,
  NDivider,
  NMessageProvider,
  NUpload,
} from "naive-ui";
import { saveAs } from "file-saver";
import { Add } from "@vicons/ionicons5";
import { Filter, EllipsisHorizontalOutline } from "@vicons/ionicons5";
import { Folder, DocumentImport } from "@vicons/carbon";
const config = useRuntimeConfig();

const { data: Collection } = await useFetch(
  `${config.public.baseUrl}/v1/collection.json`
);

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})

const emitSearch = defineEmits({
  // No validation
  click: null,

  // Validate submit event
  submit: ({ email, password }) => {
    if (email && password) {
      return true
    } else {
      console.warn('Invalid submit event payload!')
      return false
    }
  }
})

function submitForm(email, password) {
  emit('submit', { email, password })
}
</script>
