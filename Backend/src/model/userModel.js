const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')


const userSchema = new mongoose.Schema({
  firstName:{
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 20
  },
  lastName:{
    type: String
  },
  email:{
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid email")
      }
    }
  },
  password: {
    type: String,
    required: true,
    validator(value){
      if(validator.isStrongPassword(value)){
        throw new Error("Password is not strong enough")
      }
    }
  },
  age:{
    type: Number,
    min:18
  },
  gender: {
    type: String,
    validate(value){
      if(!['male','female','other'].includes(value)){
        throw new Error("Invalid gender")
      }
    }
  },
  photoUrl: {
    type: String,
    default: "https://avatars.githubusercontent.com/u/22686351?v=4",
    validator(value){
      if(!validator.isURL(value)){
        throw new Error("Invalid URL")
      }
    }
  },
  about:{
    type: String,
    default: "This user has no bio yet"
  },
  skills:{
    type:[String],
    validate(value){
      if(value.length > 5){
        throw new Error("User can only have 5 skills")
      }
    }
  }
},{timestamps: true});

userSchema.methods.getJWT = function(){
  const user= this
  const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:'1d'})
  return token;
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
  const user= this
  const isPasswordMatch = await bcrypt.compare(passwordInputByUser, user.password)
  return isPasswordMatch;
}

userSchema.pre('save', async function(next){
  const user = this;
  if(user.isModified('password')){
    user.password = await bcrypt.hash(user.password, 8)
  }
  next()
})
module.exports  =  mongoose.model('User', userSchema);
