<template>
    <div class="creationContainer">
        <!-- <div class="userCard">
            Options: <span>2</span> 
            <button>&lt;</button>
            <button>></button>
        </div> -->
        <div class="creationCard">
            <div class="selection">
                <div class="selection-part" :class="{'is-active': activeSelectionPart == 1}">
                </div>
                <div class="selection-part" :class="{'is-active': activeSelectionPart == 2}">
                </div>
                <div class="selection-part" :class="{'is-active': activeSelectionPart == 3}">
                </div>
            </div>
            <div class="content">
                <div v-if="activeSelectionPart == 1" class="content-welcome">

                    <div class="content-welcome-primary">
                        <div>
                            <h2>//WELCOME TO COMPOUNDCLOUD</h2>
                            <p>You are only a few steps away from your own cloud:</p>
                            <ul>
                                <!-- <li>Farbthema auswählen</li> -->
                                <li>Storage Location</li>
                                <li>User Configuration</li>
                            </ul>

                        </div>
                        <div id="content-welcome-animation">
                            <img src="~/static/cloud-animation.gif"/>
                        </div>
                    </div>


                    <button class="userSetupButton" @click="activeSelectionPart = 2">Get Started</button>
                </div>
                <storage-setup v-if="activeSelectionPart == 2" @selectionPartNext="activeSelectionPart++"/>
                <user-setup v-if="activeSelectionPart == 3"/>
            </div>
        </div>
    </div>
</template>

<script>
import StorageSetup from '~/components/StorageSetup'
import UserSetup from '~/components/UserSetup'

export default {
    head:{
        title: 'CompoundCloud'
    },
    transition: 'addCloud',
    components:{
        StorageSetup,
        UserSetup,
    },
    computed: {
        isSetupMode(){
            return this.$store.state.setting.adminSettings.isSetupMode
        }
    },
    async created(){
        if(!this.isSetupMode) this.$router.push('/')
    },
    mounted(){
        // if(this.$route.query.action === "login" ) {
        //     this.activeSelectionPart = 3
        // }


    },
    data() {
        return {
            activeSelectionPart: 1
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

h2{
    color: var(--color-info);
    padding-bottom: 30px;
    letter-spacing: -1px;
}

.userSetupButton{
    background-color: var(--color-info);
    color: var(--color-accent);
    border: 0px solid transparent;
    border-radius: 10px;
    padding: 10px 20px;
    height: 100%;

    &:focus{
        outline: none;
    }
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
    min-height: 450px;
    @media (max-width: 992px) {height: 100%;}
    border-radius: 20px;
    // padding: 40px 20px;
    color: var(--color-primary);
    background-color: var(--color-accent);
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);

    .content{
        padding: 50px 25px;

        &-welcome{
            display: flex;
            flex-direction: column;
            // align-items: center;
            height: 100%;

            &-primary{
                display: grid;
                grid-template-columns:  1fr 1fr;
                grid-gap: 40px;
                margin-bottom: 60px;

                @media (max-width: 767px) {
                    grid-template-columns:  1fr;
                }

                img{
                    width: 100%;
                    max-height: 500px;
                    filter: var(--image-filter)
                }
            }
        }
    }

    .selection{
        width: 100%;
        height: 20px;
        margin: 0;
        background-color: var(--color-theme);
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        display: flex;        
        

        &-part{
            width: 50%;
            text-align: center;
            // cursor: pointer;
            position: relative;  

            h3{
                font-size: 13pt;
                color: var(--color-primary);
                position: relative;
                z-index: 3;
                padding-top: 15px;
            }
            &::before{
                background-color: var(--color-info);
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
                height: calc(100% - 5px);
                border-top: 10px solid var(--color-accent);
                border-left: 30px solid var(--color-accent);
                border-right: 30px solid var(--color-accent);
            }
            h3{
                color: var(--color-info);
                font-weight: 600;
            }
        }
    }
}
</style>
