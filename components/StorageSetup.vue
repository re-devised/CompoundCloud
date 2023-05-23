<template>
    <div>
        <h2>//WHERE DO YOU WANT TO SAVE YOUR FILES?</h2>
        <div v-if="isDocker">
            <p>We noticed that you are running <b>CompoundCloud inside a Docker-Container</b>. To change the storage path to a folder outside the container, <b>mount a volume or bind a mount to '/usr/src/app/uploads' inside the container</b> like shown below. By default all files will be stored inside the container.</p>
            <pre><code>docker run -v YOUR_LOCATION:/usr/src/app/uploads -v cc-config:/usr/src/app/config compoundcloud</code></pre>
            <p>For further information about how to bind mounts visit the Docker documentation for <a href="https://docs.docker.com/storage/bind-mounts/#mount-into-a-non-empty-directory-on-the-container" target="_blank">docker run</a> or <a href="https://docs.docker.com/storage/bind-mounts/#use-a-bind-mount-with-compose" target="_blank">docker-compose</a>.</p>
        </div>
        <p>Keep in mind that CompoundCloud won't work properly if your selected folder has any kind of access restrictions.</p>
        <form v-if="!isDocker">
            <label for="storagePath">Storage Location (absolute or relative)</label>
            <input type="text" class="cloudInput" id="storagePath" aria-describedby="storagePathHelp" 
                v-model="uploadPath" @blur="updateUploadPath" ref="storagePath">
            <small id="storagePathHelp" class="form-text text-muted"></small>
        </form>
        <button type="submit" class="primary-button mt-4" @click.prevent="applyStorageDecision">
            {{isDocker ? 'Continue' : 'Select'}}
        </button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            uploadPath: ''
        }
    },
    computed: {
        isDocker(){
            return this.$store.state.setting.isDocker
        }
    },
    created(){
        if((this.$store.state.setting.adminSettings.storagePath).length > 0){
            this.resetUploadPathToStorePath()
        }else{
            this.$store.dispatch('diskspace/resolveUploadPath')
                .then(uploadPath => {
                    this.$store.dispatch('setting/changeStoragePath', uploadPath)
                        .then(uploadPath => this.resetUploadPathToStorePath())
                        .catch(err => this.$toasted.show(err, {duration: 5000, position: "bottom-center"}))
                })
        }
    },
    methods: {
        updateUploadPath(){
            this.$store.dispatch('diskspace/resolveUploadPath', this.uploadPath)
                .then(uploadPath => {
                    this.$store.commit('setting/setStoragePath', uploadPath)
                    this.resetUploadPathToStorePath()
            })
        },
        resetUploadPathToStorePath(){
            this.uploadPath = this.$store.state.setting.adminSettings.storagePath
        },
        async applyStorageDecision(){
            if(this.isDocker == 'Docker'){
                this.$emit('selectionPartNext')
            }else{
                await this.updateUploadPath()
                this.$store.dispatch('setting/changeStoragePath', this.uploadPath)
                    .then(_ => this.$emit('selectionPartNext'))
                    .catch(err => this.$toasted.show(err, {duration: 5000, position: "bottom-center"}))
            }
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

    a{
        color: var(--color-info);
        text-decoration: underline;
    }

    pre {
      background: #0d0d0d;
      color: #fff;
      font-family: "JetBrainsMono", monospace;
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;

      code {
        color: inherit;
        padding: 0;
        background: none;
        font-size: 0.8rem;
      }
    }

</style>