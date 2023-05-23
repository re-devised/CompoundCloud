export const actions = {
    async nuxtServerInit({commit, dispatch}){
        await dispatch('user/getAuthUser').catch(err => console.log(err)) //LOGGING IN USER WITH SESSION
    }
}
