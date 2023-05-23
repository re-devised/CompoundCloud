const mongoose = require('mongoose')
const Joi = require('joi'); 
const consola = require('consola')
const jwt = require('jsonwebtoken')
const config = require('config');
const {Cloud} = require('./cloud')

const userSchema = new mongoose.Schema({
  username: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 50,
      unique: true
  },
  password: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 1024
  },
  createdAt: {
      type: Date,
      default: Date.now
  },
  clouds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cloud'
    }
  ],
  mainCloud: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cloud'
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
})

// userSchema.methods.generateAuthToken = function(){
//   const token = jwt.sign({_id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'))
//   return token
// }
userSchema.methods.checkCloudExists = async function(clouds){
  var isCloud = false
  for(cloud in clouds){
    // consola.info(clouds[cloud])
    await Cloud.findById(clouds[cloud], (err, doc) => {
      // consola.info(doc)
      if(doc) isCloud = true
    });
  }
  return isCloud
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
    const schema = Joi.object({
      username: Joi.string().min(3).max(50).required(),
      // email: Joi.string().min(3).max(255).email(),
      password: Joi.string().min(3).max(255).required(),
      isAdmin: Joi.boolean()
    });
  
    return schema.validate(user);
}

module.exports.User = User;
module.exports.validate = validateUser;