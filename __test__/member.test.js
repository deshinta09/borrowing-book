const request = require("supertest");
const { Member, MembersBook, Books, sequelize } = require("../models/");
const { hashedPassword } = require("../helpers/bcrypt");
const app = require("../app");
const { createToken } = require("../helpers/jwt");

let token = "";

beforeAll(async () => {
  let users = [
    {
      code: "M005",
      name: "Piu",
      email: "piu@mail.com",
      password: hashedPassword("secret"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await sequelize.queryInterface.bulkInsert("Members", users, {});
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Members", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

// describe("POST /login", () => {
//   test("should response 200-OK", async () => {
//     let user = {
//       email: "piu@mail.com",
//       password: "secret",
//     };

//     let respon = await request(app).post("/login").send(user);
//     expect(respon.status).toBe(200);
//     expect(respon.body).toBeInstanceOf(Object);
//     expect(respon.body).toHaveProperty("access_token", expect.any(String));
//   });

//   // email salah
//   test("should response 400-Bad Request", async () => {
//     let user = {
//       email: "salah@mail.com",
//       password: "secret",
//     };

//     let respon = await request(app).post("/login").send(user);
//     expect(respon.status).toBe(400);
//     expect(respon.body).toBeInstanceOf(Object);
//     expect(respon.body).toHaveProperty("message", "Invalid email/password");
//   });

//   // password salah
//   test("should response 400-Bad Request", async () => {
//     let user = {
//       email: "piu@mail.com",
//       password: "salah",
//     };

//     let respon = await request(app).post("/login").send(user);

//     expect(respon.status).toBe(400);
//     expect(respon.body).toBeInstanceOf(Object);
//     expect(respon.body).toHaveProperty("message", "Invalid email/password");
//   });
// });

// Member check
describe("GET /members", () => {
  // Shows all existing members
  test("should respon 200-OK", async () => {
    let user = await Member.findOne({ where: { email: "piu@mail.com" } });
    // token = createToken({ id: user.id });
    let respon = await request(app).get("/members").send({ MemberId: user.id });
    // .set("authorization", `Bearer ${token}`);

    expect(respon.status).toBe(200);
    expect(respon.body).toBeInstanceOf(Array);
    expect(respon.body[0]).toHaveProperty("id", expect.any(Number));
    expect(respon.body[0]).toHaveProperty("name", expect.any(String));
    expect(respon.body[0]).toHaveProperty("email", expect.any(String));
    // The number of books being borrowed by each member
    expect(respon.body[0]).toHaveProperty("amount", expect.any(Number));
  });

  // // tanpa token
  // test("should respon 200-OK", async () => {
  //   let respon = await request(app).get("/members");

  //   expect(respon.status).toBe(401);
  //   expect(respon.body).toBeInstanceOf(Object);
  //   expect(respon.body).toHaveProperty("message", "Invalid Token");
  // });
});
