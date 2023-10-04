<template>
  <div class="divide-y-2">
    <NTree
      :data="Item"
      block-node
      :node-props="nodeProps"
      :render-switcher-icon="renderSwitcherIcon"
      :selectable="false"
    />
    <!-- <NTree :data="formattedObject" block-line /> -->
    <SidebarOptions
      @selectedOption="hanleOptionSelected"
      :Options="optionsForFolder"
      Target="abc"
    ></SidebarOptions>
    <pre>{{ JSON.stringify(Collection, null, 2) }}</pre>
  </div>
</template>

<script setup>
import SidebarOptions from "../components/sidebar/Options.vue";
import { useMessage, NTree, NButton, NIcon, NDropdown } from "naive-ui";
import {
  ChevronForward,
  Folder,
  FolderOpenOutline,
  FileTrayFullOutline,
  EllipsisHorizontalOutline,
} from "@vicons/ionicons5";
import { Json } from "@vicons/carbon";

const message = useMessage();
const config = useRuntimeConfig();
const renderSwitcherIcon = () => h(NIcon, null, { default: () => h(ChevronForward) });
const { data: Collection } = await useFetch(
  `https://8e99046e-6500-4c08-98ce-49596663e720.mock.pstmn.io/v1/collection.json`
);
function hanleOptionSelected(key) {
  console.log("🚀 ~ file: test.vue:32 ~ key ~ key:", key);
}
const optionsForFolder = [
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
    onClick() {
      if ((!option.children && !option.disabled) || option.type == "request") {
        message.info("[Click] " + option.label);
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

console.log("🚀 ~ file: test.vue:155 ~ Collection.value.forEach ~ Item:", Item);
// const formattedObject = tesst(Collection.value);
// console.log("🚀 ~ file: test.vue:58 ~ formattedObject:", formattedObject);

const data = [
  {
    key: "0",
    label: "0",
    children: [
      {
        key: "0-1",
        label: "0-1",
        children: [
          {
            label: "0-1-0",
            key: "0-1-0",
          },
          {
            label: "0-1-1",
            key: "0-1-1",
          },
        ],
      },
      {
        key: "0-0",
        label: "0-0",
      },
    ],
  },
  {
    key: "1",
    label: "1",
    children: [
      {
        key: "1-0",
        label: "1-0",
      },
      {
        key: "1-1",
        label: "1-1",
        children: [
          {
            label: "1-1-0",
            key: "1-1-0",
          },
          {
            label: "1-1-1",
            key: "1-1-1",
          },
        ],
      },
    ],
  },
];

const tempObj = [
  {
    key: "09e05c3a-8d71-4d1e-ac49-cf0408849a6f",
    label: "New Collection",
    children: [
      {
        key: "771e22e4-a898-4107-af56-a52848a2d118",
        label: "New Folder",
        children: [
          {
            key: "8cbbd12a-099d-4625-b03d-3a28197f9dd1",
            label: "New Request",
            children: [
              {
                key: "403146fe-8e98-48c2-949a-3d986ba7fc51",
                label: "New example",
              },
            ],
          },
        ],
      },
      {
        key: "a1b38211-45c7-453e-9b90-e68cc9fe0a98",
        label: "New Request",
        children: [
          {
            key: "9a414f0c-f748-4ee4-8ca8-ab2d7a0d3625",
            label: "New example",
          },
        ],
      },
      {
        key: "af3103f5-e75f-41c1-b416-7a3f86a52692",
        label: "New Folder",
        children: [],
      },
    ],
  },
  {
    key: "9a20c9ff-e7b3-45c7-a4dc-a7ad09d7f81c",
    label: "New Collection",
    children: [
      {
        key: "1eac3ff5-463a-49ba-8243-53a1081f4f33",
        label: "New Request",
        children: [
          {
            key: "d667ee8c-fbdb-42be-98b5-1d0b7bf92167",
            label: "New example",
          },
          {
            key: "fa54b31a-095f-4881-9edf-c0eb945f3a96",
            label: "New example",
          },
        ],
      },
    ],
  },
];
</script>
