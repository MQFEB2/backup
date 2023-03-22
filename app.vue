<script>

const Collection = [{
  id: 1,
  name: "New Collection",
  item: [
    {
      id: 2,
      name: "New Folder",
      item: [
        {
          id: 3,
          name: "New Request",
          request: {
            method: "GET",
          },
        }
      ]
    },
    {
      id: 4,
      name: "New Folder",
      item: []
    },
    {
      id: 5,
      name: "New Request",
      request: {
        method: "GET",
      },
    }
  ]
},
{
  id: 6,
  name: "Collection 2",
  item: [{
    id: 7,
    name: "New Folder",
    item: []
  },],
}
]
export default defineComponent({
  components: {
    Collection
  },
  props: {
    todo: Object
  },
  data() {
    return {
      Collection,
      prefix: '',
    }
  },
})


</script>

<template>
  <div class="flex flex-row m0">
    <div id="sidebar" class="top-0 left-0 bg-gray-50 flex flex-col w-80 h-screen items-center">

      <!-- Collection sidebar list -->
      <div class="mt-5 p2 ">


        <NCollapse>
          <div v-for="item in Collection" :key="item.id">
            <NCollapseItem :title="item.name">
              <div v-for="folder in item.item" :key="folder.id">

                <div v-if="folder.item">
                  <NCollapseItem :title="folder.name">
                    <div v-if="folder.item.length > 0">
                      <div v-for="request in folder.item" :key="request.id">
                        {{ request.name }}</div>
                    </div>
                    <div v-else>This folder is empty</div>


                  </NCollapseItem>
                </div>
                <div v-else>
                  {{ folder.name }}
                </div>
              </div>
            </NCollapseItem>
          </div>

        </NCollapse>


      </div>
    </div>
  </div>
</template>

<script setup>
import { NIcon, NCollapse, NCollapseItem, } from "naive-ui";

</script>