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
const getCol = ref();
const Collection = ref();
const tempID = ref();

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

const optionsForFolder = ref([
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
    key: "DeleteFd",
  },
]);

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
const { data: object1 } = await useFetch(`${config.apiSecret}/v1/collection.json`);

// getCol.value = object1.value;
// if (getCol.value) {
//   for (let i = 0; i < object1.value.length; i++) {
//     const currentID = object1.value[i].ID;
//     console.log(currentID);
//     const { data: CltDetail } = await useFetch(
//       `${config.apiSecret}/collection/detailcollection.json/${currentID}`
//     );
//     const obj2 = CltDetail.value;
//     console.log(CltDetail);
//     console.log(obj2);
//     for (let j = 0; j < getCol.value.length; j++) {
//       if (getCol.value[j].ID === obj2.InfoID) {
//         getCol.value[j].item = obj2.item;
//         break; // Không cần duyệt tiếp nữa nếu tìm thấy trùng khớp
//       }
//     }
//     console.log(currentID);
//   }
// }
// Collection.value = getCol.value;
// console.log(Collection.value);

const addItem = async () => {
  const { data: NewClt } = await useFetch(`${config.apiSecret}/collection/new.json`, {
    method: "POST",
  });
  console.log(NewClt);
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
  const { data } = await useFetch(`${config.apiSecret}/collection/name.json`, {
    method: "PATCH",
    body: { ID: ID, Name: v },
  });
  console.log(data.value);
  active.value = "";
  console.log(v);
  console.log(ID);
};

const ChangeFolderName = async (v, ID) => {
  const { data } = await useFetch(`${config.apiSecret}/collection/foldername.json`, {
    method: "PATCH",
    body: { ID: ID, Name: v },
  });
  console.log(data.value);
  active.value = "";
};

const ChangeRequestName = async (v, ID) => {
  const { data } = await useFetch(`${config.apiSecret}/collection/requestname.json`, {
    method: "PATCH",
    body: { ID: ID, Name: v },
  });
  console.log(data.value);
  active.value = "";
};

const ChangeExampleName = async (v, ID) => {
  const { data } = await useFetch(`${config.apiSecret}/collection/examplename.json`, {
    method: "PATCH",
    body: { ID: ID, Name: v },
  });
  console.log(data.value);
  active.value = "";
};

const handleSelect = async (itemID, key, option, ...index) => {
  if (key === "Export") {
    saveAs(`${config.apiSecret}/collection/export.json/${itemID}`, `${itemID}`);
    return console.log("Item export: " + itemID);
  }

  if (key === "DeleteClt") {
    console.log(itemID);
    const { data } = await useFetch(`${config.apiSecret}/collection/delete.json`, {
      method: "DELETE",
      body: { id: itemID },
    });
    console.log(data);
    if (data.value.ID == itemID) {
      deleteItem(itemID);
    } else {
      return console.error("Error Detele");
    }
    return console.log("Item delete: " + itemID);
  }

  if (key === "DeleteFd") {
    console.log(itemID);
    const { data } = await useFetch(`${config.apiSecret}/collection/delfolder.json`, {
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

  if (key === "DeleteRq") {
    console.log(itemID);
    const { data } = await useFetch(`${config.apiSecret}/collection/delrequest.json`, {
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
    const { data } = await useFetch(`${config.apiSecret}/collection/newfolder.json`, {
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
    const { data } = await useFetch(`${config.apiSecret}/collection/newrequest.json`, {
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
      `${config.apiSecret}/request/createexamplesidebar.json`,
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
  tempID.value = itemID;
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
  const { data: impInfo } = await useFetch(`${config.apiSecret}/import/collection`, {
    method: "POST",
    body: { id: info._postman_id, name: info.name },
  });
  console.log(impInfo.value);

  for (let i = 0; i < fileContent.value.item.length; i++) {
    // item (folder || request)
    const item = fileContent.value.item[i];
    console.log(item.name);
    if (item.item !== undefined) {
      const { data: impFolder } = await useFetch(`${config.apiSecret}/import/folder`, {
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
            `${config.apiSecret}/import/request`,
            {
              method: "POST",
              body: { ParentId: impFolder.value.ID, name: folder.name },
            }
          );
          {
            const method = request.method;
            const { data: impRequestMethod } = await useFetch(
              `${config.apiSecret}/import/saverequest`,
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
                  `${config.apiSecret}/request/saveheader.json`,
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
                `${config.apiSecret}/request/savebody.json`,
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
                `${config.apiSecret}/request/saveurl.json`,
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
                `${config.apiSecret}/import/response`,
                {
                  method: "POST",
                  body: { ParentId: impRequest.value.ID, name: Example.name },
                }
              );
              {
                if (Example.body !== undefined) {
                  const exampBody = Example.body;
                  const { data: impExampleBody } = await useFetch(
                    `${config.apiSecret}/request/createrq.json`,
                    {
                      method: "POST",
                      body: { ParentID: impExample.value.ID, Body: exampBody },
                    }
                  );
                  console.log(impExampleBody.value);

                  if (Example.originalRequest?.method !== undefined) {
                    const method = Example.originalRequest.method;
                    const { data: impExampData } = await useFetch(
                      `${config.apiSecret}/request/save.json`,
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
                          `${config.apiSecret}/request/saveheader.json`,
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
                        `${config.apiSecret}/request/savebody.json`,
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
                        `${config.apiSecret}/request/saveurl.json`,
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
        `${config.apiSecret}/import/request`,
        {
          method: "POST",
          body: { ParentId: impInfo.value.ID, name: item.name },
        }
      );
      {
        const method = request.method;
        const { data: impRequestMethod } = await useFetch(
          `${config.apiSecret}/import/saverequest`,
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
              `${config.apiSecret}/request/saveheader.json`,
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
            `${config.apiSecret}/request/savebody.json`,
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
            `${config.apiSecret}/request/saveurl.json`,
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
            `${config.apiSecret}/import/response`,
            {
              method: "POST",
              body: { ParentId: impRequest.value.ID, name: Example.name },
            }
          );
          {
            if (Example.body !== undefined) {
              const exampBody = Example.body;
              const { data: impExampleBody } = await useFetch(
                `${config.apiSecret}/request/createrq.json`,
                {
                  method: "POST",
                  body: { ParentID: impExample.value.ID, Body: exampBody },
                }
              );
              console.log(impExampleBody.value);
              if (Example.originalRequest?.method !== undefined) {
                const method = Example.originalRequest.method;
                const { data: impExampDataMethod } = await useFetch(
                  `${config.apiSecret}/request/save.json`,
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
                      `${config.apiSecret}/request/saveheader.json`,
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
                    `${config.apiSecret}/request/savebody.json`,
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
                    `${config.apiSecret}/request/saveurl.json`,
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
    `${config.apiSecret}/collection/detailcollection.json/${impInfo.value.ID}`
  );
  console.log(CltDetail.value);
  impInfo.value.item = CltDetail.value.item;
  //   CltDetail.value.forEach(item => {
  //   impInfo.value.items.push(item); // thêm từng phần tử của CltDetail.value vào mảng items trong impInfo
  // });
  console.log(impInfo.value);
  Collection.value.push(impInfo.value);
};
// const SelectID = useState("CurrentID");
// const updateExample = useState("newExamp");
console.log(Collection.value);
</script>

<template>
  <div class="flex flex-row m0">
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
            class="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none"
          >
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
        <NUpload :show-file-list="false" accept=".json" @change="handleFileChange">
          <button
            class="ml-2 px-1 h-7 bg-slate-50 border-none hover:bg-gray-100 active:bg-gray-200 rounded items-center"
          >
            <NIcon size="20"> <DocumentImport /> </NIcon>
          </button>
        </NUpload>
      </div>

      <!-- Collection sidebar list -->
      <div class="mt-5 w-4/5 p2 overflow-y-auto">
        <!-- <p>{{ updateExample }}</p>
          <p>{{ Selectid }}</p> -->
        <NCollapse>
          <div v-if="Collection">
            <div v-for="(item, itemIndex) in Collection">
              <NCollapseItem>
                <template #header>
                  <div v-if="active != item.id">{{ item.name }}</div>
                  <div v-else>
                    <n-input
                      type="text"
                      size="small"
                      v-model:value="item.name"
                      autofocus
                      @change="(v) => ChangeCollectionname(v, item.id)"
                      @blur="
                        () => {
                          active = '';
                        }
                      "
                    />
                  </div>
                </template>
                <template #header-extra>
                  <n-dropdown
                    trigger="hover"
                    placement="bottom-end"
                    :options="options"
                    @select="
                      (key, option) => handleSelect(item.id, key, option, itemIndex)
                    "
                  >
                    <NIcon size="18" class="w-5 h-5 text-gray-400">
                      <EllipsisHorizontalOutline />
                    </NIcon>
                  </n-dropdown>
                </template>
                <div v-if="item.item && item.item.length">
                  <div v-for="(folder, folderIndex) in item.item">
                    <div v-if="folder.type === 'folder'">
                      <NCollapseItem>
                        <template #header-extra>
                          <n-dropdown
                            trigger="hover"
                            placement="bottom-end"
                            :options="optionsForFolder"
                            @select="
                              (key, option) =>
                                handleSelect(
                                  folder.id,
                                  key,
                                  option,
                                  itemIndex,
                                  folderIndex
                                )
                            "
                          >
                            <NIcon size="18" class="w-5 h-5 text-gray-400">
                              <EllipsisHorizontalOutline />
                            </NIcon>
                          </n-dropdown>
                        </template>
                        <template #header>
                          <div v-if="active != folder.id">
                            <NIcon size="15" class="pr-1">
                              <Folder />
                            </NIcon>
                            {{ folder.name }}
                          </div>
                          <div v-else>
                            <NIcon size="15" class="pr-1">
                              <Folder />
                            </NIcon>
                            <n-input
                              type="text"
                              size="small"
                              v-model:value="folder.name"
                              autofocus
                              @change="(v) => ChangeFoldername(v, folder.id)"
                              @blur="
                                () => {
                                  active = '';
                                }
                              "
                            />
                          </div>
                        </template>
                        <div v-if="folder.item?.length > 0">
                          <div v-for="(request, requestIndex) in folder.item">
                            <div v-if="request.response?.length > 0">
                              <NCollapseItem>
                                <template #header-extra>
                                  <n-dropdown
                                    trigger="hover"
                                    placement="bottom-end"
                                    :options="optionsForRequest"
                                    @select="
                                      (key, option) =>
                                        handleSelect(
                                          request.id,
                                          key,
                                          option,
                                          itemIndex,
                                          folderIndex,
                                          requestIndex
                                        )
                                    "
                                  >
                                    <NIcon size="18" class="w-5 h-5 text-gray-400">
                                      <EllipsisHorizontalOutline />
                                    </NIcon>
                                  </n-dropdown>
                                </template>
                                <template #header>
                                  <div v-if="active != request.id">
                                    <NuxtLink :to="{ path: '/request/' + request.id }">
                                      {{ request.name }}
                                    </NuxtLink>
                                  </div>
                                  <div v-else>
                                    <n-input
                                      type="text"
                                      size="small"
                                      v-model:value="request.name"
                                      autofocus
                                      @change="(v) => ChangeRequestname(v, request.id)"
                                      @blur="
                                        () => {
                                          active = '';
                                        }
                                      "
                                    />
                                  </div>
                                </template>
                                <div
                                  v-for="(response, responseIndex) in request.response"
                                  class="flex"
                                >
                                  <div v-if="active != response.id">
                                    <NuxtLink :to="{ path: '/response/' + response.id }">
                                      {{ response.name }}
                                    </NuxtLink>
                                  </div>
                                  <div v-else>
                                    <n-input
                                      type="text"
                                      size="small"
                                      v-model:value="response.name"
                                      autofocus
                                      @change="(v) => ChangeExamplename(v, response.id)"
                                      @blur="
                                        () => {
                                          active = '';
                                        }
                                      "
                                    />
                                  </div>

                                  <div class="grow flex justify-end">
                                    <n-dropdown
                                      trigger="hover"
                                      placement="bottom-end"
                                      :options="optionsForExample"
                                      @select="
                                        (key, option) =>
                                          handleSelect(
                                            response.id,
                                            key,
                                            option,
                                            itemIndex,
                                            folderIndex,
                                            requestIndex,
                                            responseIndex
                                          )
                                      "
                                    >
                                      <NIcon size="18" class="w-5 h-5 text-gray-400">
                                        <EllipsisHorizontalOutline />
                                      </NIcon>
                                    </n-dropdown>
                                  </div>
                                </div>
                              </NCollapseItem>
                            </div>
                            <div v-else class="pb-3 flex">
                              <div v-if="active != request.id">
                                <NuxtLink :to="{ path: '/request/' + request.id }">
                                  {{ request.name }}
                                </NuxtLink>
                              </div>
                              <div v-else>
                                <n-input
                                  type="text"
                                  size="small"
                                  v-model:value="request.name"
                                  autofocus
                                  @change="(v) => ChangeRequestname(v, request.id)"
                                  @blur="
                                    () => {
                                      active = '';
                                    }
                                  "
                                />
                              </div>

                              <div class="grow flex justify-end">
                                <n-dropdown
                                  trigger="hover"
                                  placement="bottom-end"
                                  :options="optionsForRequest"
                                  @select="
                                    (key, option) =>
                                      handleSelect(
                                        request.id,
                                        key,
                                        option,
                                        itemIndex,
                                        folderIndex,
                                        requestIndex
                                      )
                                  "
                                >
                                  <NIcon size="18" class="w-5 h-5 text-gray-400">
                                    <EllipsisHorizontalOutline />
                                  </NIcon>
                                </n-dropdown>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-else>Folder empty</div>
                      </NCollapseItem>
                      <NDivider style="margin-top: 10px; margin-bottom: 10px" />
                    </div>
                    <div v-else>
                      <div v-if="folder.response?.length > 0">
                        <NCollapseItem>
                          <template #header-extra>
                            <n-dropdown
                              trigger="hover"
                              placement="bottom-end"
                              :options="optionsForRequest"
                              @select="
                                (key, option) =>
                                  handleSelect(
                                    folder.id,
                                    key,
                                    option,
                                    itemIndex,
                                    folderIndex
                                  )
                              "
                            >
                              <NIcon size="18" class="w-5 h-5 text-gray-400">
                                <EllipsisHorizontalOutline />
                              </NIcon>
                            </n-dropdown>
                          </template>
                          <template #header>
                            <div v-if="active != folder.id">
                              <NuxtLink :to="{ path: '/request/' + folder.id }">
                                {{ folder.name }}
                              </NuxtLink>
                            </div>
                            <div v-else>
                              <n-input
                                type="text"
                                size="small"
                                v-model:value="folder.name"
                                autofocus
                                @change="(v) => ChangeRequestname(v, folder.id)"
                                @blur="
                                  () => {
                                    active = '';
                                  }
                                "
                              />
                            </div>
                          </template>
                          <div
                            v-for="(response, responseIndex) in folder.response"
                            class="flex"
                          >
                            <div v-if="active != response.id">
                              <NuxtLink :to="{ path: '/response/' + response.id }">
                                {{ response.name }}
                              </NuxtLink>
                            </div>
                            <div v-else>
                              <n-input
                                type="text"
                                size="small"
                                v-model:value="response.name"
                                autofocus
                                @change="(v) => ChangeExamplename(v, response.id)"
                                @blur="
                                  () => {
                                    active = '';
                                  }
                                "
                              />
                            </div>

                            <div class="grow flex justify-end">
                              <n-dropdown
                                trigger="hover"
                                placement="bottom-end"
                                :options="optionsForExample"
                                @select="
                                  (key, option) =>
                                    handleSelect(
                                      response.id,
                                      key,
                                      option,
                                      itemIndex,
                                      folderIndex,
                                      responseIndex
                                    )
                                "
                              >
                                <NIcon size="18" class="w-5 h-5 text-gray-400">
                                  <EllipsisHorizontalOutline />
                                </NIcon>
                              </n-dropdown>
                            </div>
                          </div>
                        </NCollapseItem>
                      </div>

                      <div v-else class="flex">
                        <div v-if="active != folder.id">
                          <NuxtLink :to="{ path: '/request/' + folder.id }">
                            {{ folder.name }}
                          </NuxtLink>
                        </div>
                        <div v-else>
                          <n-input
                            type="text"
                            size="small"
                            v-model:value="folder.name"
                            autofocus
                            @change="(v) => ChangeRequestname(v, folder.id)"
                            @blur="
                              () => {
                                active = '';
                              }
                            "
                          />
                        </div>

                        <div class="grow flex justify-end">
                          <n-dropdown
                            trigger="hover"
                            placement="bottom-end"
                            :options="optionsForRequest"
                            @select="
                              (key, option) =>
                                handleSelect(
                                  folder.id,
                                  key,
                                  option,
                                  itemIndex,
                                  folderIndex
                                )
                            "
                          >
                            <NIcon size="18" class="w-5 h-5 text-gray-400">
                              <EllipsisHorizontalOutline />
                            </NIcon>
                          </n-dropdown>
                        </div>
                      </div>
                      <!-- <button @click="handleRqClick(folder.id)">{{ folder.name }}</button> -->
                    </div>
                  </div>
                </div>
                <div v-else>Collection empty</div>
              </NCollapseItem>
              <NDivider style="margin-top: 10px; margin-bottom: 10px" />
            </div>
          </div>
          <div v-else>
            <div>Workspace empty</div>
          </div>
        </NCollapse>
        <!-- <pre>{{ JSON.stringify(Collection, null, 2) }}</pre> -->
      </div>
    </div>
    <div id="main" class="flex flex-col grow px-2 max-h-screen">
      <slot />
    </div>
  </div>
</template>
