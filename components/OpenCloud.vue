<template>
    <div>
        <h2>//OPEN CLOUD</h2>
        <form>
            <label for="cloudId">Cloudname or CloudID</label>
            <input type="text" class="cloudInput" id="cloudId" aria-describedby="cloudIdHelp" v-model="cloudId" ref="cloudId">
            <small id="cloudIdHelp" class="form-text text-muted"></small>
            <!-- <div class="form-group form-check pt-4">
                <input type="checkbox" class="form-check-input" id="speichernCheck" disabled>
                <label class="form-check-label" for="speichernCheck">Speichern</label>
            </div> -->
            <button type="submit" class="primary-button mt-4" @click.prevent="checkCloud">Open</button>
        </form>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data() {
        return {
            cloudId: '',
        }
    },
    computed: {
        ...mapState({
            openedClouds: state => state.cloud.openedClouds,
            user: state => state.user.user
        }),
    },
    mounted(){
        this.$refs.cloudId.focus()
    },
    created(){
        if(this.$route.query.cloud) {
            this.cloudId = this.$route.query.cloud
            this.checkCloud()
        }
    },
    methods:{
        async checkCloud(){
            var clouds = this.cloudId.replace(/[\s\/]/g, '')
            var clouds = clouds.split(',')

            var checkedClouds = await this.$store.dispatch('cloud/checkCloudExists', clouds)

            console.log(checkedClouds)
            for(var cloud in checkedClouds.unknown){
                this.$toasted.show(`Cloud ${checkedClouds.unknown[cloud]} was not found`, {
                    duration: 5000, 
                    position: "bottom-center", 
                })
            } 

            var isSuccess = checkedClouds.found.length > 0 ? true : false
            if(isSuccess) this.openClouds(checkedClouds.found)

        

            // for(var cloudId in clouds){
            //     await this.$store.dispatch('cloud/checkCloudExists', clouds[cloudId])
            //         .then(cloudCheck => {
            //             if(cloudCheck.isCloud){
            //                 if(cloudCheck.checkedCloud.shared.status){  
            //                     checkedClouds.push(cloudCheck.checkedCloud)  
            //                 }else{
            //                     this.$toasted.show(`Cloud "${cloudCheck.checkedCloud._id}" ist nicht öffentlich freigegeben. Bitte melde dich an`, {
            //                         duration: 5000, 
            //                         position: "bottom-center", 
            //                     })
            //                 }
            //                 checkedClouds.push(cloudCheck.checkedCloud)
            //             }
            //             if(!cloudCheck.isCloud){
            //                 this.$toasted.show(`Cloud "${clouds[cloudId]}" wurde nicht gefunden`, {
            //                     duration: 5000, 
            //                     position: "bottom-center", 
            //                 })
            //             }
            //         })
            //         .catch(err => {
            //             console.log(new Error(err))
            //         })
            // }

            // if(checkedClouds[0] != null){
            //     await this.$store.dispatch('cloud/openClouds', checkedClouds) //OPEN CLOUDS
            //         .then(_ => this.$router.push('/'))
            //         .catch(err => {
            //             this.$toasted.show('Es ist ein Fehler aufgetreten. Cloud/s konnte/n nicht geöffnet werden', {
            //                 duration: 5000, 
            //                 position: "bottom-center", 
            //             })
            //         })
            // }else{
            //     this.$toasted.show('Das Feld "Cloudname oder CloudID" darf nicht leer sein', {
            //         duration: 5000, 
            //         position: "bottom-center", 
            //     })
            // }
        },
        async openClouds(clouds){
            await this.$store.dispatch('cloud/openClouds', clouds)
                .then(_ => this.$router.push('/'))
                .catch(err => {
                    this.$toasted.show('An error has occurred. Cloud could not be opened', {
                        duration: 5000, 
                        position: "bottom-center", 
                    })
                })       
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