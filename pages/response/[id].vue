<script setup>
import {
  NIcon,
  NSpace,
  NSelect,
  NDivider,
  NInput,
  NBreadcrumb,
  NBreadcrumbItem,
  NTabs,
  NTabPane,
  NMessageProvider,
  NCode,
  NCard,
  NConfigProvider,
} from "naive-ui";
import {
  EllipsisHorizontalOutline,
  BarcodeOutline,
  CloseOutline,
  Add,
} from "@vicons/ionicons5";
import { Save, SaveAnnotation } from "@vicons/carbon";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";

hljs.registerLanguage("json", json);

const config = useRuntimeConfig();
const { id } = useRoute().params;
const uri = `${config.public.baseUrl}/v1/response.json?id=` + id;

const { data: Response } = await useFetch(uri);
const receivedData = ref("");
receivedData.value = Response.value.Body;
console.log(Response.value.Body);
const urirq = `${config.public.baseUrl}/v1/request.json?id=` + Response.value.ID;
const { data: request } = await useFetch(urirq);
console.log("Get Datarq");
console.log(request);
if (!request.value) {
  throw console.error("Request not found!");
}

const DataTB = ref([
  {
    key: 0,
    keyPm: "",
    value: "",
    description: "",
  },
  {
    key: 1,
    keyPm: "",
    value: "",
    description: "",
  },
  {
    key: 2,
    keyPm: "",
    value: "",
    description: "",
  },
]);
const DataTBHeader = ref([
  {
    key: 0,
    keyPm: "",
    value: "",
    description: "",
  },
  {
    key: 1,
    keyPm: "",
    value: "",
    description: "",
  },
  {
    key: 2,
    keyPm: "",
    value: "",
    description: "",
  },
]);
const selectValue = ref("GET");
console.log(selectValue);
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

const SaveAll = async () => {
  console.log(Response.value.ParentID);
  console.log(receivedData.value);
  const { data: SaveRp } = await useFetch(
    "http://127.0.0.1:8000/request/saveresponse.json",
    {
      method: "POST",
      body: {
        ExampleID: id,
        Body: receivedData.value,
      },
    }
  );
  const { data: SaveRq } = await useFetch("http://127.0.0.1:8000/request/save.json", {
    method: "POST",
    body: {
      ID: request.value.ID,
      ParentID: SaveRp.value.ID,
      Method: selectValue.value,
    },
  });
  const { data: sBody } = await useFetch("http://127.0.0.1:8000/request/savebody.json", {
    method: "POST",
    body: {
      ID: request.value.Body.ID,
      RequestID: SaveRq.value.ID,
      Raw: bodyData.value,
    },
  });
  const { data: sUrl } = await useFetch("http://127.0.0.1:8000/request/saveurl.json", {
    method: "POST",
    body: {
      ID: request.value.Url.ID,
      RequestID: SaveRq.value.ID,
      Raw: inputData.value,
    },
  });
  console.log(SaveRp.value);
  console.log(SaveRq.value);
  console.log(sBody.value);
  console.log(sUrl.value);
};

const updateDataTB = (newData) => {
  DataTB.value = newData;
};
const updateDataTBHeader = (newData) => {
  DataTBHeader.value = newData;
};
const goToHomePage = async () => {
  await navigateTo("/");
};

const bodyData = ref("");
const url = ref();
const inputData = ref();

if (request.value) {
  const data = request.value;
  console.log(data.value);
  const method = data.Method;
  console.log(method);
  selectValue.value = method;

  const headers = data.Headers;
  if (headers) {
    for (let i = 0; i < headers.length; i++) {
      DataTBHeader.value[i].keyPm = headers[i].Key;
      DataTBHeader.value[i].value = headers[i].Value;
      DataTBHeader.value[i].description = headers[i].Description;
    }
  }
  if (data.Body?.Raw != "") {
    bodyData.value = data.Body.Raw;
  }
  inputData.value = data.Url.Raw;
  console.log(selectValue);
  console.log(bodyData.value);
  console.log(DataTBHeader.value);
}

function replacer(key, value) {
  if (typeof value === "string") {
    return value.replace(/(\r\n|\n|\r|\s)+/gm, "");
  }
  return value;
}

const fetchData = async () => {
  let valueRaw = {};
  DataTB.value.reduce((acc, curr) => {
    if (curr.keyPm !== "") {
      valueRaw += `${curr.keyPm}:${curr.value},`;
    }
    return acc;
  }, {});
  console.log(valueRaw);
  console.log(bodyData.value);
  const method = selectValue.value;
  console.log(method);

  if (bodyData.value == "" || method == "GET") {
    const { data: temp } = await useFetch(inputData.value, {
      method: method,
    });
    console.log(temp.value);
    return (receivedData.value = JSON.stringify(temp.value, undefined, 2));
  }
  const body = JSON.parse(bodyData.value);
  const header = JSON.stringify(valueRaw).trim();
  console.log(inputData.value);
  console.log(header);
  console.log(body);

  const { data: temp } = await useFetch(inputData.value, {
    method: method,
    body: body,
    headers: {
      "Content-Type": "application/json",
      ...header,
    },
  });
  // console.log(temp);
  receivedData.value = JSON.stringify(temp.value, undefined, 2);
  console.log(receivedData.value);
  console.log(temp);
};
</script>

<template>
  <NMessageProvider>
    <!-- Request Tab Content -->
    <div id="main" class="flex flex-col grow px-2 max-h-screen">
      <div class="flex flex-row box-border items-center flex-nowrap">
        <div
          class="flex flex-nowrap justify-between h-12 items-center w-40 pl-4 flex-none"
        >
          <!-- <div class="color-emerald w-1/5">GET</div> -->
          <div class="w-3/5">New Example</div>
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
          <n-breadcrumb-item>New Example</n-breadcrumb-item>
        </n-breadcrumb>

        <div class="w-full flex justify-end">
          <!-- <button
            class="h-7 bg-white border-none hover:bg-gray-100 active:bg-gray-200 rounded items-center"
            @click="SaveRequest"
          >
            <NIcon size="20">
              <Save />
            </NIcon>
          </button> -->
          <button
            class="mx-2 h-7 bg-white border-none hover:bg-gray-100 active:bg-gray-200 rounded items-center"
            @click="SaveAll"
          >
            <NIcon size="20">
              <SaveAnnotation />
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
          @click="fetchData"
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
                v-model:value="bodyData"
              />
            </NTabPane>
          </NTabs>
          <pre>{{ JSON.stringify(url) }}</pre>
        </div>

        <NDivider vertical style="height: 100%" />

        <!-- main right (response) -->
        <div class="basis-1/2">
          <!-- <div class="h-10 items-center flex flex-row">
                <div class="w-15 border-b-4 border-slate-500">Response</div>
              </div>
              <div class="h-10 items-center flex flex-row">
                <div class="w-15 border-b-4 border-slate-500">Params</div>
                <div class="p-2 w-15">Headers</div>
                <div class="p-2 w-15">Body</div>
              </div> -->
          <NCard class="h-4/5">
            <n-config-provider :hljs="hljs">
              <NInput
                type="textarea"
                :autosize="{
                  minRows: 20,
                }"
                v-model:value="receivedData"
              >
                <NCode
                  language="json"
                  :code="receivedData"
                  show-line-numbers
                  word-wrap
                  class="basis-1/2"
                />
              </NInput>
            </n-config-provider>
          </NCard>
        </div>
      </div>
    </div>
  </NMessageProvider>
</template>
