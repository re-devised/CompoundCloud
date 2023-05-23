import { mapState } from 'vuex'
import isCurrentCloud from "~/middleware/isCurrentCloud";
import isCloudShared from "~/middleware/isCloudShared";

export default {
    middleware: [isCurrentCloud, isCloudShared],
    data() {
        return {
            currentSection: 1,
        }
    },
    async created() {
        this.$store.dispatch('file/fetchFiles', this.currentCloud._id)
        this.$store.dispatch('diskspace/getDiskSpace')
    },
    computed: {
        ...mapState({
            files: state => state.file.items,
            clouds: state => state.cloud.openedClouds,
            currentCloud: state => state.cloud.currentCloud,
            user: state => state.user.user,
            diskSpace: state => state.diskspace.diskSpace
        }),
        isAdminUser() {
            return this.user.isAdmin;
        },
    },
    methods: {
        addFile(e) {
            this.onDragover = false;
            this.$refs.fileListRef.addFile(e);
        },
        async changeCurrentCloud(cloudId) {
            await this.$store
                .dispatch("cloud/checkCloudExists", [cloudId])
                .then(async (cloudCheck) => {
                    if (cloudCheck.found.length > 0) {
                        await this.$store.commit("cloud/setCurrentCloud", cloudCheck.found[0])
                        this.$refs.listInfoTextarea.exitEditorMode()                
                        this.$store.dispatch("file/fetchFiles", this.currentCloud._id);
                    } else if (cloudCheck.unknown.length > 0) {
                        this.$toasted.error(
                            `Cloud "${cloudCheck.unknown[0]}" was not found`,
                            {
                                duration: 5000,
                            }
                        );
                    } else return;
                });
        },
        async changeCurrentSection(section) {
            await this.adminChangeCurrentSection(section);
            this.currentSection = section;
        },
    }
}