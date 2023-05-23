<template>
    <tr>
        <th scope="row">
          <svg-icon :icon="isSharedIcon" color="info" size="media-m l" style="float: right"/>
        </th>
        <td>
        <input 
          type="text" 
          ref="cloudName" 
          v-model="newCloudName" 
          v-if="isRename" 
          @change="openModal('rename')"
          @blur="isRename = false"
          @keyup.enter="isRename = false">
          <span v-else @dblclick="openInput">{{cloudName | shortenText(((shortenTextNumber - 4) < 12) ? (shortenTextNumber - 4) : (12))}}</span>
        </td>
        <td class="mobile-none-l">{{cloud._id}}</td>
        <td>{{creator | shortenText(((shortenTextNumber - 4) < 12) ? (shortenTextNumber - 4) : (12))}}</td>
        <td class="mobile-none-m">{{size | calculateSize}}</td>
        <td class="mobile-none-xl">{{cloud.createdAt | formatDate('L')}}</td>
        <td class="actions">
          <popper
            trigger="clickToToggle"
            :options="{placement: 'left'}"
            :append-to-body="true"
            :visible-arrow="false"
            >
            <div class="popper">
              <button class="null-button" @click.prevent="openCloud"><svg-icon class="popper-icon" icon="folder" size="s"/> Open</button>
              <button class="null-button" @click.prevent="openInput"><svg-icon class="popper-icon" icon="pen" size="s"/> Rename</button>
              <button class="null-button" @click.prevent="" disabled><svg-icon class="popper-icon" icon="log" size="s"/> Show details</button>
              <button class="null-button" @click.prevent="openLog" disabled><svg-icon class="popper-icon" icon="log" size="s"/> Show logs</button>
              <button class="null-button" @click.prevent="lockCloud" disabled><svg-icon class="popper-icon" icon="lock" size="s"/> Deactivate</button>
              <button class="null-button" @click.prevent="clearFiles" disabled><svg-icon class="popper-icon" icon="backspace" size="s"/> Clear</button>
              <button class="null-button" @click.prevent="openModal('delete')"><svg-icon class="popper-icon" icon="trash" size="s"/> Delete</button>
            </div>
                
            <button slot="reference" class="null-button" ref="popperButton">
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
    Popper,
  },
  data() {
    return {
      cloudName: this.cloud.name,
      newCloudName: this.cloud.name,
      isRename: false
    }
  },
  props:{
    cloud: {
      required: true,
      type: Object
    },
    user: {
      type: Object
    },
    openedClouds: {
      type: Array,
      required: true
    },
    shortenTextNumber:{
      type: Number
    } 
  },
  computed:{
    // downloadFile(){
    //   return `/api/file/${this.cloud}/${this.file._id}/download`
    // }
    creator(){
        if(this.cloud.creator){
            return this.cloud.creator.username
        }else return "Unknown"
    },
    isSharedIcon(){
      if(this.cloud.shared.status) return "hdd_fill"
      return "hdd"
    },
    size(){
      let cloudSize = 0
      const files = this.cloud.files
      for(var file in files){
        cloudSize += files[file].size
      }
      return cloudSize
    }
  },
  methods:{
    // deleteFile(){
    //   this.$store.dispatch('file/deleteFile', [this.cloud, this.file._id])
    //     .catch(error => this.$toasted.error(error, { duration: 5000, }))
    // },
    openInput(){
      this.newCloudName = this.cloudName
      this.isRename = true
      this.$nextTick(() => this.$refs.cloudName.focus())
    },
    openModal(action){
      this.$refs.popperButton.click()

      if(action == "delete"){
        this.$emit('openModal', [{
          title : "Delete Cloud",
          actionTitle : "Delete",
          message: `Are you sure you want to delete the cloud "${this.cloud.name ? this.cloud.name : this.cloud._id}"? All files on this cloud will be deleted. The cloud will be removed from the creator and can no longer be accessed.`
        },
        action]
        )
      }
      if(action == "rename"){
        this.$emit('openModal', [{
          title : "Rename Cloud",
          actionTitle : "Rename",
          message: `Are you sure you want to rename the cloud "${this.cloud.name ? this.cloud.name : this.cloud._id}" in "${this.newCloudName}"? The cloud will no longer be accessible under the old name. The old name will be reassignable for new clouds.`
        },
        action]
        )
      }
     
    },
    async renameCloud(){
      await this.$store.dispatch('cloud/renameCloud', [this.cloud._id, this.newCloudName])
        .then(_ => {
          this.cloudName = this.newCloudName
          this.$toasted.show('Cloud was renamed successfully', { duration: 5000, })
        })
        .catch(error => this.$toasted.error(error, { duration: 5000, }))
    },
    async openCloud(){
      var cloudIsOpen = false
      for(var cloud in this.openedClouds){
        if(this.openedClouds[cloud]._id == this.cloud._id) cloudIsOpen = true
      }                
      if(!cloudIsOpen){
        if(this.user && this.user.isAdmin){
            await this.$store.dispatch('cloud/openClouds', [this.cloud]) 
              .then(_ => {})
              .catch(error => {
                this.$toasted.error(error, { duration: 5000, })
              })                      
        }                       
      } 
    },
    async deleteCloud(){
      await this.$store.dispatch('cloud/deleteCloud', this.cloud._id)
        .then(_ => this.$toasted.show('Cloud was deleted successfully', { duration: 5000, }))
        .catch(error => this.$toasted.error(error, { duration: 5000, }))
    }
  }
}
</script>

<style scoped lang="scss">
.popper{
  background-color: var(--color-popper);
  padding: 5px 20px;
  border-radius: 6px;
  margin: 0;
  border: 1px solid transparent;
  box-shadow: var(--shadow-small);
  display: flex;
  flex-direction: column;
  
  button{
    padding: 2px;
  }

  &-icon{
    display: none;
    margin-right: 7px;
    font-size: 11pt !important;
    @media (max-width: 992px) {
      font-size: 14pt !important;
    }
  }
}

 
th, td{
  border: 0 solid var(--color-accent);
  border-width: 1px 0 0 0;
  padding: 10px;
  
  input{
    border: 0px solid transparent;
    border-bottom: 1px solid var(--color-accent-2);
    background: transparent;
    color: var(--color-primary);
    padding: 0px;
    // max-width: 100%;

    &:focus{
      outline: none;
    }
  }
}

.actions{
  display: flex;
  align-items: center;

  :nth-child(n){
    padding-right: 4px;
    font-size: 18pt;
  }
}
</style>