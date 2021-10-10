// Write your tests here
const request = require("supertest")
const db = require("../data/dbConfig")
const server = require("./server")
const User = require("./users/model")
const bcrypt = require("bcryptjs")

let user1 = {username: "bruno", password:"1234"}
let user2 = {username: "", password:"1234"}
let user3 = {username: "paul", password:"1234"}

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
describe("register endpoint", () => {
    it("requires username and password", async () => {
        const user = await request(server).post(`/api/auth/register`).send(user2)
        expect(user.body.message).toBe("username and password required")
    })
    it("registers an user", async () => {
        const user = await request(server).post(`/api/auth/register`).send(user1)
        const validCred = bcrypt.compareSync(user1.password, user.body.password)
        expect(validCred).toBeTruthy()
    })
})
