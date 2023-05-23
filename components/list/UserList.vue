<template>
    <empty-list-screen
    v-if="users.count === 0"
    heading="No users found"
    info="Easily create the first user via the admin menu"
    />

    <table class="user-list" v-else>
        <thead>
            <tr>
                <th scope="col"></th><!--WENN ADMIN DANN FILL, WENN NICHT DANN OHNE FILL ICON-->
                <th scope="col" @click.prevent="changeSortingMethod('username')" class="sortingChanger">
                    Username <svg-icon :icon="sortDirection" class="sortingIcon" size="xxs"/>
                </th>
                <th scope="col" @click.prevent="changeSortingMethod('_id')" class="sortingChanger mobile-none-m">
                    Id <svg-icon :icon="sortDirection" class="sortingIcon" size="xxs"/>
                </th>
                <th scope="col" @click.prevent="changeSortingMethod('clouds')" class="sortingChanger">
                    Clouds <svg-icon :icon="sortDirection" class="sortingIcon" size="xxs"/>
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
            <user-row            
            v-for="(user, index) in users.users"
            ref="userRowRef"
            :key="user._id"
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
import UserRow from '~/components/list/UserRow'
import EmptyListScreen from '~/components/list/EmptyListScreen'
export default {
    components:{
        SvgIcon,
        Modal,
        UserRow,
        EmptyListScreen
    },
    // data() {
    //     return {
    //         addFiles: [],
    //     }
    // },
    props:{
        users: {
            required: true,
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
            if(action == "delete") this.$refs.userRowRef[index].deleteUser()
            if(action == "rename") this.$refs.userRowRef[index].renameUser()            
        },
        openModal(content, index){
            this.$refs.modal.openModal(content, index)
        },
    }
}
</script>

<style scoped lang="scss">
    .user-list{    
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
    .emptyUserListScreen{
        position: relative;
        width: 100%;
        height: 100%;
        text-align: center;
        padding-top: 200px;
        color: $charcoal;
        border: 1px solid var(--color-accent);

        .addUserButton{
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