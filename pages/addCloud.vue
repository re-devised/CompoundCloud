<template>
    <div class="creationContainer">
        <div class="userCard" v-if="user">
            You are currently logged in as: <span>{{user.username}}</span>
            <button @click="$router.push('/')">My Clouds</button>
            <button @click="logout">Log Out</button>
        </div>
        <div class="creationCard">
            <div class="selection">
                <div class="selection-part" :class="{'is-active': activeSelectionPart == 1}" @click="activeSelectionPart = 1">
                    <h3>Open</h3>                    
                </div>
                <div class="selection-part" :class="{'is-active': activeSelectionPart == 2}" @click="activeSelectionPart = 2">
                    <h3>Create</h3>
                </div>
                <div class="selection-part" :class="{'is-active': activeSelectionPart == 3}" @click="activeSelectionPart = 3" v-if="!isUser">
                    <h3>Log In</h3>
                </div>
            </div>
            <div class="content">
                <open-cloud v-if="activeSelectionPart == 1"/>
                <create-cloud v-if="activeSelectionPart == 2"/>
                <login v-if="activeSelectionPart == 3 && !isUser"/>                
            </div>
        </div>
    </div>
</template>

<script>
import OpenCloud from '~/components/OpenCloud'
import CreateCloud from '~/components/CreateCloud'
import Login from '~/components/Login'
export default {
    head:{
        title: 'CompoundCloud'
    },
    transition: 'addCloud',
    components:{
        OpenCloud,
        CreateCloud,
        Login
    },
    mounted(){
        if(this.$route.query.action === "login" ) {
            this.activeSelectionPart = 3
        }
        window.addEventListener('keydown', this.switchActiveSelectionPart);
    },
    beforeDestroy() {
        window.removeEventListener('keydown', this.switchActiveSelectionPart);
    },
    data() {
        return {
            activeSelectionPart: 1
        }
    },
    computed: {
        user(){
            return this.$store.state.user.user
        },
        isUser(){
            return this.user ? true : false
        },
        activeSelectionParts(){
            return this.isUser ? 2 : 3
        }
    },
    methods:{
        async logout(){
            await this.$store.dispatch('user/logout')
                .then(isOpenedCloudRemaining => {
                    if(!isOpenedCloudRemaining) this.$router.push('/addcloud?action=login')
                })
                .catch(err => console.log(err))
        },
        switchActiveSelectionPart(e){
            if(e.keyCode === 39){ //rechts
                if(this.activeSelectionPart == this.activeSelectionParts){
                    this.activeSelectionPart = 1
                }else this.activeSelectionPart = this.activeSelectionPart + 1
                // if(this.activeSelectionPart === 3){
                //     this.activeSelectionPart = 1
                // }else this.activeSelectionPart = this.activeSelectionPart + 1
            }else if(e.keyCode === 37){ //links
                if(this.activeSelectionPart === 1){
                    this.activeSelectionPart = this.activeSelectionParts
                }else this.activeSelectionPart = this.activeSelectionPart - 1
            }
        }
    }

}
</script>

<style scoped lang="scss" >
*{
    // font-family: Arial, Helvetica, sans-serif;
    font-family: 'Inter', sans-serif;
}
html, body {
    height: fit-content; 
    width: fit-content;  
}

.addCloud-enter-active, .addCloud-leave-active { 
  transition: all 0.5s ease; 
}

.addCloud-enter, .addCloud-leave-to { 
  opacity: 0; 
  transform: translateX(-2em);
}

.creationContainer{
    position: relative;
    overflow: hidden !important;
    background-color: var(--color-secondary);
    min-height: 100vh;
    height: fit-content;
    width: 100%;
    padding: 120px 20px;
    @media (max-width: 992px) {
        padding: 40px 20px;
    }
}

.userCard{
    margin: auto;
    width: fit-content;
    max-width: 800px;
    padding: 10px 20px;
    margin-bottom: 20px;
    border-radius: 30px;
    z-index: 100;
    // padding: 40px 20px;
    color: var(--color-primary);
    background-color: var(--color-theme);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

    @media (max-width: 992px) {
        width: 100vw;
        border-radius: 0;
        margin: 0;
        position: fixed;
        bottom: 0;
        left: 0;
    }

    span{
        margin-right: 15px;
    }

    button{
        border: 0;
        border-left: 1px solid var(--color-accent);
        background-color: transparent;
        font-weight: 600;
        color: var(--color-primary);
        &:focus{
            outline: none;
        }
    }
}

.creationCard{
    margin: auto;
    width: 100%;
    max-width: 800px;
    height: 450px;
    @media (max-width: 992px) {height: 100%;}
    border-radius: 20px;
    // padding: 40px 20px;
    color: var(--color-primary);
    background-color: var(--color-accent);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

    .content{
        padding: 50px 25px;
    }

    .selection{
        width: 100%;
        height: 40px;
        margin: 0;
        background-color: var(--color-theme);
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        display: flex;        
        

        &-part{
            width: 50%;
            text-align: center;
            cursor: pointer;
            position: relative;  

            h3{
                font-size: 13pt;
                color: var(--color-primary);
                position: relative;
                z-index: 3;
                padding-top: 15px;
            }
            &::before{
                background-color: var(--color-accent);
                position: absolute;
                bottom: 0;
                width: calc(100% - 10px);
                z-index: 0;
                position: absolute;
                margin-top: 5px;
                height: 0px;
                border-top-left-radius: 15px;
                border-top-right-radius: 15px;
                content: "";
                transform: translate(-50%, 0);
                transition: height 0.2s ease-out;
            }
        }
        .is-active{
            &::before{
                height: 35px;
            }
            h3{
                color: var(--color-info);
                font-weight: 600;
            }
        }
    }
}
</style>
