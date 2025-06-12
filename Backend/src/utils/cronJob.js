const cron = require("node-cron");
const {subDays, startOfDay, endOfDay} = require('date-fns');
const sendEmail = require('../utils/sendEmail');

const ConnectionRequest = require('../model/connectionRequestModel')

cron.schedule("0 7 * * *", async()=>{
  try {
    const yesterday = subDays(new Date(),1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);
  
    const pendingRequests = await ConnectionRequest.find({
      status:"interested",
      createdAt:{
        $gte:yesterdayStart,
        $lt:yesterdayEnd
      }
    }).populate("fromUserId toUserId")
  
    const listOfEmails = [
      ...new Set(pendingRequests.map(request=>request.toUserId.email))
    ]
    for(const email of listOfEmails){
     try {
      const resEmail = await sendEmail.run(
        "A new friend request from " + email,
        "there are many requests waiting for you")
        console.log(resEmail)
     } catch (error) {
      console.log(error.message)
     }
    }
  
  } catch (error) {
    console.log(error.message)
  }
})

