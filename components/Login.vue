<template>
    <div>
        <h2>//LOG IN USER</h2>
        <form>           
            <label for="username">Username</label>
            <input type="text" class="cloudInput" id="username" aria-describedby="usernameHelp" v-model="form.username" ref="username">

            <label for="password">Password</label>
            <input type="password" class="cloudInput" id="password" aria-describedby="passwordHelp" v-model="form.password" ref="password">
    
            <!-- <div class="form-group form-check pt-4">
                <input type="checkbox" class="form-check-input" id="speichernCheck" disabled>
                <label class="form-check-label" for="speichernCheck">Speichern</label>
            </div> -->
            <button type="submit" class="primary-button mt-4" @click.prevent="login">Log In</button>
            <button type="submit" class="null-button mt-4 ml-3" @click.prevent="register" v-if="!adminsOnlyUserCreationMode">Sign Up</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            form:{
                username: null,
                password: null
            }
        }
    },
    mounted(){
        this.$refs.username.focus()
    },
    computed: {
        adminsOnlyUserCreationMode(){
            return this.$store.state.setting.adminSettings.adminsOnlyUserCreationMode
        }
    },
    methods:{
        login(){
            this.$store.dispatch('user/login', this.form)
                .catch(err => {
                    this.$toasted.show('This user was not found', {
                        duration: 5000, 
                        position: "bottom-center", 
                    })
                })
                .then(user => {
                    this.$router.push('/')
                })
        },
        register(){
            this.$store.dispatch('user/register', this.form)
                .then(user => {
                    this.$toasted.show("User was registered successfully", {duration: 5000, position: "bottom-center"})
                    this.login()
                })
                .catch(err => this.$toasted.show(err, {duration: 5000, position: "bottom-center",}))
        }
    }
    
}
</script>

<style lang="scss" scoped>
    h2{
        color: var(--color-info);
        padding-bottom: 50px;
    }
</style>