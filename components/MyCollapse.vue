<script>
import { FolderOutline } from "@vicons/ionicons5";

export default {
    name: "MyCollapse",
    components: {
        FolderOutline,
    },
};
</script>

<template>
    <div class="flex">
        <div class="m-5">
            <n-collapse display-directive="show">
                <n-collapse-item name="1">
                    <template #title="{ open }">
                        <n-icon>
                            <FolderOutline />
                        </n-icon>
                        <span>New Folder</span>
                        <span v-if="open"> - (opened)</span>
                    </template>
                    <n-collapse-item name="4">
                        Your content here
                    </n-collapse-item>
                </n-collapse-item>
            </n-collapse>
        </div>
        <div class="grow">
            <div class="flex">
                <div class="w-1/5 bg-blue-500 text-white py-2 px-4 rounded">Trái 1</div>
                <div class="w-1/5 bg-blue-500 text-white py-2 px-4 rounded">Trái 2</div>
                <div class="w-4/5 flex justify-end">
                    <div class="bg-red-500 text-white py-2 px-4 rounded">Phải 1</div>
                    <div class="bg-red-500 text-white py-2 px-4 rounded">Phải 2</div>
                    <div class="bg-red-500 text-white py-2 px-4 rounded">Phải 3</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { NIcon, NCollapse, NCollapseItem } from "naive-ui";
</script>