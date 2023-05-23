<template>
    <portal to="modal">
    <div class="modal" v-if="isOpen">
        <div class="modal-background"></div>
        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">{{functionTitle ? functionTitle : title}}</p>
                <button @click="closeModal" class="delete null-button" aria-label="close"><svg-icon icon="x"/></button>
            </header>
            <section class="modal-card-body">    
                <slot>{{message}}</slot>
            </section>
            <footer class="modal-card-foot" v-if="buttonsEnabled">
                <button
                    :disabled="isDisabled"
                    @click="emitAction"
                    class="accent-button">
                    {{functionActionTitle ? functionActionTitle : actionTitle}}
                </button>
                <button @click="closeModal" class="accent-button">Cancel</button>
            </footer>
        </div>
    </div>
    </portal>
</template>
<script>
import SvgIcon from '~/components/shared/SvgIcon'
export default {
    components:{
        SvgIcon
    },
    props: {
        title: {
        type: String,
        default: ''
        },
        actionTitle: {
        type: String,
        default: 'Accept'
        },
        isDisabled: {
        type: Boolean,
        default: false
        }
    },
    data() {
        return {
        isOpen: false,
        buttonsEnabled: true,
        message: null,
        functionTitle: null,
        functionActionTitle: null,
        index: null,
        action: null
        }
    },
    methods: {
        emitAction() {
        this.$emit('submitted', [this.index, this.action])
        this.closeModal()
        },
        closeModal() {
        this.isOpen = false
        },
        openModal([content, action, buttonsEnabled], index) {
        if(content.message) this.message = content.message
        if(content.title) this.functionTitle = content.title
        if(content.actionTitle) this.functionActionTitle = content.actionTitle
        if(buttonsEnabled == false) this.buttonsEnabled = false
        if(index != null) this.index = index
        if(action) this.action = action
        this.isOpen = true
        }
    }
}
</script>
<style scoped lang="scss">
  .modal {
    // position: absolute;
    // left: 0;
    // top: 0;
    padding: 0 !important;
    margin: 0 !important;
    z-index: 200002;
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;


    &-background{
        position: absolute;
        left: 0;
        top: 0;
        background-color: rgba(100, 100, 100, 0.8);
        width: 100%;
        height: 100%;
    }

    &-card{
        // position: absolute;
        // top: 100px;
        // left: 50%;
        // transform: translateX(-50%);
        z-index: 200002;
        display: block;
        width: 700px;
        @media (max-width: 992px) {
            width: calc(100vw - 30px);
        }
        min-height: 200px;
        background-color: var(--color-accent-3);
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
        color: white;
        font-size: 12pt;
        padding: 5px;
        border-radius: 10px;


        &-head{
            border-radius: 5px;
            height: fit-content;
            padding: 20px;            
            color: var(--color-primary);
            background-color: var(--color-secondary);
            display: flex;
            justify-content: space-between;
            align-items: center;

            .modal-card-title{
                margin-bottom: 0;
                line-height: 1.5;
                font-size: 18pt;
                font-weight: 600;
                overflow: hidden;
            }

            .delete{
                // position: absolute;
                // top: 0px;
                // right: 10px;
            }
        }

        &-body{
            margin: 20px 0;
            padding: 20px 24px 20px 20px !important;
            color: black;
            border-left: 4px solid var(--color-info);
        } 

        &-foot{
            padding-top: 10px;
            border-top: 1px solid var(--color-accent);
        }
    }
  }
</style>
