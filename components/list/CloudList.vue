<template>
    <empty-list-screen
    v-if="clouds.count === 0"
    heading="No clouds found"
    info="You can create a cloud from the admin menu or directly from the creation page for users"
    />

    <table class="cloud-list" v-else>
        <thead>
            <tr>
                <th scope="col"></th><!--WENN GETEILT DANN FILL, WENN NICHT DANN OHNE FILL ICON-->
                <th scope="col" @click.prevent="changeSortingMethod('name')" class="sortingChanger">
                    Name <svg-icon :icon="sortDirection" class="sortingIcon" size="xxs"/>
                </th>
                <th scope="col" @click.prevent="changeSortingMethod('_id')" class="sortingChanger mobile-none-l">
                    Id <svg-icon :icon="sortDirection" class="sortingIcon" size="xxs"/>
                </th>
                <th scope="col" @click.prevent="changeSortingMethod('creator.username')" class="sortingChanger">
                    Creator <svg-icon :icon="sortDirection" class="sortingIcon" size="xxs"/>
                </th>
                <th scope="col" @click.prevent="changeSortingMethod('size')" class="sortingChanger mobile-none-m">
                    Size <svg-icon :icon="sortDirection" class="sortingIcon" size="xxs"/>
                </th>
                <th scope="col" @click.prevent="changeSortingMethod('createdAt')" class="sortingChanger mobile-none-xl">
                    Created at <svg-icon :icon="sortDirection" class="sortingIcon" size="xxs"/>
                </th>
                <!-- <th scope="col" class="mobile-list">Größe</th> -->
                <th scope="col"><span class="mobile-none-s">Actions</span></th>
            </tr>
        </thead>
        <tbody>
            <modal 
                ref="modal"
                @submitted="handleModalAction"
            />
            <cloud-row            
            v-for="(cloud, index) in clouds.clouds"
            ref="cloudRowRef"
            :key="cloud._id"
            :cloud="cloud"
            :openedClouds="openedClouds"
            :user="user"
            :shortenTextNumber="shortenTextNumber"
            @openModal="openModal($event, index)"
            />
        </tbody>
    </table>  
</template>

<script>
import SvgIcon from '~/components/shared/SvgIcon'
import Modal from '~/components/shared/Modal'
import CloudRow from '~/components/list/CloudRow'
import EmptyListScreen from '~/components/list/EmptyListScreen'
export default {
    components:{
        SvgIcon,
        CloudRow,
        Modal,
        EmptyListScreen
    },
    // data() {
    //     return {
    //         addFiles: [],
    //     }
    // },
    props:{
        clouds: {
            required: true,
            type: Object
        },
        openedClouds: {
            type: Array,
            required: true
        },
        user: {
            type: Object
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
        }
    },
    methods:{
        handleModalAction([index, action]){  
            if(action == "delete") this.$refs.cloudRowRef[index].deleteCloud()
            if(action == "rename") this.$refs.cloudRowRef[index].renameCloud()            
        },
        openModal(content, index){
            this.$refs.modal.openModal(content, index)
        },
    },
    computed: {
        size(){
            let cloudSize = 0
            const files = this.cloud.files
            for(var file in files){
                cloudSize += files[file].size
            }
            return cloudSize
        }
    }
    // methods:{
    //     addFile(e){
    //         var droppedFiles = null

    //         if(e.target.files){
    //             droppedFiles = e.target.files
    //         }else if(e.dataTransfer.files){
    //             droppedFiles = e.dataTransfer.files
    //         }else return;

    //         // this tip, convert FileList to array, credit: https://www.smashingmagazine.com/2018/01/drag-drop-file-uploader-vanilla-js/
    //         ([...droppedFiles]).forEach((f,x) => {
    //             const formData = new FormData();
    //             formData.append('uploadFile', f);

    //             this.$store.dispatch('file/addFile', [this.cloud, formData])
    //                 .catch(error => this.$toasted.error(error, { duration: 5000, }))
    //         });
    //     },
    // }
}
</script>

<style scoped lang="scss">
    .cloud-list{    
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
    .emptyCloudListScreen{
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        padding-top: 200px;
        color: $charcoal;
        border: 1px solid var(--color-accent);

        .addCloudButton{
            background-color: transparent;
            border: 1px solid $charcoal;
            border-radius: 5px;
            width: 150px;
        }

        h3{
            color: var(--color-info);
        }
    }
</style>