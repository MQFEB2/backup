<template>
  <div class="flex flex-row m0 h-screen">
    <div id="sidebar" class="bg-gray-50 flex flex-col w-80 h-screen items-center">
      <!-- Add collection, search bar -->
      <div class="p2 z-20 flex flex-row mt-2">
        <button
          @click="addItem"
          class="p0 h-7 bg-slate-50 border-none hover:bg-gray-100 active:bg-gray-200 rounded items-center"
        >
          <NIcon size="28">
            <Add />
          </NIcon>
        </button>
        <div class="relative pl-1">
          <div
            class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none z-99"
          >
            <NIcon size="18" class="h-5 text-gray-400">
              <Filter />
            </NIcon>
          </div>
          <!-- <n-input v-model:value="pattern" placeholder="Search" class="h-full" /> -->
          <input
            v-model="pattern"
            type="text"
            placeholder="Filter"
            class="h-6 border-1 border-slate-200 bg-slate-50 pl-9 p-0.5 text-gray-900 hover:bg-gray-100 hover:focus:bg-white focus:bg-white focus:outline-none"
          />
        </div>
        <NUpload :show-file-list="false" accept=".json" @change="handleFileChange">
          <button
            class="ml-2 px-1 h-7 bg-slate-50 border-none hover:bg-gray-100 active:bg-gray-200 rounded items-center"
          >
            <NIcon size="20"> <CloudUpload /> </NIcon>
          </button>
        </NUpload>
      </div>

      <!-- Collection sidebar list -->
      <div class="mt-5 w-4/5 p2 overflow-y-auto">
        <NTree
          :data="Item"
          block-node
          :pattern="pattern"
          :node-props="nodeProps"
          :render-switcher-icon="renderSwitcherIcon"
          :selectable="false"
        />
        <!-- <SidebarOptions
          @selectedOption="hanleOptionSelected"
          :Options="optionsForFolder"
          Target="abc"
        ></SidebarOptions> -->
      </div>
    </div>
    <div id="main" class="flex flex-col grow px-2 max-h-screen">
      <slot />
      <pre>{{ JSON.stringify(Item, null, 2) }}</pre>
    </div>
  </div>
</template>

<script setup>
import { saveAs } from "file-saver";
import { Add } from "@vicons/ionicons5";
import { Filter, EllipsisHorizontalOutline, CloudUpload } from "@vicons/ionicons5";
import { Folder, DocumentImport, Json } from "@vicons/carbon";
import SidebarOptions from "../components/sidebar/Options.vue";
import { useMessage, NTree, NButton, NIcon, NDropdown, NUpload, NInput } from "naive-ui";
import {
  ChevronForward,
  Folder as FolderIon,
  FolderOpenOutline,
  FileTrayFullOutline,
} from "@vicons/ionicons5";

const getCol = ref();
const pattern = ref();

const message = useMessage();
const config = useRuntimeConfig();
const renderSwitcherIcon = () => h(NIcon, null, { default: () => h(ChevronForward) });
const { data: Collection } = await useFetch(
  `${config.public.baseUrl}/v1/collection.json`
);
async function hanleOptionSelected(key) {
  if (key.key === "add request" && key.id) {
    const { data: request } = await useFetch(`${config.public.baseUrl}/v1/request.json`, {
      method: "POST",
      body: {
        id: key.id,
      },
    });
    let format = FomatData(request.value);
    // console.log(
    //   "🚀 ~ file: Default.vue:89 ~ hanleOptionSelected ~ request:",
    //   request.value
    // );
    const isAppended = appendDataToElementWithId(Item.value, key.id, format);

    if (isAppended) {
      console.log("Dữ liệu đã được append vào phần tử có id tương ứng.");
    } else {
      console.log("Không tìm thấy phần tử có id tương ứng.");
    }
  }
  console.log("🚀 ~ file: test.vue:32 ~ key ~ key:", key);
}

function FomatData(data) {
  let dataFormated = {
    key: data.id,
    label: data.name,
    suffix: () =>
      h(SidebarOptions, {
        onSelectedOption: hanleOptionSelected,
        Options: optionsForFolder,
        Target: data.id,
      }),
    prefix: () =>
      h(
        NIcon,
        { size: 22 },
        {
          default: () => h(Json),
        }
      ),
  };
  if (data?.type) {
    dataFormated.type = data.type;
  }
  // if (obj?.item) {
  //   formattedObj.children = [];
  //   formattedObj.prefix = null;
  // }
  if (data?.type == "folder") {
    dataFormated.children = [];
    dataFormated.prefix = () =>
      h(
        NIcon,
        { size: 18 },
        {
          default: () => h(FolderOpenOutline),
        }
      );
  }

  if (data?.type == "request") {
    dataFormated.prefix = () =>
      h(
        NButton,
        { text: true, type: buttonType(data?.request?.method) },
        { default: () => data?.request?.method || "GET" }
      );
  }
  return dataFormated;
}
const optionsForFolder = [
  {
    label: "Add Request",
    key: "add request",
  },
  {
    label: "Rename",
    key: "Rename",
  },
  {
    label: "Delete",
    key: "DeleteFd",
  },
];
const Item = ref([]);

function buttonType(method) {
  switch (method) {
    case "GET":
      return "primary";
    case "POST":
      return "warning";
    case "DELETE":
      return "error";
    case "PATCH":
    case "PUT":
      return "info";
    default:
      return "primary";
  }
}

const nodeProps = ({ option }) => {
  return {
    async onClick() {
      if (option.type == "request") {
        await navigateTo(`/request/${option.key}`);
      }
      console.log("🚀 ~ file: Default.vue:196 ~ onClick ~ key:", option.key);

      if (!option.children && !option.disabled && option.type == undefined) {
        await navigateTo(`/response/${option.key}`);
      }
    },
  };
};

const updatePrefixWithExpaned = (_keys, _option, meta) => {
  console.log("🚀 ~ file: test.vue:83 ~ updatePrefixWithExpaned ~ _keys:", _keys);
  console.log("🚀 ~ file: test.vue:83 ~ updatePrefixWithExpaned ~ _option:", _option);
  if (!meta.node) return;
  switch (meta.action) {
    case "expand":
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(FolderOpenOutline),
        });
      break;
    case "collapse":
      meta.node.prefix = () =>
        h(NIcon, null, {
          default: () => h(Folder),
        });
      break;
  }
};

function traverseAndFormat(obj) {
  if (!obj) {
    return null;
  }

  const formattedObj = {
    key: obj.id,
    label: obj.name,
    suffix: () =>
      h(SidebarOptions, {
        onSelectedOption: hanleOptionSelected,
        Options: optionsForFolder,
        Target: obj.id,
      }),
    prefix: () =>
      h(
        NIcon,
        { size: 22 },
        {
          default: () => h(Json),
        }
      ),
  };
  if (obj?.item) {
    formattedObj.children = [];
    formattedObj.prefix = null;
  }
  if (obj.type == "folder") {
    formattedObj.children = [];
    formattedObj.prefix = () =>
      h(
        NIcon,
        { size: 18 },
        {
          default: () => h(FolderOpenOutline),
        }
      );
  }

  if (obj?.type == "request") {
    formattedObj.type = obj.type;
    formattedObj.prefix = () =>
      h(
        NButton,
        { text: true, type: buttonType(obj?.request?.method) },
        { default: () => obj?.request?.method || "GET" }
      );
  }

  if (obj.item && obj.item.length > 0) {
    obj.item?.forEach((item) => {
      const child = traverseAndFormat(item);
      formattedObj.children.push(child);
    });
  }

  if (obj.response && obj.response.length > 0) {
    formattedObj.children = [];
    obj.response?.forEach((item) => {
      const child = traverseAndFormat(item);
      formattedObj.children.push(child);
    });
  }

  if (obj?.item || obj.type == "folder") {
    if (formattedObj.children && formattedObj.children.length == 0) {
      const nullObj = {
        key: obj.id + "1",
        label:
          "This " +
          (obj.type === "folder" ? obj.type : "collection") +
          " is empty add request to start working.",
        disabled: true,
      };
      formattedObj.children.push(nullObj);
    }
  }

  return formattedObj;
}

Collection.value.forEach((collection) => {
  const processedCollection = traverseAndFormat(collection);
  Item.value.push(processedCollection);
});
// console.log("🚀 ~ file: Default.vue:247 ~ Collection.value.forEach ~ Item:", Item.value);

function appendDataToElementWithId(arr, id, newData) {
  for (const item of arr) {
    if (item.key === id) {
      if (!item.children) {
        item.children = [];
      }
      item.children.push(newData);
      return true; // Đã tìm thấy và append dữ liệu
    }
    if (item.children && appendDataToElementWithId(item.children, id, newData)) {
      return true; // Đã tìm thấy và append dữ liệu
    }
  }
  return false; // Không tìm thấy phần tử có id tương ứng
}

const newData = {
  key: "new-key",
  label: "New Data",
};

// Id của phần tử mà bạn muốn append dữ liệu
const targetId = "af3103f5-e75f-41c1-b416-7a3f86a52692"; // Ví dụ id này

// Gọi hàm đệ quy để append dữ liệu vào phần tử có id tương ứng
function AppendItem() {
  const isAppended = appendDataToElementWithId(Item.value, targetId, newData);

  if (isAppended) {
    console.log("Dữ liệu đã được append vào phần tử có id tương ứng.");
  } else {
    console.log("Không tìm thấy phần tử có id tương ứng.");
  }
}

const options = ref([
  {
    label: "Add Folder",
    key: "Add Folder",
  },
  {
    label: "Add Request",
    key: "Add Request",
  },
  {
    label: "Rename",
    key: "Rename",
  },
  {
    label: "Delete",
    key: "DeleteClt",
  },
  {
    label: "Export",
    key: "Export",
  },
]);

// const optionsForFolder = ref([
//   {
//     label: "Add Request",
//     key: "Add Request",
//   },
//   {
//     label: "Rename",
//     key: "Rename",
//   },
//   {
//     label: "Delete",
//     key: "DeleteFd",
//   },
// ]);

const optionsForRequest = ref([
  {
    label: "Add Example",
    key: "Example",
  },
  {
    label: "Rename",
    key: "Rename",
  },
  {
    label: "Delete",
    key: "DeleteRq",
  },
]);

const optionsForExample = ref([
  {
    label: "Rename",
    key: "Rename",
  },
  {
    label: "Delete",
    key: "DeleteEx",
  },
]);

// const { data: Collection } = await useFetch(
//   `${config.public.baseUrl}/v1/collection.json`
// );

getCol.value = Collection.value;
Collection.value = getCol.value;
// console.log(Collection.value);

const addItem = async () => {
  const { data: NewClt } = await useFetch(`http://127.0.0.1:8000/collection/new.json`, {
    method: "POST",
  });
  // console.log(NewClt);
  if (NewClt.value.ID !== undefined && NewClt.value.ID !== "") {
    const newItem = {
      ID: NewClt.value.ID,
      Name: NewClt.value.Name,
      item: [],
    };
    console.log(newItem.ID);
    Collection.value.push(newItem);
  } else {
    console.log("Error occur");
  }
};

const deleteItem = (id) => {
  Collection.value = Collection.value.filter((item) => {
    if (item.ID === id) {
      return false;
    }
    if (item.item?.length) {
      item.item.forEach((folder, folderIndex) => {
        if (folder.ID === id) {
          item.item.splice(folderIndex, 1);
        } else if (folder.item?.length) {
          folder.item.forEach((childFolder, childFolderIndex) => {
            if (childFolder.ID === id) {
              folder.item.splice(childFolderIndex, 1);
            } else if (childFolder.response?.length) {
              childFolder.response = childFolder.response.filter((i) => i.ID !== id);
            }
          });
        }
        if (folder.response?.length) {
          folder.response = folder.response.filter((i) => i.ID !== id);
        }
      });
    }
    return true;
  });
};

const ChangeCollectionName = async (v, ID) => {
  const { data } = await useFetch(`http://127.0.0.1:8000/collection/name.json`, {
    method: "PATCH",
    body: { ID: ID, Name: v },
  });
  console.log(data.value);
  active.value = "";
  console.log(v);
  console.log(ID);
};

const ChangeFolderName = async (v, ID) => {
  const { data } = await useFetch(`http://127.0.0.1:8000/collection/foldername.json`, {
    method: "PATCH",
    body: { ID: ID, Name: v },
  });
  console.log(data.value);
  active.value = "";
};

const ChangeRequestName = async (v, ID) => {
  const { data } = await useFetch(`http://127.0.0.1:8000/collection/requestname.json`, {
    method: "PATCH",
    body: { ID: ID, Name: v },
  });
  console.log(data.value);
  active.value = "";
};

const ChangeExampleName = async (v, ID) => {
  const { data } = await useFetch(`http://127.0.0.1:8000/collection/examplename.json`, {
    method: "PATCH",
    body: { ID: ID, Name: v },
  });
  console.log(data.value);
  active.value = "";
};

const handleSelect = async (itemID, key, option, ...index) => {
  if (key === "Export") {
    saveAs(`http://127.0.0.1:8000/collection/export.json/${itemID}`, `${itemID}`);
    // try {
    //   const response = await fetch(
    //     `http://127.0.0.1:8000/collection/export.json/${itemID}`
    //   );
    //   console.log(response);
    //   const blob = await response.blob();
    //   console.log(blob);
    //   saveAs(blob);
    // } catch (error) {
    //   console.error(error);
    // }
    return console.log("Item export: " + itemID);
  }

  if (key === "DeleteClt") {
    console.log(itemID);
    const { data } = await useFetch(`http://127.0.0.1:8000/collection/delete.json`, {
      method: "DELETE",
      body: { id: itemID },
    });
    // console.log(data);
    if (data.value.ID == itemID) {
      deleteItem(itemID);
    } else {
      return console.error("Error Detele");
    }
    return console.log("Item delete: " + itemID);
  }

  if (key === "DeleteFd") {
    console.log(itemID);
    const { data } = await useFetch(`http://127.0.0.1:8000/collection/delfolder.json`, {
      method: "DELETE",
      body: { id: itemID },
    });
    // console.log(data);
    if (data.value.ID == itemID) {
      deleteItem(itemID);
    } else {
      return console.error("Error Detele");
    }
    return console.log("Folder delete: " + itemID);
  }

  if (key === "DeleteRq") {
    console.log(itemID);
    const { data } = await useFetch(`http://127.0.0.1:8000/collection/delrequest.json`, {
      method: "DELETE",
      body: { id: itemID },
    });
    console.log(data);
    if (data.value.ID == itemID) {
      deleteItem(itemID);
    } else {
      return console.error("Error Detele");
    }
    return console.log("Folder delete: " + itemID);
  }

  if (key === "DeleteEx") {
    console.log(itemID);
    deleteItem(itemID);
    // if (data.value.ID == itemID) {
    //   deleteItem(itemID);
    // } else {
    //   return console.error("Error Detele");
    // }
    return console.log("Ex delete: " + itemID);
  }

  if (key === "Rename") {
    console.log(index);
    active.value = itemID;
    console.log(active);
    console.log(Collection);
    console.log(active);
    console.log(Collection);
    return console.log("Item rename: " + itemID);
  }

  if (key === "Add Folder") {
    const { data } = await useFetch(`http://127.0.0.1:8000/collection/newfolder.json`, {
      method: "POST",
      body: { id: itemID },
    });
    console.log(index);
    console.log(data);
    if (data.value.ID === "" || data.value.ID === undefined) {
      return console.error("Add folder Error");
    }
    Collection.value[index].item.push(data.value);
    console.log(Collection.value[index].item);
    return console.log("Item addfd: " + itemID);
  }

  if (key === "Add Request") {
    const { data } = await useFetch(`http://127.0.0.1:8000/collection/newrequest.json`, {
      method: "POST",
      body: { id: itemID },
    });
    console.log(data);
    if (data.value.ID === "" || data.value.ID === undefined) {
      return console.error("Add request Error");
    }
    console.log(index);
    if (index.length == 1) {
      Collection.value[index].item.push(data.value);
      console.log(Collection.value[index].item);
    }
    if (index.length > 1) {
      Collection.value[index[0]].item[index[1]].item.push(data.value);
      console.log(Collection.value[index[0]].item[index[1]].item);
    }
    console.log(Collection);
    return console.log("Item addRq: " + itemID);
  }

  if (key === "Example") {
    const { data } = await useFetch(
      `http://127.0.0.1:8000/request/createexamplesidebar.json`,
      {
        method: "POST",
        body: { ParentID: itemID },
      }
    );
    console.log(itemID);
    console.log(data);
    if (data.value.ID === "" || data.value.ID === undefined) {
      return console.error("Add Example Error");
    }
    console.log(index);
    if (index.length == 2) {
      Collection.value[index[0]].item[index[1]].response.push(data.value);
      console.log(Collection.value[index[0]].item[index[1]].response);
    }
    if (index.length > 2) {
      Collection.value[index[0]].item[index[1]].item[index[2]].response.push(data.value);
      console.log(Collection.value[index[0]].item[index[1]].item[index[3]].response);
    }
    return console.log("Item Ex: " + itemID);
  }
  console.log(`Selected key: ${key}`);
  console.log(`Selected label: ${option.label}`);
  console.log(`Selected option object:`, option);
  console.log(`Selected option object:`, itemID);
  pattern.value = itemID;
};
const active = ref();
const fileContent = ref("");
const fileData = ref();
const handleFileChange = (file) => {
  const reader = new FileReader();
  reader.onload = () => {
    fileContent.value = JSON.parse(reader.result);
    console.log(fileContent);
    ImportCollection();
  };
  reader.readAsText(file.file.file);
};
const ImportCollection = async () => {
  console.log(fileContent.value);
  // info
  const info = fileContent.value.info;
  console.log(info);
  const { data: impInfo } = await useFetch(`http://127.0.0.1:8000/import/collection`, {
    method: "POST",
    body: { id: info._postman_id, name: info.name },
  });
  console.log(impInfo.value);

  for (let i = 0; i < fileContent.value.item.length; i++) {
    // item (folder || request)
    const item = fileContent.value.item[i];
    console.log(item.name);
    if (item.item !== undefined) {
      const { data: impFolder } = await useFetch(`http://127.0.0.1:8000/import/folder`, {
        method: "POST",
        body: { InfoId: impInfo.value.ID, name: item.name },
      });
      console.log(impFolder.value);
      if (item.item.length == 0) {
        continue;
      }
      //check folder
      if (item.item.length > 0) {
        for (let j = 0; j < item.item.length; j++) {
          // request
          console.log(j);
          const folder = item.item[j];
          const request = folder.request;
          console.log(request);
          const { data: impRequest } = await useFetch(
            `http://127.0.0.1:8000/import/request`,
            {
              method: "POST",
              body: { ParentId: impFolder.value.ID, name: folder.name },
            }
          );
          {
            const method = request.method;
            const { data: impRequestMethod } = await useFetch(
              `http://127.0.0.1:8000/import/saverequest`,
              {
                method: "POST",
                body: { ParentId: impRequest.value.ID, Method: method },
              }
            );
            console.log(impRequestMethod.value);
            if (request.header?.length !== 0 && request.header?.length !== undefined) {
              for (let p = 0; p < request.header.length; p++) {
                const header = request.header[p];
                const { data: impRequestHeader } = await useFetch(
                  `http://127.0.0.1:8000/request/saveheader.json`,
                  {
                    method: "POST",
                    body: {
                      RequestID: impRequestMethod.value.ID,
                      Key: header.key,
                      Value: header.value,
                    },
                  }
                );
                console.log(impRequestHeader.value);
              }
            }
            if (request.body?.raw !== undefined) {
              const body = request.body.raw;
              const { data: impBody } = await useFetch(
                `http://127.0.0.1:8000/request/savebody.json`,
                {
                  method: "POST",
                  body: { RequestID: impRequestMethod.value.ID, Raw: body },
                }
              );
              console.log(impBody.value);
            }
            if (request.url?.raw !== undefined) {
              const url = request.url.raw;
              const { data: impUrl } = await useFetch(
                `http://127.0.0.1:8000/request/saveurl.json`,
                {
                  method: "POST",
                  body: { RequestID: impRequestMethod.value.ID, Raw: url },
                }
              );
              console.log(impUrl.value);
            }
          }
          console.log(folder.name);
          if (folder.response.length > 0) {
            for (let k = 0; k < folder.response.length; k++) {
              // response
              const Example = folder.response[k];
              const { data: impExample } = await useFetch(
                `http://127.0.0.1:8000/import/response`,
                {
                  method: "POST",
                  body: { ParentId: impRequest.value.ID, name: Example.name },
                }
              );
              {
                if (Example.body !== undefined) {
                  const exampBody = Example.body;
                  const { data: impExampleBody } = await useFetch(
                    `http://127.0.0.1:8000/request/createrq.json`,
                    {
                      method: "POST",
                      body: { ParentID: impExample.value.ID, Body: exampBody },
                    }
                  );
                  console.log(impExampleBody.value);

                  if (Example.originalRequest?.method !== undefined) {
                    const method = Example.originalRequest.method;
                    const { data: impExampData } = await useFetch(
                      `http://127.0.0.1:8000/request/save.json`,
                      {
                        method: "POST",
                        body: { ID: impExampleBody.value.ID, Method: method },
                      }
                    );
                    console.log(impExampData.value);

                    if (Example.originalRequest.header?.length != 0) {
                      for (let p = 0; p < Example.originalRequest.header.length; p++) {
                        const header = Example.originalRequest.header[p];
                        const { data: impExampleHeader } = await useFetch(
                          `http://127.0.0.1:8000/request/saveheader.json`,
                          {
                            method: "POST",
                            body: {
                              RequestID: impExampleBody.value.ID,
                              Key: header.key,
                              Value: header.value,
                            },
                          }
                        );
                        console.log(impExampleHeader.value);
                      }
                    }

                    if (Example.originalRequest.body?.raw !== undefined) {
                      const body = Example.originalRequest.body.raw;
                      const { data: impBody } = await useFetch(
                        `http://127.0.0.1:8000/request/savebody.json`,
                        {
                          method: "POST",
                          body: { RequestID: impExampleBody.value.ID, Raw: body },
                        }
                      );
                      console.log(impBody.value);
                    }
                    if (Example.originalRequest.url?.raw !== undefined) {
                      const url = Example.originalRequest.url.raw;
                      const { data: impUrl } = await useFetch(
                        `http://127.0.0.1:8000/request/saveurl.json`,
                        {
                          method: "POST",
                          body: { RequestID: impExampleBody.value.ID, Raw: url },
                        }
                      );
                      console.log(impUrl.value);
                    }
                  }
                }
              }
            }
          }
        }
      }
    } else {
      console.log(item);
      const request = item.request;
      const { data: impRequest } = await useFetch(
        `http://127.0.0.1:8000/import/request`,
        {
          method: "POST",
          body: { ParentId: impInfo.value.ID, name: item.name },
        }
      );
      {
        const method = request.method;
        const { data: impRequestMethod } = await useFetch(
          `http://127.0.0.1:8000/import/saverequest`,
          {
            method: "POST",
            body: { ParentId: impRequest.value.ID, Method: method },
          }
        );
        console.log(impRequestMethod.value);
        if (request.header?.length !== 0 && request.header?.length !== undefined) {
          for (let p = 0; p < request.header.length; p++) {
            const header = request.header[p];
            const { data: impRequestHeader } = await useFetch(
              `http://127.0.0.1:8000/request/saveheader.json`,
              {
                method: "POST",
                body: {
                  RequestID: impRequestMethod.value.ID,
                  Key: header.key,
                  Value: header.value,
                },
              }
            );
            console.log(impRequestHeader.value);
          }
        }
        if (request.body?.raw !== undefined) {
          const body = request.body.raw;
          const { data: impBody } = await useFetch(
            `http://127.0.0.1:8000/request/savebody.json`,
            {
              method: "POST",
              body: { RequestID: impRequestMethod.value.ID, Raw: body },
            }
          );
          console.log(impBody.value);
        }
        if (request.url?.raw !== undefined) {
          const url = request.url.raw;
          const { data: impUrl } = await useFetch(
            `http://127.0.0.1:8000/request/saveurl.json`,
            {
              method: "POST",
              body: { RequestID: impRequestMethod.value.ID, Raw: url },
            }
          );
          console.log(impUrl.value);
        }
      }
      if (item.response.length > 0) {
        for (let k = 0; k < item.response.length; k++) {
          const Example = item.response[k];
          const { data: impExample } = await useFetch(
            `http://127.0.0.1:8000/import/response`,
            {
              method: "POST",
              body: { ParentId: impRequest.value.ID, name: Example.name },
            }
          );
          {
            if (Example.body !== undefined) {
              const exampBody = Example.body;
              const { data: impExampleBody } = await useFetch(
                `http://127.0.0.1:8000/request/createrq.json`,
                {
                  method: "POST",
                  body: { ParentID: impExample.value.ID, Body: exampBody },
                }
              );
              console.log(impExampleBody.value);
              if (Example.originalRequest?.method !== undefined) {
                const method = Example.originalRequest.method;
                const { data: impExampDataMethod } = await useFetch(
                  `http://127.0.0.1:8000/request/save.json`,
                  {
                    method: "POST",
                    body: { ID: impExampleBody.value.ID, Method: method },
                  }
                );
                console.log(impExampDataMethod.value);

                if (Example.originalRequest.header?.length != 0) {
                  for (let p = 0; p < Example.originalRequest.header.length; p++) {
                    const header = Example.originalRequest.header[p];
                    const { data: impRequestHeader } = await useFetch(
                      `http://127.0.0.1:8000/request/saveheader.json`,
                      {
                        method: "POST",
                        body: {
                          RequestID: impExampleBody.value.ID,
                          Key: header.key,
                          Value: header.value,
                        },
                      }
                    );
                    console.log(impRequestHeader.value);
                  }
                }
                if (Example.originalRequest.body?.raw !== undefined) {
                  const body = Example.originalRequest.body.raw;
                  const { data: impBody } = await useFetch(
                    `http://127.0.0.1:8000/request/savebody.json`,
                    {
                      method: "POST",
                      body: { RequestID: impExampleBody.value.ID, Raw: body },
                    }
                  );
                  console.log(impBody.value);
                }
                if (Example.originalRequest.url?.raw !== undefined) {
                  const url = Example.originalRequest.url.raw;
                  const { data: impUrl } = await useFetch(
                    `http://127.0.0.1:8000/request/saveurl.json`,
                    {
                      method: "POST",
                      body: { RequestID: impExampleBody.value.ID, Raw: url },
                    }
                  );
                  console.log(impUrl.value);
                }
              }
            }
          }
          console.log(Example.name);
        }
      }
    }
  }
  const { data: CltDetail } = await useFetch(
    `http://127.0.0.1:8000/collection/detailcollection.json/${impInfo.value.ID}`
  );
  console.log(CltDetail.value);
  impInfo.value.item = CltDetail.value.item;
  //   CltDetail.value.forEach(item => {
  //   impInfo.value.items.push(item); // thêm từng phần tử của CltDetail.value vào mảng items trong impInfo
  // });
  // console.log(impInfo.value);
  Collection.value.push(impInfo.value);
};
// const SelectID = useState("CurrentID");
// const updateExample = useState("newExamp");
// console.log(Collection.value);
</script>
