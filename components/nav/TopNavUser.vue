<template>
    <div>
        <modal 
        ref="modal"
        @submitted="handleModalAction">
        <form>
            <label for="username">Username</label>
            <input type="text" class="cloudInput" id="username" aria-describedby="usernameHelp" v-model="form.username" ref="username">
            <label for="password">Password</label>
            <input type="password" class="cloudInput" id="password" aria-describedby="passwordHelp" v-model="form.password" ref="password">
            <input class="mt-4" type="checkbox" value="" id="isAdmin" aria-describedby="isAdminHelp" v-model="form.isAdmin">
            <label class="mt-4" for="isAdmin">Administrator</label>
            <small id="isAdminHelp" class="ml-1 text-muted">(Full rights to edit and manage clouds and users)</small>
        </form>
        </modal>

        <button class="top-nav-button" @click.prevent="openModal('create')">
            <svg-icon icon="plus" class="icon" size="xs"/> Create
        </button>

        <button class="top-nav-button" disabled>
            Users: {{userCount}}
        </button>         
    </div>
</template>

<script>
import SvgIcon from '~/components/shared/SvgIcon'
import Modal from '~/components/shared/Modal'

export default {    
    components:{
        SvgIcon,
        Modal
    },
    data() {
        return {
            form:{
                username: null,
                password: null,
                isAdmin: false
            }
        }
    },
    props:{
        userCount:{
            type: Number
        }
    },
    methods:{
        handleModalAction([index, action]){  
            if(action == "create") this.registerUser()        
        },
        openModal(action){
            this.$refs.modal.openModal([{
                title : "Register User",
                actionTitle : "Register",
            },
            action])
        },
        registerUser(){
            this.$store.dispatch('user/register', this.form)
                .then(user => this.$toasted.show("User was registered successfully", {duration: 5000}))
                .catch(err => this.$toasted.show(err, {duration: 5000}))
                
        }
    }
}
</script>