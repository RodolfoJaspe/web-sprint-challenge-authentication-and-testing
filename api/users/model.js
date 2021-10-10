const db = require("../../data/dbConfig")

function findBy(filter) {
    return db("users").where(filter)
}

async function createUser (user) {
    const [id] = await db("users").insert(user)
    return db("users").where({id}).first()
}

module.exports = {findBy,createUser}