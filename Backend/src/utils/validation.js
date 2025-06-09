const validator = require("validator");
const validateSignUpData = (req)=>{
  const {firstName, lastName, email, password} = req.body
  
  if(!firstName || !lastName){
    throw new Error("First name and last name is required")
  }
  else if(!validator.isEmail(email)){ 
    throw new Error("Invalid email")
  }
  else if(!validator.isStrongPassword(password)){
    throw new Error("Password is not strong enough")
  }
}


const validateSignInData = (req)=>{
  const {email, password} = req.body
  if(!validator.isEmail(email)){
    throw new Error("Invalid email format")
  }else if(!validator.isStrongPassword(password)){
    throw new Error("Password is not strong enough")
  }
}

const validateProfileData = (req)=>{
  const allowedEditFields = ["firstName","lastName","about","skills","photoUrl","age"]
  const isEditAllowed = Object.keys(req.body).every((field)=> allowedEditFields.includes(field))

  if(!isEditAllowed){
    throw new Error("Edit is not allowed")
  }
  return isEditAllowed
}
module.exports = {validateSignUpData, validateSignInData,validateProfileData}