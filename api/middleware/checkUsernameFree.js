const User = require("../users/model")

const checkUsernameFree = async (req,res,next)=>{
    try{
        const user = await User.findBy({username:req.body.username})
        if(!user){
            next()
        }else{
            res.status(401).json("username taken")
        }
    }catch(err){
        next(err)
    }
}

module.exports = {checkUsernameFree}