<template>
    <div>
        <h2>//CREATE CLOUD</h2>
        <form>
            <label for="cloudName">Cloudname</label>
            <input type="text" class="cloudInput" id="cloudName" aria-describedby="cloudNameHelp" ref="cloudName" v-model="cloudName">
            <small id="cloudNameHelp" class="form-text text-muted">The name can be used instead of an ID (Optional)</small>
            <!-- <div class="form-group form-check pt-4">
                <input type="checkbox" class="form-check-input" id="speichernCheck" disabled>
                <label class="form-check-label" for="speichernCheck">Speichern</label>
            </div> -->
            <button type="submit" class="primary-button mt-4" @click.prevent="checkCloud">Create</button>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            cloudName: ''
        }
    },
    mounted(){
        this.$refs.cloudName.focus()
    },
    computed: {
        user(){
            return this.$store.state.user.user
        }
    },
    methods:{
        async checkCloud(){
            var matchedCloudName = [this.cloudName.replace(/[\s\/]/g, '')]
           
            await this.$store.dispatch('cloud/checkCloudExists', matchedCloudName) 
                .then(clouds => {
                    if(clouds.found.length > 0){
                        this.$toasted.show(`Cloud ${clouds.found[0]} already exists`, {
                            duration: 5000, 
                            position: "bottom-center", 
                        })
                    }                   
                    if(clouds.unknown.length > 0) this.createCloud(clouds.unknown[0])
                })
                .catch(err => {
                    this.$toasted.show('An error has occurred', {
                            duration: 5000, 
                            position: "bottom-center", 
                        })
                })
        },
        async createCloud(cloudName){
            // cloudName = IST NOCH NE _ID, SOLLTE NICHT ALS NAME EINGESTZT WERDEN
            const isUser = this.user ? true : false
            const creator = this.user ? this.user._id : undefined
            cloudName = cloudName != "" ? cloudName : undefined

            const data = {
                'name' : cloudName,
                'shared' : !isUser,
                'creator' : creator
            }

            const cloud = await this.$store.dispatch('cloud/createCloud', data)
                .catch(err => {
                    this.$toasted.show('An error has occurred. Cloud could not be created', {
                        duration: 5000, 
                        position: "bottom-center", 
                    })
                })
            
            const cloudInArray = [cloud]
            this.$store.dispatch('cloud/openClouds', cloudInArray)
            this.$router.push('/')         
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