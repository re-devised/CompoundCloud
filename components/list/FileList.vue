<template>
    <empty-list-screen 
    v-if="this.files.count == 0"
    heading="You have not added any files yet :("
    info="Simply drag and drop your files into this field or use the button to upload them"
    >
        <input type="file" @change="addFile" multiple ref="fileInput" style="display: none">
        <button class="addButton" @click="$refs.fileInput.click()">
            <svg-icon icon="plus" size="m"/>
        </button>
    </empty-list-screen>

    <table class="file-list" v-else>
        <thead>
            <tr>
                <!-- <th scope="col"></th> -->
                <th scope="col"></th>
                <th scope="col" @click.prevent="changeSortingMethod('filename')" class="sortingChanger">
                    Name <svg-icon :icon="sortDirection" class="sortingIcon" size="xxs"/>
                </th>
                <th scope="col" @click.prevent="changeSortingMethod('size')" class="sortingChanger mobile-none-s">
                    Size <svg-icon :icon="sortDirection" class="sortingIcon" size="xxs"/>
                </th>
                <th scope="col" @click.prevent="changeSortingMethod('createdAt')" class="sortingChanger mobile-none-l">
                    Changed at <svg-icon :icon="sortDirection" class="sortingIcon" size="xxs"/>
                </th>
                <th scope="col"><span class="mobile-none-s">Actions</span></th>
            </tr>
        </thead>
        <tbody>
            <file-row            
            v-for="file in files.files"
            :key="file._id"
            :file="file"
            :cloud="cloud"
            :shortenTextNumber="shortenTextNumber"
            :fileSelected="selectedFiles.includes(file._id) ? true : false"
            @selectFile="selectFile"
            @resetSelectedFiles="resetSelectedFiles"
            />
        </tbody>
    </table>  
</template>

<script>
import mobile from 'is-mobile'
import SvgIcon from '~/components/shared/SvgIcon'
import FileRow from '~/components/list/FileRow'
import EmptyListScreen from '~/components/list/EmptyListScreen'
export default {
    components:{
        FileRow,
        SvgIcon,
        EmptyListScreen
    },
    data() {
        return {
            addFiles: [],
            selectedFiles: []
        }
    },
    props:{
        files: {
            required: true,
            type: Object
        },
        cloud: {
            type: String
        },
        shortenTextNumber:{
            type: Number
        },
        changeSortingMethod: {
            type: Function,
            required: true
        },
        sortDirection: {
            type: String,
            default: 'desc'
        },
        pressedKeys: {
            type: Object,
            default: {}
        }
    },
    methods:{
        addFile(e){
            var droppedFiles = null

            if(e.target.files){
                droppedFiles = e.target.files
            }else if(e.dataTransfer.files){
                droppedFiles = e.dataTransfer.files
            }else return;

            // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
            ([...droppedFiles]).forEach((f,x) => {
                let formData = new FormData();
                formData.append('uploadFile', f);

                this.$store.dispatch('file/addFile', [this.cloud, formData])
                    .catch(error => this.$toasted.error(error, { duration: 5000, }))
            });
        },
        selectFile(fileId){
            if(mobile()){
                if(this.selectedFiles.includes(fileId)) this.selectedFiles.splice(this.selectedFiles.indexOf(fileId), 1)
                else this.selectedFiles.push(fileId)
            }else{
                if(this.selectedFiles.length > 0 && this.pressedKeys.Control != true) this.resetSelectedFiles()
                else this.selectedFiles.push(fileId)
            }
        },
        resetSelectedFiles(){
            this.selectedFiles = []
        }
    },
}
</script>

<style scoped lang="scss">
    .file-list{    
        width: 100%;
        // max-width: 1300px;
        position: relative;     
        margin-bottom: 20px;
        color: var(--color-primary);

        border-collapse: inherit;
        border-spacing: 0px;
        border: 0 solid var(--color-accent);
        border-width: 0 0 1px 0;  

        font-size: 11pt;

        /*@media (max-width: 992px) {
            font-size: 12pt;
        }    */  
        th, td{
        border: 0 solid var(--color-accent);
        border-width: 1px 0 0 0;        
        padding: 10px;   
        }
        .sortingChanger{
            .sortingIcon{
                display: none;
            }
            &:hover{    
                color: var(--color-info);
                cursor: pointer;
                .sortingIcon{
                    display:inline-flex;
                    // display: inline;
                }
            }
        }
    }
    .emptyFileListScreen{
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        padding-top: 200px;
        color: $charcoal;
        border: 1px solid var(--color-accent);

        .addFileButton{
            background-color: transparent;
            border: 1px solid var(--color-accent);
            border-radius: 5px;
            width: 150px;
        }

        h3{
            color: var(--color-info);
        }
    }
</style>