const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
  try{
  const token = req.headers.authorization.split(" ")[1];
  // console.log("token is as follows:"+token);
  const decodedToken = jwt.verify(token,"secret_this_should_be_longer");
  req.userData = {email: decodedToken.email,
      userId: decodedToken.userId,
      firstName: decodedToken.firstName,
      secondName: decodedToken.secondName,
      phone: decodedToken.phone};
  // console.log("user data is as follows:"+req.userData.email+"\n"+req.userData.userId+"\n"+req.userData.firstName+"\n"+req.secondName+"\n"+req.phone);
  next();
  }

  catch(err){
    res.status(401).json({message:" Token Authorization Failed!"})
  }
}