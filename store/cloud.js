import Consola from 'consola'


export const state = () => {
    return {
        allClouds: {
            clouds: [],
            count: 0
        },
        openedClouds: [],
        currentCloud: null
    }
}

export const actions = {
    fetchClouds({commit, state}) {
        return this.$axios.$get(`api/cloud/admin`)
            .then(clouds => {
                commit('setClouds', clouds)
                return state.allClouds
            })
            .catch(error => Promise.reject(error))
    },
    createCloud({commit, state}, data) {
        return this.$axios.$post('/api/cloud', data)
            .then(cloud => {           
                return cloud
            })
            .catch(error => Promise.reject(error))
    },
    getCloudById(_, cloudId) {
        return this.$axios.$get(`api/cloud/${cloudId}`)
            .then(cloud => {
                return cloud
            })
            .catch(error => Promise.reject(error))
    },
    checkCloudExists(_, clouds) {
        return this.$axios.$post('/api/cloud/check', {'clouds' : clouds})
            .then(clouds => {
                return clouds
            })
            .catch(error => console.log(error))
    },
    renameCloud({commit, state}, [cloud, name]){
        return this.$axios.$put(`/api/cloud/${cloud}/rename`, {'name' : name})
            .then(cloud => {
                commit('putCloud', cloud)
                return true
            })
            .catch(error => {
                let errorMessage = `An error occurred. Cloud ${cloud} could not be renamed`
                if(error.response.data){
                    errorMessage = error.response.data
                }

                return Promise.reject(errorMessage)
            })
    },
    changeCloudDescription({commit, state}, [cloudId, descriptionHTML]){
        return this.$axios.$put(`/api/cloud/${cloudId}/changeclouddescription`, {'description' : descriptionHTML})
            .then(cloud => {
                commit('putCloud', cloud)
                return true
            })
            .catch(error => {
                let errorMessage = `An error occurred. Cloud ${cloud} could not be changed`
                if(error.response.data){
                    errorMessage = error.response.data
                }

                return Promise.reject(errorMessage)
            })
    },
    deleteCloud({commit, state}, cloud){
        return this.$axios.$delete(`/api/cloud/${cloud}`)
            .then(_id => {
                commit('closeCloud', cloud)
                return true
            })
            .catch(error => {
                Consola.info(error)
                Promise.reject(error)
            })
    },
    async openClouds({commit, dispatch, state, rootState}, checkedClouds){
        for(var checkedCloud in checkedClouds){
            var cloudIsOpen = false
            for(var cloud in state.openedClouds){
                if(state.openedClouds[cloud]._id == checkedClouds[checkedCloud]._id) cloudIsOpen = true
            }
            if(!cloudIsOpen){
                if(
                    checkedClouds[checkedCloud].shared.status == true && rootState.user.user != null ||

                    checkedClouds[checkedCloud].shared.status == false && 
                    checkedClouds[checkedCloud].creator &&
                    (checkedClouds[checkedCloud].creator == rootState.user.user._id ||
                    checkedClouds[checkedCloud].creator._id == rootState.user.user._id)
                ){
                    await dispatch('user/openCloudForUser', checkedClouds[checkedCloud], {root:true})
                        .catch(error => {return Promise.reject(error)})
                    commit('openCloud', checkedClouds[checkedCloud])    
                }else if(checkedClouds[checkedCloud].shared.status == true){
                    commit('openCloud', checkedClouds[checkedCloud])    
                }                              
            } 
        }            
        commit('setCurrentCloud', checkedClouds[0])
    }
}

export const mutations = {
    setClouds(state, clouds){
        state.allClouds = clouds
    },
    openCloud(state, cloud){
        state.openedClouds.push(cloud)
    },
    closeCloud(state, cloudId){
        const openedCloudIndex = state.openedClouds.findIndex(c => c._id == cloudId)
        const cloudIndex = state.allClouds.clouds.findIndex(c => c._id == cloudId)
       
        if(openedCloudIndex != -1){
            state.openedClouds.splice(openedCloudIndex, 1)        
        }
        if(cloudIndex != -1){
            state.allClouds.clouds.splice(cloudIndex, 1)
            if(state.allClouds.count !== 0) state.allClouds.count--
        } 
    },
    closeUserClouds(state, clouds){
        for(var cloud in clouds){
            const cloudIndex = state.openedClouds.findIndex(c => c._id == clouds[cloud]._id)
            state.openedClouds.splice(cloudIndex, 1)
        }
    },
    setCurrentCloud(state, cloud){
        state.currentCloud = cloud
    },
    putCloud(state, cloud){
        const openedCloudIndex = state.openedClouds.findIndex(c => c._id == cloud._id)
        const cloudIndex = state.allClouds.clouds.findIndex(c => c._id == cloud._id)

        if(openedCloudIndex != -1) state.openedClouds[openedCloudIndex] = cloud
        if(cloudIndex != -1) state.allClouds.clouds[cloudIndex] = cloud
        if(state.currentCloud._id == cloud._id) state.currentCloud = cloud
    },
    pushCloudAllClouds(state, cloud){
        state.allClouds.clouds.push(cloud)
        state.allClouds.count++
    }
}