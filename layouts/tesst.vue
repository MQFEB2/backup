<script setup>
import {
  NButton,
  NDropdown,
  NIcon,
  NCollapse,
  NCollapseItem,
  NDivider,
  NMessageProvider,
} from "naive-ui";

import { Add } from "@vicons/ionicons5";
import { Filter, EllipsisHorizontalOutline } from "@vicons/ionicons5";
import { Folder } from "@vicons/carbon";

const getCol = ref();
const Collection = ref();

const options = ref([
  {
    label: "Add folder",
    key: "Add folder",
    // props: {
    //   onClick: (event) => {
    //     addItem();
    //   },
    // },
  },
  {
    label: "Add request",
    key: "Add request",
  },
  {
    label: "Rename",
    key: "Rename",
  },
  {
    label: "Delete",
    key: "Delete",
  },
]);

const { data: object1 } = await useFetch(`http://127.0.0.1:8000/collection/list.json`);

getCol.value = object1.value;
console.log(getCol.value);

console.log(object1);
console.log(object1.value);

const object2 = {
  ID: "312c1ade-c337-4942-8895-ac63c880509c",
  InfoID: "c85ac6bb-1877-430d-8553-e37b0c22bba7",
  item: [
    {
      ID: "054445fa-3305-4e87-81bb-7d3dffb2b124",
      Name: "New Folder",
      IsFolder: true,
      item: [],
    },
    {
      ID: "64e5ff19-7db3-47fa-857b-c838cc0f5ec9",
      Name: "New Request",
      IsFolder: false,
      item: [],
    },
  ],
};

for (let i = 0; i < object1.value.length; i++) {
  const currentID = object1.value[i].ID;
  console.log(currentID);
  const { data: CltDetail } = await useFetch(
    `http://127.0.0.1:8000/collection/detailcollection.json/${currentID}`
  );
  const obj2 = CltDetail.value;
  console.log(CltDetail);
  console.log(obj2);
  for (let j = 0; j < getCol.value.length; j++) {
    if (getCol.value[j].ID === obj2.InfoID) {
      getCol.value[j].item = obj2.item;
      break; // Không cần duyệt tiếp nữa nếu tìm thấy trùng khớp
    }
  }
  console.log(currentID);
}
// Collection = {...data}
console.log(getCol);
Collection.value = getCol.value;
console.log(Collection);
function addItem() {
  const newItem = {
    id: Collection.value.length + 1,
    name: "New Collection",
    item: [],
  };
  console.log(newItem.id);
  Collection.value.push(newItem);
}

function handleSelect(key) {
  console.log(key);
}

const getCollectionList = async () => {
  // Lặp qua mảng các đối tượng
  for (let i = 0; i < getCol.value.length; i++) {
    const currentID = getCol.value[i].ID;
    console.log(currentID);
    const { data: CltDetail } = await useFetch(
      `http://127.0.0.1:8000/collection/detailcollection.json/${currentID}`
    );
    const obj2 = CltDetail.value;
    console.log(CltDetail);
    for (let j = 0; j < getCol.value.length; j++) {
      if (getCol.value[j].ID === obj2.InfoID) {
        getCol.value[j].item = obj2.item;
        break; // Không cần duyệt tiếp nữa nếu tìm thấy trùng khớp
      }
    }
    console.log(currentID);
  }
  // Collection = {...data}
  console.log(getCol);
};

const handleRqClick = async (key) => {
  console.log(key);
  const { data } = await useFetch(`http://127.0.0.1:8000/request/data.json?id=${key}`);
  console.log(data.value);
};
// const getDetailCollection = async () => {
//   for (const id in getCol) {
//     const { data } = await useFetch(
//       `http://127.0.0.1:8000/collection/detailcollection.json/${id}`
//     );
//     console.log(data);
//   }
// };

// onMounted(() => {
//   getCollectionList();
//   // getDetailCollection();
// });
</script>

<template>
  <NMessageProvider>
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
              type="text"
              placeholder="Filter"
              class="h-6 border-1 border-slate-200 bg-slate-50 pl-9 p-0.5 text-gray-900 hover:bg-gray-100 hover:focus:bg-white focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <!-- Collection sidebar list -->
        <div class="mt-5 w-4/5 p2 overflow-y-auto">
          <NCollapse>
            <div v-for="item in Collection" :key="item.id">
              <NCollapseItem :title="item.Name">
                <template #header-extra>
                  <n-dropdown trigger="hover" placement="bottom-end" :options="options">
                    <NIcon size="18" class="w-5 h-5 text-gray-400">
                      <EllipsisHorizontalOutline />
                    </NIcon>
                  </n-dropdown>
                </template>
                <div v-if="item.item && item.item.length">
                  <div v-for="folder in item.item">
                    <div v-if="folder.IsFolder">
                      <NCollapseItem>
                        <template #header-extra>
                          <n-dropdown
                            trigger="hover"
                            placement="bottom-end"
                            :options="options"
                          >
                            <NIcon size="18" class="w-5 h-5 text-gray-400">
                              <EllipsisHorizontalOutline />
                            </NIcon>
                          </n-dropdown>
                        </template>
                        <template #header>
                          <NIcon size="15" class="pr-1">
                            <Folder />
                          </NIcon>
                          {{ folder.Name }}
                        </template>
                        <div v-if="folder.item.length > 0">
                          <NuxtLink
                            to="request"
                            v-for="request in folder.item"
                            class="pb-3"
                          >
                            {{ request.name }}
                          </NuxtLink>
                        </div>
                        <div v-else>This folder is empty</div>
                      </NCollapseItem>
                      <NDivider style="margin-top: 10px; margin-bottom: 10px" />
                    </div>
                    <div v-else class="pb-3">
                      <button @click="handleRqClick(folder.ID)">{{ folder.Name }}</button>
                    </div>
                  </div>
                </div>
                <div v-else>This collection is empty</div>
              </NCollapseItem>
              <NDivider style="margin-top: 10px; margin-bottom: 10px" />
            </div>
          </NCollapse>
          <!-- <pre>{{ JSON.stringify(Collection, null, 2) }}</pre> -->
        </div>
      </div>
      <div id="main" class="flex flex-col grow px-2 max-h-screen">
        <button @click="getCollectionList">abc</button>
        <slot />
      </div>
    </div>
  </NMessageProvider>
</template>
