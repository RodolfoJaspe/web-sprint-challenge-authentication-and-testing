const router = require('express').Router();
const User = require("../users/model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const JWT_SECRET = process.env.JWT_SECRET || "shh"
const { checkUsernameFree } = require('../middleware/checkUsernameFree');
const checkPayload = require('../middleware/checkPayload');


function buildToken(user){ 
    const payload = {
        subject : user.user_id,
        username : user.username,
        role_name : user.role_name
    }
    const options = {
        expiresIn : "1d"
    }

    return jwt.sign(payload,JWT_SECRET,options)
}

router.post('/register', checkPayload, checkUsernameFree,  (req, res, next) => {
    let user = req.body
    const hash = bcrypt.hashSync(user.password,8)
    user.password = hash

    User.createUser(user)
        .then(user => {
            res.status(201).json(user)
        })
        .catch(next)

  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

    3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */
});

router.post('/login', checkPayload, (req, res, next) => {

    let {username, password} = req.body;

    User.findBy({username})
        .then(([user]) => {
            if(user && bcrypt.compareSync(password, user.password)){
                const token = buildToken(user)
                res.status(200).json({
                    message: `Welcome, ${user.username}`,
                    token
                })
            } else {
                res.status(401).json({message: "invalid credentials"})
            }
        })
        .catch(next)
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */
});

module.exports = router;
