<template>
    <div style="display: flex; flex-wrap: wrap">

        <modal ref="modal">
            <div style="width: 100%; height: 100%; display: flex; justify-content: center;">
                <vue-qrcode 
                    :value="currentCloudUrl" 
                    :color="{dark : colorPrimary, light : '#ffffff00'}"
                    :margin="0" :width="300"
                />
            </div>
        </modal>

        <input type="file" @change="addFile" multiple ref="fileInput" style="display: none">
       
        <button class="top-nav-button" @click="$refs.fileInput.click()">
            <svg-icon icon="upload" class="icon" size="xs"/> Upload
        </button>
        
        <popper
            trigger="clickToToggle"
            :options="{placement: 'bottom'}"
            :append-to-body="true"
            :visible-arrow="false"
            >
            <div class="popper">
                <button class="null-button" @click.prevent="copyLink"><svg-icon icon="link" class="popper-icon" size="s"/> Link</button>
                <button class="null-button" @click.prevent="openEmailProgramm"><svg-icon icon="envelope" class="popper-icon" size="s"/> Mail</button>
                <hr/>
                <vue-qrcode 
                :value="currentCloudUrl" 
                :color="{dark : colorPrimary, light : '#ffffff00'}"
                :margin="0" :width="130"
                @click.native="openQrCodeModal"
                />
            </div>
 
            <button slot="reference" class="top-nav-button">
                <svg-icon icon="share" class="icon icon-media" size="xs"/><span class="mobile-none-s"> Share</span>
            </button>
        </popper>

        <button class="top-nav-button mobile-none-s" disabled>
            Files: {{fileCount}}
        </button>

        <popper
            trigger="clickToToggle"
            :options="{placement: 'bottom-start'}"
            :append-to-body="true"
            :visible-arrow="false"
            >
            <div class="popper" style="padding-top: 15px !important">
                <button class="null-button settings-button" @click.prevent="emitDescriptionButtonClicked">
                    {{currentCloudDescription.length > 0 ? "Edit" : "Add"}} description
                </button>
                <button class="null-button settings-button" @click.prevent="emitDescriptionRemoveButtonClicked" 
                v-if="currentCloudDescription.length > 0">
                    Remove description
                </button>
            </div>
 
            <button slot="reference" class="top-nav-button">
                <svg-icon icon="sliders" size="xs"/>
            </button>
        </popper>
         
        <!-- <button class="top-nav-button" @click="$refs.fileInput.click()">
            Rolle: Admin
        </button>
        <button class="top-nav-button" @click="$refs.fileInput.click()">
            Onlinetime: unlimited    
        </button> -->
    </div>
</template>

<script>
import VueQrcode from 'vue-qrcode'
import SvgIcon from '~/components/shared/SvgIcon'
import Popper from 'vue-popperjs';
import Colors from '~/assets/scss/variables.scss' 
import rgba2hex from '~/plugins/rgba2hex.js'
import Modal from '~/components/shared/Modal'
//import 'vue-popperjs/dist/vue-popper.css';
export default {    
    data() {
        return {
            colorPrimary: '#35525eff',
            currentCloudUrl: ''
        }
    },
    components:{
        Popper,
        SvgIcon,
        VueQrcode,
        Modal
    },
    props:{
        addFile:{
            type: Function,
            required: true
        },
        fileCount:{
            type: Number
        },
        currentCloud:{
            type: String,
            required: true
        },
        currentCloudDescription: {
            type: String,
            required: true
        },
        clouds:{
            type: Array,
            required: true
        },
        getColorMode: {
            type: Function
        }
    },
    mounted(){
        this.updateColorPrimary()
        this.currentCloudUrl = location.href + "addcloud/?cloud=" + this.currentCloud
    },
    methods:{
        // updateQr(){
        //     for(var cloud in this.clouds){
        //         const canvas = document.getElementById(`canvas-${this.clouds[cloud]._id}`)
        //         QRCode.toCanvas(canvas, 
        //         `${location.href}addcloud/?cloud=${this.clouds[cloud]._id}`, 
        //         {
        //         errorCorrectionLevel: 'M', 
        //         color: {
        //             dark: '#35525eff', 
        //             light: '#fafafa'
        //         }, 
        //         margin: 0,
        //         width: 130
        //         },
        //         function (err, string) {
        //             if (err) console.error(err)
        //         })
        //     }
            


        //     //ERSTELLE EIN V_FOR FÜR ALLE GEÖFFNETEN CLOUDS UND ERSTELEL FÜR JEDE DAVON EIN QRCODE; DEN REST AUSLENDEN
        // },
        copyLink(){
            this.$copyText(`${location.href}addcloud/?cloud=${this.currentCloud}`)
                .then(_ => {
                    this.$toasted.show('Link was copied to the clipboard', {duration: 5000})
                }, _ => {
                    this.$toasted.error('Copying failed', {duration: 5000})
                })
        },
        openEmailProgramm(){
            window.location.href = 'mailto:?subject=Cloud%20Invitation&'
            + 'body=CompoundCloud%20invitation%20link%20for%20cloud%20[' + this.currentCloud + ']%20:%0A' 
            + location.href + 'addcloud/?cloud=' + this.currentCloud       
        },
        updateColorPrimary(){
            if(this.getColorMode() == 'dark-mode'){
                this.colorPrimary = '#93a3b1'
            }else this.colorPrimary = '#35525eff'
        },
        emitDescriptionButtonClicked(){
            this.$emit('descriptionButtonClicked')
        },
        emitDescriptionRemoveButtonClicked(){
            this.$emit('descriptionRemoveButtonClicked')
        },
        openQrCodeModal(){
            this.$refs.modal.openModal([{
                title : "QR-Code",
            }, null, false])
        },
    },
    watch: {
        currentCloud: function (){
            this.currentCloudUrl = location.href + "addcloud/?cloud=" + this.currentCloud
        },
    },
    computed:{
        colorPrimaryInHex(){
            return '#' + rgba2hex(this.colorPrimary)
        },
    }
}
</script>
