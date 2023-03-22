<script>

export default {
  name: 'TreeItem', // necessary for self-reference
  props: {
    model: Object
  },
  data() {
    return {
      isOpen: false
    }
  },
  computed: {
    isCollection() {
      return this.model.item && this.model.item.length
    },
  },
  methods: {
    toggle() {
      if (this.isCollection) {
        this.isOpen = !this.isOpen
      }
    },
    changeType() {
      if (!this.isFolder) {
        this.model.folder = []
        this.addChild()
        this.isOpen = true
      }
    },
    addChild() {
      this.model.item.push({
        name: 'new item'
      })
    }
  },
}
</script>

<template>
  <li>
    <div :class="{ bold: isCollection }" @click="toggle" @dblclick="changeType">
      {{ model.name }}
      <span v-if="isCollection">[{{ isOpen ? '-' : '+' }}]</span>
    </div>
    <ul v-show="isOpen" v-if="isCollection">
      <!--
            A component can recursively render itself using its
            "name" option (inferred from filename if using SFC)
          -->
      <TreeItem class="item" v-for="model in model.item" :model="model">
      </TreeItem>
      <li class="add" @click="addChild">+</li>
    </ul>
  </li>
</template>

