<template>
    <div>

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
</script>