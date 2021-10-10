const User = require("../users/model")

const checkUsernameFree = async (req,res,next)=>{
    try{
        const user = await User.findBy({username:req.body.username})
        if(user.length){
            res.status(401).json("username taken")
        }else{
            next()
        }
    }catch(err){
        next(err)
    }
}

module.exports = {checkUsernameFree}