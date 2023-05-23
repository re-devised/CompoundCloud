<template>
    <div>
        <h2>//WHO GETS THE RIGHT TO CREATE USERS?</h2>

        <p>Info: Public clouds can be created and accessed without the need of a user. Creating and accessing private clouds need a user for authentication.</p>
        <p>What's your preference?</p>
        
        <div class="userSetupStepOne">
            <button class="userSetupStepOneButton" :class="{'userSetupStepOneButtonActive' : everyoneCanCreateUsers}"
                @click="everyoneCanCreateUsers = true">Everyone can create a user</button>
            <button class="userSetupStepOneButton" :class="{'userSetupStepOneButtonActive' : !everyoneCanCreateUsers}"
                @click="everyoneCanCreateUsers = false">Admins can create users</button>
        </div>

        <p style="margin-top: 60px;">Create first user (Admin)</p>
        <form>
            <label for="userName">Username</label>
            <input type="text" class="cloudInput" id="userName" aria-describedby="userNameHelp" v-model="form.username" ref="userName">
            <small id="userNameHelp" class="form-text text-muted"></small>

            <label for="password">Password</label>
            <input type="password" class="cloudInput" id="password" aria-describedby="passwordHelp" v-model="form.password" ref="password">
            <small id="passwordHelp" class="form-text text-muted"></small>

            <button type="submit" class="primary-button mt-4" @click.prevent="registerUser">Create</button>
        </form>
        <!-- <form>
            <label for="storagePath">Speicherort</label>
            <input type="text" class="cloudInput" id="storagePath" aria-describedby="storagePathHelp" v-model="storagePath" ref="storagePath">
            <small id="storagePathHelp" class="form-text text-muted"></small>
            <button type="submit" class="primary-button mt-4">Auswählen</button>
        </form> -->
    </div>
</template>

<script>
export default {
    data() {
        return {
            form: {
                username: null,
                password: null,
                isAdmin: true
            },
            everyoneCanCreateUsers: true
        }
    },
    methods: {
        registerUser(){
            this.$store.dispatch('user/register', this.form)
                .then(user => {
                    this.$toasted.show("User was registered successfully", {duration: 5000, position: "bottom-center"})
                    
                    this.$store.dispatch('user/login', this.form)
                        .then(_ => {
                            this.finishSetup()
                        })
                        .catch(err => {
                            this.$toasted.show('This user was not found', {duration: 5000, position: "bottom-center"})
                        })
                })
                .catch(err => this.$toasted.show(err, {duration: 5000, position: "bottom-center",}))
                
        },
        finishSetup(){
            this.$store.dispatch('setting/setUserCreationMode', !this.everyoneCanCreateUsers)
                .then(_ => {
                    this.$store.dispatch('setting/disableIsSetupMode')
                        .then(_ => {
                            this.$router.push('/')
                        })
                })
                .catch(err => this.$toasted.show(err, {duration: 5000, position: "bottom-center",}))

            
        }
    }
}
</script>

<style scoped lang="scss">
    h2{
        color: var(--color-info);
        padding-bottom: 50px;
        letter-spacing: -1px;
    }
    .userSetupStepOne{
        display: grid;
        grid-template-columns:  1fr 1fr;
        gap: 10px;
    }
    .userSetupStepOneButton{
        background-color: var(--color-theme);
        color: var(--color-accent);
        border: 0px solid transparent;
        border-radius: 10px;
        padding: 10px 20px;
        height: 100%;
        
        &:focus{
            outline: none;
        }
    }
    .userSetupStepOneButtonActive{
        background-color: var(--color-info);
    }
</style>