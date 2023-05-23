<template>
    <div>
        <modal 
        ref="modal"
        @submitted="handleModalAction">
        <form>
            <label for="cloudname">Cloudname</label>
            <small id="cloudnameHelp" class="text-muted">(The name can be used instead of an ID (Optional))</small>
            <input type="text" class="cloudInput" id="cloudname" aria-describedby="cloudnameHelp" v-model="form.cloudname" ref="cloudname">
            <label for="user" v-if="users && users[0] != null">Assign User</label>
            <v-select
                id="user" aria-describedby="userHelp" class="cloudInputSelect"
                v-model="form.user" 
                v-if="users && users[0] != null"
                ref="user"
                :options="users"
                label="username"
            ></v-select>
        </form>
        </modal>

        <button class="top-nav-button" @click.prevent="openModal('create')">
            <svg-icon icon="plus" class="icon" size="xs"/> Create
        </button>

        <button class="top-nav-button" disabled>
            Clouds: {{cloudCount}}
        </button>         
    </div>
</template>

<script>
import SvgIcon from '~/components/shared/SvgIcon'
import Modal from '~/components/shared/Modal'
import 'vue-select/dist/vue-select.css';

export default {    
    components:{
        SvgIcon,
        Modal
    },
    data() {
        return {
            form:{
                cloudname: '',
                user: null
            }
        }
    },
    props:{
        cloudCount:{
            type: Number
        },
        users:{
            type: Array
        }
    },
    methods:{
        handleModalAction([index, action]){  
            if(action == "create") this.createCloud()    
        },
        openModal(action){
            if(action == "create"){
                this.$refs.modal.openModal([{
                    title : "Create Cloud",
                    actionTitle : "Create",
                },
                action])
                this.loadUsers()
            }
        },
        async createCloud(){
            const isUser = this.form.user ? true : false
            const creator = this.form.user ? this.form.user._id : undefined
            const cloudName = this.form.cloudname != "" ? this.form.cloudname : undefined

            const data = {
                'name' : cloudName,
                'shared' : !isUser,
                'creator' : creator
            }

            const cloud = await this.$store.dispatch('cloud/createCloud', data)
                .catch(err => {
                    this.$toasted.show('An error has occurred. Cloud could not be created', {
                        duration: 5000, 
                        position: "bottom-center", 
                    })
                })

            const cloudInArray = [cloud]
            await this.$store.dispatch('cloud/openClouds', cloudInArray)
                .then(_ => {
                    this.$store.commit('cloud/pushCloudAllClouds', cloud)
                    this.$toasted.show('Cloud was created successfully', { duration: 5000 })
                    })
                .catch(err => {
                    this.$toasted.show('An error has occurred. Cloud could not be opened', {
                        duration: 5000, 
                        position: "bottom-center", 
                    })
                })    
        },
        async loadUsers(){
            await this.$store.dispatch('user/fetchUsers')
              .catch(_ => {
                this.$toasted.error(`Users could not be loaded`, {
                  duration: 5000,
                })
              })
        }
    }
}
</script>
