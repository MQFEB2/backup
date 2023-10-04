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
console.log("🚀 ~ file: SidebarCollection.vue:454 ~ Collection:", Collection.value);
console.log("🚀 ~ file: SidebarCollection.vue:454 ~ apiSecret:", config.public.baseUrl);
</script>
