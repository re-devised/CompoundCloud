<template>
  <node-view-wrapper class="code-block">
    <select contenteditable="false" v-model="selectedLanguage">
      <option :value="null">
        auto
      </option>
      <option disabled>
        —
      </option>
      <option v-for="(language, index) in languages" :value="language" :key="index" :selected="language == 'javascript'">
        {{ language }}
      </option>
    </select>
    <pre><node-view-content as="code" /></pre>
  </node-view-wrapper>
</template>

<script>
import { NodeViewWrapper, NodeViewContent, nodeViewProps } from '@tiptap/vue-2'

export default {
  components: {
    NodeViewWrapper,
    NodeViewContent,
  },

  props: nodeViewProps,

  data() {
    return {
      languages: this.extension.options.lowlight.listLanguages(),
    }
  },

  computed: {
    selectedLanguage: {
      get() {
        return this.node.attrs.language
      },
      set(language) {
        this.updateAttributes({ language })
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.code-block {
  position: relative;

  select {
    width: 15px;
    height: 15px;
    background-color: transparent;
    // color: white;
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
  }
}
</style>