export const state = () => {
    return {
        diskSpace : {},
        uploadPath: ""
    }
}

export const actions = {
    getDiskSpace({commit, state}) {
        return this.$axios.$get(`api/diskspace`)
            .then(diskSpace => {
                commit('setDiskSpace', diskSpace)
                return state.diskSpace
            })
            .catch(error => Promise.reject(error))
    },
    resolveUploadPath({commit, state}, pathInput = "uploads") {
        if(pathInput.length == 0) pathInput = "uploads"
        return this.$axios.$post('api/diskspace/uploadpath', {pathInput: pathInput})
            .then(uploadPath => {
                commit('setUploadPath', uploadPath)
                return state.uploadPath
            })
            .catch(error => Promise.reject(error))
    }
}

export const mutations = {
    setDiskSpace(state, diskSpace){
        state.diskSpace = diskSpace
    },
    setUploadPath(state, uploadPath){
        state.uploadPath = uploadPath
    }
}