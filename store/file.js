export const state = () => {
    return {
        items: {
            files: [],
            count: 0
        }
    }
}

export const actions = {
    fetchFiles({commit, state}, folder) {
        return this.$axios.$get(`api/file/${folder}`)
            .then(files => {
                commit('resetFiles')
                commit('setFiles', files)
                return state.items
            })
            .catch(error => {
                let errorMessage = 'Files could not be loaded'
                if(error.response.data.errors){
                    errorMessage = error.response.data.errors.message
                }
                return Promise.reject(errorMessage)
            })
    },
    deleteFile({commit, state}, [cloud, id]) {
        return this.$axios.$delete(`api/file/${cloud}/${id}`)
            .then(_ => {
                const index = state.items.files.findIndex((b) => b._id == id)
                commit('deleteFile', index)
                return state.items
            })
            .catch(error => {
                let errorMessage = 'Something went wrong, try again'
                if(error.response.data.errors){
                    errorMessage = error.response.data.errors.message
                }
                return Promise.reject(errorMessage)
            })
    },
    addFile({commit, state}, [cloud, fileData]){
        return this.$axios.$post(`/api/file/${cloud}`, fileData)
            .then(file => {
                commit('addFile', file)
                return state.items
            })
            .catch(error => {
                let errorMessage = 'Something went wrong, try again'
                if(error.response.data.errors){
                    errorMessage = error.response.data.errors.message
                }
                return Promise.reject(errorMessage)
            })
    },
    renameFile({commit, state}, [cloud, fileId, fileName]){
        return this.$axios.$put(`/api/file/${cloud}/${fileId}`, {'fileName' : fileName})
            .then(file => {
                const index = state.items.files.findIndex((b) => b._id == fileId)
                commit('putFile', [file, index])
                return state.items
            })
            .catch(error => {
                let errorMessage = 'Something went wrong, try again'
                if(error.response.data.errors){
                    errorMessage = error.response.data.errors.message
                }
                return Promise.reject(errorMessage)
            })
    }
    
    // fetchCourseBySlug({state, commit}, slug){
    //     return this.$axios.$get(`api/v1/products/s/${slug}`)
    //         .then(course => {
    //             commit('setCourse', course)
    //             return state.course
    //         })
    //         .catch(error => Promise.reject(error))
    // }
}

export const mutations = {
    resetFiles(state){
        state.items = null
    },
    setFiles(state, files){
        state.items = files
    },
    deleteFile(state, index){
        state.items.count--
        state.items.files.splice(index, 1)
    },
    addFile(state, file){
        state.items.count++
        state.items.files.push(file)
    },
    putFile(state, [file, index]){
        state.items.files[index] = file
    }
}