<template>
    <tr :class="{'selected' : fileSelected}" @click="selectFile">
        <!-- <td>
          <input 
            type="checkbox" value="" 
            :id="'selectedFile_' + fileName" 
            v-model="fileSelected">
          <label :for="'selectedFile_' + fileName"></label>
        </td> -->
        <td scope="row">
          <svg-icon :file_name="fileName" color="info" 
          style="float: right" size="media-m l"/>
        </td>
        <!-- {{file.name | shortenText(55)}} -->
        <td class="fileName"><input 
          type="text" 
          ref="fileName" 
          v-model="fileName" 
          v-if="isRename" 
          @change="renameFile"
          @blur="isRename = false"
          @keyup.enter="isRename = false">
          <span v-else @dblclick="openInput">{{fileName | shortenText(shortenTextNumber)}}</span>
        </td>
        <td class="mobile-none-s">{{file.size | calculateSize}}</td>
        <td class="mobile-none-l">{{file.createdAt | formatDate('L')}}</td>
        <td class="actions">
          <a :href="downloadFile" @click="$emit('resetSelectedFiles')"><svg-icon icon="download" size="xs"/></a>        
          <popper
            trigger="clickToToggle"
            :options="{placement: 'left'}"
            :append-to-body="true"
            :visible-arrow="false"
            >
            <div class="popper">
              <button class="null-button" @click.prevent="deleteFile"><svg-icon icon="trash" class="popper-icon" size="xs"/> Delete</button>
              <button class="null-button" @click.prevent="openInput"><svg-icon icon="pen" class="popper-icon" size="xs"/> Rename</button>
            </div>
        
            <button slot="reference" class="null-button">
              <svg-icon icon="three_dots" size="xs"/>
            </button>
          </popper>
        </td>
    </tr>  
</template>

<script>
import SvgIcon from '~/components/shared/SvgIcon'
import Popper from 'vue-popperjs';
//import 'vue-popperjs/dist/vue-popper.css';
export default {
  components:{
    SvgIcon,
    Popper
  },
  data() {
    return {
      fileName: this.file.filename,
      isRename: false,
      
    }
  },
  props:{
    file: {
      required: true,
      type: Object
    },
    cloud: {
      type: String
    },
    shortenTextNumber:{
      type: Number
    },
    fileSelected:{
      type: Boolean,
      default: false
    } 
  },
  computed:{
    downloadFile(){
      return `/api/file/${this.cloud}/${this.file._id}/download`
    }
  },
  methods:{
    deleteFile(){
      this.$store.dispatch('file/deleteFile', [this.cloud, this.file._id])
        .catch(error => this.$toasted.error(error, { duration: 5000, }))
    },
    openInput(){
      this.isRename = true
      this.$nextTick(() => this.$refs.fileName.focus())
    },
    async renameFile(){
      await this.$store.dispatch('file/renameFile', [this.cloud, this.file._id, this.fileName])
        .catch(error => this.$toasted.error(error, { duration: 5000, }))
    },
    selectFile(){
      this.$emit('selectFile', this.file._id)
    }
  }
}
</script>

<style scoped lang="scss">
.popper{
  background-color: var(--color-popper) !important;
  padding: 5px 20px !important;
  border-radius: 6px !important;
  margin: 0 !important;
  border: 1px solid transparent !important;
  box-shadow: var(--shadow-small) !important;
  display: flex !important;
  flex-direction: column !important;

  button{
    padding: 2px !important;
  }

  &-icon{
    display: inline !important; 
    margin-right: 6px !important;
    font-size: 11pt !important;
    // @media (max-width: 992px) {
    //   font-size: 13pt !important;
    // }
  }
}

td{
  border: 0 solid var(--color-accent);
  border-width: 1px 0 0 0;
  padding: 10px;  


  input{
    border: 0px solid transparent;
    background: transparent;
    border-bottom: 1px solid var(--color-accent-2);
    color: var(--color-primary);
    padding: 0px;
    // max-width: 100%;

    &:focus{
      outline: none;
    }
  }

  // label{margin: 0;}
  // input[type="checkbox"] {
  //   display:none;
  // }
  // input[type="checkbox"] + label::before {
  //   width: 16px;
  //   height: 16px;
  //   margin: 0 !important;
  //   border-radius: 8px;
  //   border: 2px solid var(--color-accent);
  //   background-color: transparent;
  //   display: block;
  //   content: "";
  //   // float: left;
  //   // transform: translateY(20%);
  // }
  // input[type="checkbox"]:checked+label::before {
  //   box-shadow: inset 0px 0px 0px 2px var(--bg-color);
  //   background-color: var(--color-primary);
  // }
}


.selected{
  .fileName{
    position: relative;
    &::after{
      height: 70%;
      background-color: var(--color-accent-3);
      opacity: 0.8;
      box-shadow: var(--shadow-medium-shifted);
      width: calc(100% + 30px);
      border-radius: 10px;
      position: absolute;
      left: 0px;
      transform: translate(-60px, -25%);
      content: "";
      z-index: -1;
      // margin-top: -15px;
      display: inline-block;
    }
  }
  // position: relative;
}


.actions{
  display: flex;
  align-items: center;

  :nth-child(n){
    padding-right: 4px;
    font-size: 18pt;
    /*@media (min-width: 992px) {
      font-size: 18pt;
    }*/
  }
}
</style>