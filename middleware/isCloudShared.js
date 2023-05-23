export default async function ({ store, redirect }) {
    const openedClouds = await store.state.cloud.openedClouds
    const currentCloud = await store.state.cloud.currentCloud
    const user = await store.state.user.user
    var isAuthenticated = false

    for(var cloud in openedClouds){
        if(openedClouds[cloud].shared.status === false){
            // console.log(openedClouds[cloud].name + " ist nicht shared")
            if(user && user.clouds){
                for(var userCloud in user.clouds){
                    if(openedClouds[cloud]._id === user.clouds[userCloud]._id){
                        // console.log("ist die selbe id")
                        isAuthenticated = true
                        break
                    }                
                }
            }           
        }else isAuthenticated = true
        if(!isAuthenticated){            
            if(openedClouds[cloud]._id == currentCloud._id) await store.commit('cloud/setCurrentCloud', null)
            await store.commit('cloud/closeCloud', openedClouds[cloud]._id)
            return redirect('/addcloud')
        }
    }
}