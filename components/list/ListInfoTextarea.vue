<template>
  <div class="list-info" v-if="cloudDescription.length > 0 || editable">
    <client-only>
      <div class="list-info-menubar" v-if="editor && editable">
        <button
          class="list-info-menubar-button"
          @click="editor.chain().focus().setParagraph().run()"
          :class="{ 'is-active': editor.isActive('paragraph') }"
        >
          <svg-icon size="xs" icon="paragraph" />
        </button>
        <button
          class="list-info-menubar-button"
          @click="editor.chain().focus().toggleHeading({ level: 4 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 4 }) }"
        >
          <svg-icon size="xs" icon="h1" />
        </button>
        <button
          class="list-info-menubar-button"
          @click="editor.chain().focus().toggleHeading({ level: 5 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 5 }) }"
        >
          <svg-icon size="xs" icon="h2" />
        </button>
        <button
          class="list-info-menubar-button"
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
        >
          <svg-icon size="xs" icon="bold" />
        </button>
        <button
          class="list-info-menubar-button"
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
        >
          <svg-icon size="xs" icon="italic" />
        </button>
        <button
          class="list-info-menubar-button"
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
        >
          <svg-icon size="xs" icon="strikethrough" />
        </button>
        <button
          class="list-info-menubar-button"
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
        >
          <svg-icon size="xs" icon="ordered_list" />
        </button>
        <button
          class="list-info-menubar-button"
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
        >
          <svg-icon size="xs" icon="unordered_list" />
        </button>
        <button
          class="list-info-menubar-button"
          @click="editor.chain().focus().toggleTaskList().run()"
          :class="{ 'is-active': editor.isActive('taskList') }"
        >
          <svg-icon size="xs" icon="task_list" />
        </button>
        <button
          class="list-info-menubar-button"
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
        >
          <svg-icon size="xs" icon="code" />
        </button>
        <button
          class="list-info-menubar-button"
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
        >
          <svg-icon size="xs" icon="blockquote" />
        </button>
        <button
          class="list-info-menubar-button"
          @click="editor.chain().focus().setHorizontalRule().run()"
        >
          <svg-icon size="xs" icon="line" />
        </button>
        <button class="list-info-menubar-button" @click="addImage">
          <svg-icon size="xs" icon="camera" />
        </button>
        <button
          class="list-info-menubar-button"
          style="margin-left: 15px"
          @click="changeCloudDescription()"
        >
          Save
        </button>
      </div>
      <editor-content :editor="editor" />
    </client-only>
  </div>
</template>

<script>
import { Editor, EditorContent, VueNodeViewRenderer } from "@tiptap/vue-2";
import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import CodeBlockComponent from "~/components/shared/CodeBlockComponent";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import SvgIcon from "~/components/shared/SvgIcon";

import lowlight from "lowlight";

export default {
  components: {
    EditorContent,
    SvgIcon,
  },

  data() {
    return {
      editor: null,
      editable: false,
    };
  },

  props: {
    cloudId: {
      type: String,
      required: true,
    },
    cloudDescription: {
      type: String,
      required: true,
    },
  },

  methods: {
    addImage() {
      const url = window.prompt("URL");

      if (url) {
        this.editor.chain().focus().setImage({ src: url }).run();
      }
    },
    updateEditorHTML() {
      this.editor.commands.setContent(this.cloudDescription);
    },
    async changeCloudDescription(value = this.editor.getHTML()) {
      await this.$store
        .dispatch("cloud/changeCloudDescription", [this.cloudId, value])
        .then((_) => this.exitEditorMode());
    },
    resetCloudDescription() {
      this.changeCloudDescription("");
    },
    exitEditorMode() {
      this.editable = false;
      this.updateEditorHTML();
      this.updateEditorEditableMode();
    },
    enterEditorMode() {
      this.editable = true;
      this.updateEditorEditableMode();
    },
    updateEditorEditableMode() {
      this.editor.options.editable = this.editable;
      this.editor.view.update(this.editor.view.props);
    },
  },

  mounted() {
    this.editor = new Editor({
      content: ``,
      editorProps: {
        attributes: {
          spellcheck: "false",
        },
      },
      editable: this.editable,
      extensions: [
        StarterKit,
        Document,
        Paragraph,
        Text,
        Image,
        Dropcursor,
        TaskList,
        TaskItem,
        CodeBlockLowlight.extend({
          addNodeView() {
            return VueNodeViewRenderer(CodeBlockComponent);
          },
        }).configure({ lowlight }),
      ],
    });

    this.updateEditorHTML();
  },

  beforeDestroy() {
    this.editor.destroy();
  },
};
</script>

<style lang="scss">
.list-info {
  border: 1px solid var(--color-accent);
  color: var(--color-primary);
  // border-radius: 20px;
  padding: 30px 30px;
  // min-height: fit-content;
  height: fit-content;
  width: 100%;
  margin-bottom: 10px;
  font-size: 11pt;

  p:nth-last-of-type(1){
    margin: 0;
  }

  &-menubar {
    margin-bottom: 40px;
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    &-button {
      background-color: var(--color-accent);
      color: var(--color-primary);
      border: 0px solid transparent;
      border-radius: 4px;
      padding: 5px 10px;
      margin-right: 5px;
      margin-bottom: 5px;

      &:active {
        outline: none;
        transform: translateY(-4px);
      }
      &:focus {
        outline: none;
      }

      &.is-active {
        background-color: var(--color-accent-2);

        // border-top: 8px solid var(--color-secondary);
        // padding-top: 1px;
        // transform: translateY(-4px);
      }
    }
  }

  /* Basic editor styles */
  .ProseMirror {
    &:focus {
      outline: none;
    }

    > * + * {
      margin-top: 0.75em;
    }

    ul,
    ol {
      padding: 0 1rem;
      margin: 0;
    }

    hr{
      margin: 20px 0 !important;
    }

    ul[data-type="taskList"] {
      list-style: none;
      padding: 0;
      margin: 0;

      li {
        display: flex;
        align-items: center;

        > label {
          flex: 0 0 auto;
          transform: translateY(4px);
          margin-right: 0.5rem;
        }
      }

      input[type="checkbox"] {
        display: inline-block;
        cursor: pointer;
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      line-height: 1.1;
    }

    pre {
      background: #0d0d0d;
      color: #fff;
      font-family: "JetBrainsMono", monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }

      .hljs-comment,
      .hljs-quote {
        color: #616161;
      }

      .hljs-variable,
      .hljs-template-variable,
      .hljs-attribute,
      .hljs-tag,
      .hljs-name,
      .hljs-regexp,
      .hljs-link,
      .hljs-name,
      .hljs-selector-id,
      .hljs-selector-class {
        color: #f98181;
      }

      .hljs-number,
      .hljs-meta,
      .hljs-built_in,
      .hljs-builtin-name,
      .hljs-literal,
      .hljs-type,
      .hljs-params {
        color: #fbbc88;
      }

      .hljs-string,
      .hljs-symbol,
      .hljs-bullet {
        color: #b9f18d;
      }

      .hljs-title,
      .hljs-section {
        color: #faf594;
      }

      .hljs-keyword,
      .hljs-selector-tag {
        color: #70cff8;
      }

      .hljs-emphasis {
        font-style: italic;
      }

      .hljs-strong {
        font-weight: 700;
      }
    }

    img {
      max-width: 100%;
      height: auto;
    }

    blockquote {
      padding-left: 1rem;
      border-left: 2px solid var(--color-info);
    }

    hr {
      border: none;
      border-top: 2px solid var(--color-accent);
      margin: 2rem 0;
    }
  }
}
</style>