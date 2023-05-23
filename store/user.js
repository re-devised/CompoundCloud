const consola = require('consola')

export const state = () => {
    return {
        user: null,
        allUsers: {
            users: [],
            count: 0
        }
    }
}

export const getters = {
    authUser(state){
        return state.user || null
    },
    isAuthenticated(state){
        return !!state.user
    },
    isAdmin(state){
        return state.user && state.user.role && state.user.role === 'admin'
    },
}

export const actions = {
    fetchUsers({commit, state}) {
        return this.$axios.$get(`api/user/admin`)
            .then(users => {
                commit('setUsers', users)
                return state.allUsers
            })
            .catch(error => Promise.reject(error))
    },
    login({commit, dispatch, state}, loginData){
        return this.$axios.$post('api/user/login', loginData)
            .then(async (authUser) => {
                commit('setAuthUser', authUser)

                var userClouds = [...authUser.clouds]
                userClouds.unshift(authUser.mainCloud)
                await dispatch('cloud/openClouds', userClouds, {root:true})

                return state.user
            })
            .catch(error => Promise.reject(error))
    },
    logout({commit, state, rootState}){
        return this.$axios.$get('api/user/logout')
            .then(() => {                
                const clouds = state.user.clouds
                commit('cloud/closeUserClouds', clouds, {root:true})
                commit('setAuthUser', null)

                const openedClouds = rootState.cloud.openedClouds
                if(openedClouds.length > 0){
                    commit('cloud/setCurrentCloud', openedClouds[0], {root:true})
                    return true
                }else{
                    commit('cloud/setCurrentCloud', null, {root:true})
                    return false
                }
            })
            .catch(error => Promise.reject(error))
    },
    register({commit}, registerData){
        return this.$axios.$post('/api/user', registerData)
            .catch(error => {
                let errorMessage = 'Registration failed'
                if(error.response.data){
                    errorMessage = error.response.data
                }
                return Promise.reject(errorMessage)
            })
            .then(user => {
                commit('addUserToUsers', user)
                return Promise.resolve()
            })
    },
    openCloudForUser({commit, state}, checkedCloud){
        if(state.user){
            var userClouds = state.user.clouds
            var userCloudIsOpen = false
            for(var userCloud in userClouds){
                if(checkedCloud._id == userClouds[userCloud]._id) userCloudIsOpen = true
            }
            if(!userCloudIsOpen){
                return this.$axios.$put(`/api/user/${state.user._id}/opencloud`, {"cloud" : checkedCloud})
                    .catch(error => {
                        var errorMessage = `An error occurred. Cloud ${checkedCloud._id} could not be opened`
                        if(error.response.data){
                            errorMessage = error.response.data
                        }
                        return Promise.reject(errorMessage)
                    })    
                    .then(openedCloud => {
                        commit('openCloudForUser', openedCloud)
                        return state.user
                    })
            }else return Promise.resolve()               
        }else return Promise.resolve()
    },
    closeCloudForUser({commit, state, rootState}, [userId, cloudId]){
        return this.$axios.$delete(`/api/user/${userId}/closecloud/${cloudId}`)
            .then(async () => {
                var openedClouds = rootState.cloud.openedClouds
                commit('closeCloudForUser', [cloudId, openedClouds])
                return Promise.resolve()
            })
            .catch(error => {
                let errorMessage = `An error occurred. Cloud ${cloud} could not be closed`
                if(error.response.data){
                    errorMessage = error.response.data
                }

                return Promise.reject(errorMessage)
            })
    },
    // deleteCloudForUser({commit, state}, [userId, cloud]){
    //     return this.$axios.$delete(`/api/user/${userId}/deletecloud/${cloud}`)
    //     .then(user => {
    //         commit('closeCloudForUser', [cloud, user])
    //         return Promise.resolve(state.user)
    //     })
    //     .catch(error => {
    //         let errorMessage = `Etwas ist schiefgelaufen. Cloud ${cloud} konnte nicht gelöscht werden`
    //         if(error.response.data){
    //             errorMessage = error.response.data
    //         }

    //         return Promise.reject(errorMessage)
    //     })
    // },
    getAuthUser({commit, dispatch, getters, state}){
        return this.$axios.$post('/api/user/me')
            .then(async (authUser) => {
                commit('setAuthUser', authUser)

                var userClouds = authUser.clouds
                userClouds.unshift(authUser.mainCloud)
                await dispatch('cloud/openClouds', userClouds, {root:true})

                return state.user
            })
            .catch((error) => {
                commit('setAuthUser', null)
                return null
            })
    },
    deleteUser({commit, state, dispatch}, userId){ 
        return this.$axios.$delete(`/api/user/${userId}`)
            .then(async () => {
                commit('deleteUser', userId)
                if(state.user && state.user._id == userId){
                    await dispatch('logout')
                    return false
                }
                return true                
            })
            .catch(error => Promise.reject(error))
    },
    renameUser({commit, state, dispatch}, [userId, name]){
        return this.$axios.$put(`/api/user/${userId}/rename`, {'name' : name})
            .then(user => {
                commit('putUser', user)
                if(state.user && state.user._id == user._id){
                    dispatch('logout') //WENN DER ABGEMELDET WIRD MÜSSEN NOCH ALLE CLOUDS GESCHLOSSEN WERDEN
                }
                return true
            })
            .catch(error => Promise.reject(error))
    },
}

export const mutations = {
    setAuthUser(state, user){
        return state.user = user
    },
    setUsers(state, users){
        return state.allUsers = users
    },
    addUserToUsers(state, user){
        state.allUsers.count++
        state.allUsers.users.push(user)
    },
    logoutUser(state){
        return state.user = null
    },
    openCloudForUser(state, cloud){
        return state.user.clouds.push(cloud)
    },
    closeCloudForUser(state, [cloudId, openedClouds]){
        const cloudIndex = state.user.clouds.findIndex(c => c._id == cloudId)
        if(cloudIndex != -1){
            state.user.clouds.splice(cloudIndex, 1)
        }
        const openedCloudIndex = openedClouds.findIndex(c => c._id == cloudId)
        if(openedCloudIndex != -1){
            openedClouds.splice(openedCloudIndex, 1)        
        }
        // const users = state.allUsers
        // const allCloudUserIndex = users.users.findIndex(c => c._id == user._id)
        // const allCloudIndex = users.users[allCloudUserIndex].clouds.findIndex(c => c._id == cloud)

        // if(allCloudIndex != -1){
        //     state.allUsers.users[allCloudUserIndex].clouds.splice(allCloudIndex, 1)
        // }
    },
    deleteUser(state, user){
        const users = state.allUsers
        const userIndex = users.users.findIndex(c => c._id == user)
        users.users.splice(userIndex, 1)
        users.count--
    },
    putUser(state, user){
        const users = state.allUsers
        const userIndex = users.users.findIndex(c => c._id == user._id)
        users.users[userIndex] = user
    }
}
