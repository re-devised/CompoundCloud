const {Cloud} = require('../../models/cloud')
const consola = require('consola')


module.exports = async function(user, res) {

    if(!user.mainCloud){
        const cloud = new Cloud({
            creator: user._id,
            name: user.username,
            isMain: true
        })       
        await cloud.save()
            .then(result => {
                return user.mainCloud = result._id
            })
            .catch(err => consola.error(err))
    }
    
    return user.mainCloud
}

