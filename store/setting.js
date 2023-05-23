import Consola from 'consola'

export const state = () => {
    return {
        adminSettings: {
            isSetupMode: false,
            adminsOnlyUserCreationMode: true,
            storagePath: ""
        },
        isDocker: false
    }
}

export const actions = {
    fetchAdminSettings({commit, state}) {        
        return this.$axios.$get(`api/setting/admin`)
            .then(settings => {
                    commit('setAdminSettings', settings)
                    return Promise.resolve(state.adminSettings)
                })
                .catch(error => Promise.reject(error))
    },
    checkIsDocker({commit, state}) {
        return this.$axios.$get(`api/setting/docker`)
            .then(isDocker => {
                commit('setDockerSetting', isDocker)
                return Promise.resolve(state.isDocker)
            })
            .catch(error => Promise.reject(error))
    },
    disableIsSetupMode({commit, state}){
        return this.$axios.$post(`api/setting/disablesetupmode`)
            .then(setting => {
                let adminSettings = Object.assign({}, state.adminSettings)
                adminSettings['isSetupMode'] = false
                commit('setAdminSettings', adminSettings)
                return Promise.resolve(state.adminSettings.isSetupMode)
            })
            .catch(error => Promise.reject(error))
    },
    setUserCreationMode({commit, state}, value){
        // true means only admins can create users; false means everyone can create users
        return this.$axios.$post(`api/setting/usercreationmode`, {value: value})
            .then(setting => {
                let adminSettings = Object.assign({}, state.adminSettings)
                adminSettings['adminsOnlyUserCreationMode'] = value
                commit('setAdminSettings', adminSettings)
                return Promise.resolve(state.adminSettings.adminsOnlyUserCreationMode)
            })
            .catch(error => Promise.reject(error))
    },
    changeStoragePath({commit, state}, pathInput){
        return this.$axios.$post(`api/setting/changestoragepath`, {pathInput: pathInput})
            .then(setting => {
                let adminSettings = Object.assign({}, state.adminSettings)
                adminSettings['storagePath'] = pathInput
                commit('setAdminSettings', adminSettings)
                return Promise.resolve(state.adminSettings.storagePath)
            })
            .catch(error => Promise.reject(error))
    }

}

export const mutations = {
    setAdminSettings(state, settings){
        state.adminSettings = settings
    },
    setStoragePath(state, storagePath){
        state.adminSettings.storagePath = storagePath
    },
    setDockerSetting(state, isDocker){
        state.isDocker = isDocker
    }
}