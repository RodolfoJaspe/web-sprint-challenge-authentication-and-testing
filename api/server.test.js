// Write your tests here
// const request = require("supertest")
const db = require("../data/dbConfig")
// const server = require("./server")
const User = require("./users/model")
const bcrypt = require("bcryptjs")

let user1 = {username: "mason", password:"1234"}
user1.password = bcrypt.hashSync(user1.password,8)

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async ()=> {
    await db.migrate.rollback()
    await db.migrate.latest()
})

beforeEach(async ()=>{
    await db("users").truncate()
})

afterAll(async ()=>{
    await db.destroy()
})

describe("users model functions", () => {
    describe("creates a user", () => {
        it("add user to bd", async () => {
            await User.createUser(user1)
            let users = await db("users")
            expect(users).toHaveLength(1)
        })
    })
})
