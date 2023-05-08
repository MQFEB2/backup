<script>
import {
  NCard,
  NIcon,
  NSpace,
  NSelect,
  NDivider,
  NInput,
  NTable,
  NBreadcrumb,
  NBreadcrumbItem,
  NCode,
  NTabs,
  NTabPane,
  NDataTable,
} from "naive-ui";

import { Add } from "@vicons/ionicons5";
import {
  EllipsisHorizontalOutline,
  BarcodeOutline,
  CloseOutline,
} from "@vicons/ionicons5";
import { Save } from "@vicons/carbon";

export default defineComponent({
  components: {
    NCard,
    NDataTable,
    NIcon,
    NSpace,
    NSelect,
    NDivider,
    NInput,
    NTable,
    NBreadcrumb,
    NBreadcrumbItem,
    NCode,
    NTabPane,
    NTabs,
    Add,
    EllipsisHorizontalOutline,
    BarcodeOutline,
    CloseOutline,
    Save,
  },
  setup() {
    const DataTB = ref([
      {
        key: 0,
        keyPm: "request",
        value: "32",
        description: "New York No. 1 Lake Park",
      },
      {
        key: 1,
        keyPm: "request",
        value: "42",
        description: "London No. 1 Lake Park",
      },
      {
        key: 2,
        keyPm: "request",
        value: "32",
        description: "Sidney No. 1 Lake Park",
      },
    ]);
    const DataTBHeader = ref([
      {
        key: 0,
        keyPm: "id",
        value: "32",
        description: "",
      },
      {
        key: 1,
        keyPm: "username",
        value: "quaaan",
        description: "",
      },
      {
        key: 2,
        keyPm: "pw",
        value: "32",
        description: "",
      },
    ]);
    const selectValue = ref("GET");
    const Options = [
      {
        label: "GET",
        value: "GET",
      },
      {
        label: "PATCH",
        value: "PATCH",
      },
      {
        label: "POST",
        value: "POST",
      },
      {
        label: "DELETE",
        value: "DELETE",
      },
    ];

    const updateDataTB = (newData) => {
      DataTB.value = newData;
    };
    const updateDataTBHeader = (newData) => {
      DataTBHeader.value = newData;
    };
    function goToHomePage() {
      this.$router.push("/");
    }

    const url = ref();
    const inputData = ref();
    const receivedData = ref("");

    const getUrl = async () => {
      url.value = `${inputData.value},{method:${selectValue.value}}`;
      // const { data: temp } = await useFetch(url.value);
      receivedData.value = JSON.stringify(temp.value, undefined, 2);
    };

    const fetchData = async () => {
      const { data: temp } = await useFetch(inputData.value);
      receivedData.value = JSON.stringify(temp.value, undefined, 2);
    };

    return {
      selectValue,
      Options,
      DataTB,
      DataTBHeader,
      goToHomePage,
      inputData,
      receivedData,
      fetchData,
      updateDataTB,
      updateDataTBHeader,
      getUrl,
      url,
    };
  },
});
</script>

<template>
  <!-- Request Tab Content -->
  <div id="main" class="flex flex-col grow px-2 max-h-screen">
    <div class="flex flex-row box-border items-center flex-nowrap">
      <div class="flex flex-nowrap justify-between h-12 items-center w-40 pl-4 flex-none">
        <div class="color-emerald w-1/5">GET</div>
        <div class="w-3/5">New Request</div>
        <div class="flex justify-end h-5 w-1/5">
          <button
            class="p0 bg-white border-none hover:bg-gray-100 active:bg-gray-200 rounded items-center h-5"
            @click="goToHomePage"
          >
            <NIcon size="20">
              <CloseOutline />
            </NIcon>
          </button>
        </div>
      </div>

      <NDivider vertical style="height: 100%" />

      <button
        class="p0 bg-white border-none hover:bg-gray-100 active:bg-gray-200 rounded items-center h-5"
      >
        <NIcon size="20">
          <Add />
        </NIcon>
      </button>

      <div class="w-4/5 flex justify-end py-2 px-4">
        <button
          class="h-7 bg-white border-none hover:bg-gray-100 active:bg-gray-200 rounded items-center"
        >
          <NIcon size="20">
            <BarcodeOutline />
          </NIcon>
        </button>
      </div>
    </div>

    <NDivider style="margin-top: 0px; margin-bottom: 0px; width: 100%" />

    <div class="h-12 mx-1 items-center flex flex-row">
      <n-breadcrumb>
        <n-breadcrumb-item>Collection</n-breadcrumb-item>
        <n-breadcrumb-item>New Request</n-breadcrumb-item>
      </n-breadcrumb>

      <div class="w-full flex justify-end">
        <button
          class="h-7 bg-white border-none hover:bg-gray-100 active:bg-gray-200 rounded items-center"
        >
          <NIcon size="20">
            <Save />
          </NIcon>
        </button>
        <button
          class="mx-2 h-7 bg-white border-none hover:bg-gray-100 active:bg-gray-200 rounded items-center"
        >
          <NIcon size="20">
            <EllipsisHorizontalOutline />
          </NIcon>
        </button>
      </div>
    </div>

    <NDivider style="margin-top: 0px; margin-bottom: 0px; width: 100%" />

    <div class="h-12 mx-1 items-center flex flex-row">
      <NSpace vertical>
        <NSelect v-model:value="selectValue" filterable :options="Options" />
      </NSpace>
      <NInput type="text" placeholder="Enter URL" v-model:value="inputData" />
      <button
        class="mx-2 w-20 h-8 font-bold text-white bg-blue-600 border-none hover:bg-blue-700 active:bg-blue-900 rounded"
        @click="getUrl"
      >
        Send
      </button>
    </div>
    <NDivider style="margin-top: 0px; margin-bottom: 0px; width: 100%" />

    <div class="flex flex-row h-5/6">
      <!-- main left (request) -->
      <div class="basis-1/2">
        <NTabs
          default-value="Params"
          size="medium"
          animated
          style="margin: 0 6px -4px"
          pane-style="padding-left: 0px; padding-right: 4px; box-sizing: border-box;"
        >
          <NTabPane name="Params" tab="Params">
            <div class="pb-3 mx-1 items-center flex">
              <div class="text-slate-700">Query Params</div>
            </div>
            <DataTable :data="DataTB" @update:data="updateDataTB" />
          </NTabPane>
          <NTabPane name="Headers" tab="Headers">
            <div class="pb-3 mx-1 text-slate-700">Headers</div>
            <DataTable :data="DataTBHeader" @update:data="updateDataTBHeader" />
          </NTabPane>

          <NTabPane name="Body" tab="Body">
            <NInput
              type="textarea"
              :autosize="{
                minRows: 20,
              }"
            />
          </NTabPane>
        </NTabs>
        <pre>{{ JSON.stringify(url) }}</pre>
      </div>

      <NDivider vertical style="height: 100%" />

      <!-- main right (response) -->
      <div class="basis-1/2">
        <div class="h-10 items-center flex flex-row">
          <div class="w-15 border-b-4 border-slate-500">Response</div>
        </div>
        <div class="h-10 items-center flex flex-row">
          <div class="w-15 border-b-4 border-slate-500">Params</div>
          <div class="p-2 w-15">Headers</div>
          <div class="p-2 w-15">Body</div>
        </div>
        <PropsTest :propsDatass="receivedData" />
      </div>
    </div>
  </div>
</template>
