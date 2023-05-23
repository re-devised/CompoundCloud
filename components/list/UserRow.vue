<template>
    <tr>
        <th scope="row">
          <svg-icon :icon="isSharedIcon" color="info" size="media-m l" style="float: right"/>
        </th>
        <td>
        <input 
          type="text" 
          ref="userName" 
          v-model="newUserName" 
          v-if="isRename" 
          @change="openModal('rename')"
          @blur="isRename = false"
          @keyup.enter="isRename = false">
          <span v-else @dblclick="openInput">{{userName | shortenText(((shortenTextNumber - 4) < 12) ? (shortenTextNumber - 4) : (12))}}</span>
        </td>
        <td class="mobile-none-m">{{user._id}}</td>
        <td>{{user.clouds}}</td>
        <td class="mobile-none-xl">{{user.createdAt | formatDate('L')}}</td>
        <td class="actions">
          <popper
            trigger="clickToToggle"
            :options="{placement: 'left'}"
            :append-to-body="true"
            :visible-arrow="false"
            >
            <div class="popper">
              <button class="null-button" @click.prevent="openInput"><svg-icon class="popper-icon" icon="pen" size="s"/> Rename</button>
              <button class="null-button" @click.prevent="openLog" disabled><svg-icon class="popper-icon" icon="log" size="s"/> Show logs</button>
              <button class="null-button" @click.prevent="" disabled><svg-icon class="popper-icon" icon="log" size="s"/> Show details</button>
              <button class="null-button" @click.prevent="showClouds" disabled><svg-icon class="popper-icon" icon="cloud" size="s"/> Show clouds</button>
              <button class="null-button" @click.prevent="openModal('changeRole')" disabled><svg-icon class="popper-icon" icon="person" size="s"/> Change role</button>
              <button class="null-button" @click.prevent="lockCloud" disabled><svg-icon class="popper-icon" icon="lock" size="s"/> Deativate</button>
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
import Popper from 'vue-popperjs'
//import 'vue-popperjs/dist/vue-popper.css';
export default {
  components:{
    SvgIcon,
    Popper,
  },
  data() {
    return {
      userName: this.user.username,
      newUserName : this.user.username,
      isRename: false
    }
  },
  props:{
    user: {
      required: true,
      type: Object
    },
    shortenTextNumber:{
      type: Number
    } 
  },
  computed:{
    isSharedIcon(){
      if(this.user.isAdmin) return "person_fill"
      return "person"
    },
    // clouds(){
    //   for((this.user.clouds).length)
    // }
  },
  methods:{
    // deleteFile(){
    //   this.$store.dispatch('file/deleteFile', [this.cloud, this.file._id])
    //     .catch(error => this.$toasted.error(error, { duration: 5000, }))
    // },
    openInput(){
      this.newUserName = this.userName
      this.isRename = true
      this.$nextTick(() => this.$refs.userName.focus())
    },
    openModal(action){
      this.$refs.popperButton.click()

      if(action == "delete"){
        this.$emit('openModal', [{
          title : "Delete user",
          actionTitle : "Delete",
          message: `Are you sure you want to delete the user "${this.user.username ? this.user.username : this.user._id}"? All clouds created by him as well as his files will be deleted. After deletion, the username will be reassignable again.`
        },
        action]
        )
      }
      if(action == "rename"){
        this.$emit('openModal', [{
          title : "Rename user",
          actionTitle : "Rename",
          message: `Are you sure you want to rename the user "${this.user.username ? this.user.username : this.user._id}" in "${this.newUserName}"? One will no longer be able to log in under the old name. After renaming, the username will be reassignable again. Also, the name of the main cloud will be changed in the same way.`
        },
        action]
        )
      }
     
    },
    async renameUser(){
      await this.$store.dispatch('user/renameUser', [this.user._id, this.newUserName])
        .then(_ => {
          this.userName = this.newUserName
          this.$toasted.show('User was renamed successfully', { duration: 5000, })
        })
        .catch(error => this.$toasted.error(error, { duration: 5000, }))
      },
    // async openCloud(){
    //   var cloudIsOpen = false
    //   for(var cloud in this.openedClouds){
    //     if(this.openedClouds[cloud]._id == this.cloud._id) cloudIsOpen = true
    //   }                
    //   if(!cloudIsOpen){
    //     console.log(this.user)
    //     if(this.user){
    //         var userClouds = this.user.clouds
    //         var userCloudIsOpen = false
    //         for(var userCloud in userClouds){
    //             if(this.cloud._id == userClouds[userCloud]._id) userCloudIsOpen = true
    //         }
    //         if(!userCloudIsOpen) await this.$store.dispatch('user/openCloudForUser', [this.user._id, this.cloud._id])                          
    //     }
    //     this.$store.commit('cloud/openCloud', this.cloud)                    
    //   } 
    // },
    async deleteUser(){
      await this.$store.dispatch('user/deleteUser', this.user._id)
        .then(isAdminUserLoggedIn => {
          this.$toasted.show('User was deleted successfully', { duration: 5000, })
          if(!isAdminUserLoggedIn) this.$router.push('/addcloud?action=login')
        })
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
      font-size: 13pt !important;
    }
  }
}

.mobile-list{
@media (max-width: 992px) {
  display: none;
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
    font-size: 20pt;
    @media (min-width: 992px) {
      font-size: 18pt;
    }
  }
}
</style>