const app = require("../app");
const request = require("supertest");
const { Member, MembersBook, Books, sequelize } = require("../models/");
const { hashedPassword } = require("../helpers/bcrypt");
const { createToken, checkToken } = require("../helpers/jwt");

let token = "";
let token2 = "";

beforeAll(async () => {
  let users = [
    {
      code: "M001",
      name: "Angga",
      email: "angga@mail.com",
      password: hashedPassword("secret"),
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await sequelize.queryInterface.bulkInsert("Members", users, {});

  let books = [
    {
      code: "JK-45",
      title: "Harry Potter",
      author: "J.K Rowling",
      stock: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: "SHR-1",
      title: "A Study in Scarlet",
      author: "Arthur Conan Doyle",
      stock: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: "TW-11",
      title: "Twilight",
      author: "Stephenie Meyer",
      stock: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: "HOB-83",
      title: "The Hobbit, or There and Back Again",
      author: "J.R.R. Tolkien",
      stock: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      code: "NRN-7",
      title: "The Lion, the Witch and the Wardrobe",
      author: "C.S. Lewis",
      stock: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];
  await sequelize.queryInterface.bulkInsert("Books", books, {});
});

afterAll(async () => {
  await sequelize.queryInterface.bulkDelete("Members", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
  await sequelize.queryInterface.bulkDelete("Books", null, {
    truncate: true,
    restartIdentity: true,
    cascade: true,
  });
});

// Check the book
describe("GET /books", () => {
  // Shows all existing books and quantities
  test("should response 200-OK", async () => {
    //   token = createToken({ id: user.id });
    let respon = await request(app).get("/books");
    // .set("authorization", `Bearer ${token}`);

    expect(respon.status).toBe(200);
    expect(respon.body).toBeInstanceOf(Array);
    expect(respon.body[0]).toHaveProperty("id", expect.any(Number));
    expect(respon.body[0]).toHaveProperty("code", expect.any(String));
    expect(respon.body[0]).toHaveProperty("title", expect.any(String));
    expect(respon.body[0]).toHaveProperty("author", expect.any(String));
    expect(respon.body[0]).toHaveProperty("stock", expect.any(Number));
  });

  // // tanpa token
  // test("should response 401-Unauthorized", async () => {
  //   let respon = await request(app).get("/books");

  //   expect(respon.status).toBe(401);
  //   expect(respon.body).toBeInstanceOf(Object);
  //   expect(respon.body).toHaveProperty("message", "Invalid Token");
  // });

  // // token salah
  // test("should response 401-Invalid Token", async () => {
  //   let respon = await request(app)
  //     .get("/books")
  //     .set("authorization", `Bearer ${token}-salah`);

  //   expect(respon.status).toBe(401);
  //   expect(respon.body).toBeInstanceOf(Object);
  //   expect(respon.body).toHaveProperty("message", "Invalid Token");
  // });
});

// Members can borrow books with conditions
describe("POST /membersBooks/:BookId", () => {
  test("should response 200-OK", async () => {
    let user = await Member.create({
      code: "M003",
      name: "Nan",
      email: "nan@mail.com",
      password: hashedPassword("secret"),
    });
    // token = createToken({ id: user.id });
    let respon = await request(app)
      .post("/membersBooks/" + 1)
      .send({ MemberId: user.id });
    // .set("authorization", `Bearer ${token}`);

    let book = await Books.findByPk(1);

    expect(respon.status).toBe(200);
    expect(respon.body).toBeInstanceOf(Object);
    expect(respon.body).toHaveProperty(
      "message",
      `Successfully borrowed a book ${book.title}`
    );
  });

  // buku tidak ditemukan
  test("should response 404-Not Found", async () => {
    let user = await Member.findOne({ where: { email: "nan@mail.com" } });
    let respon = await request(app)
      .post("/membersBooks/" + 1000)
      .send({ MemberId: user.id });
    // .set("authorization", `Bearer ${token}`);

    expect(respon.status).toBe(404);
    expect(respon.body).toBeInstanceOf(Object);
    expect(respon.body).toHaveProperty(
      "message",
      "Book with id 1000 not found"
    );
  });

  // // tanpa token
  // test("should response 401-Unauthorized", async () => {
  //   let respon = await request(app).post("/membersBooks/" + 2);

  //   expect(respon.status).toBe(401);
  //   expect(respon.body).toBeInstanceOf(Object);
  //   expect(respon.body).toHaveProperty("message", "Invalid Token");
  // });

  // Borrowed books are not borrowed by other members
  test("should response 403-Forbidden", async () => {
    let user = await Member.create({
      code: "M004",
      name: "Ferry",
      email: "ferry@mail.com",
      password: hashedPassword("secret"),
    });
    token2 = createToken({ id: user.id });
    let respon = await request(app)
      .post("/membersBooks/" + 1)
      .send({ MemberId: user.id });
    // .set("authorization", `Bearer ${token2}`);

    expect(respon.status).toBe(403);
    expect(respon.body).toBeInstanceOf(Object);
    expect(respon.body).toHaveProperty("message", "Book has been borrowed");
  });

  // Members may not borrow more than 2 books
  test("should response 403-OK", async () => {
    let user = await Member.findOne({ where: { email: "nan@mail.com" } });
    await request(app)
      .post("/membersBooks/" + 2)
      .send({ MemberId: user.id });
    // .set("authorization", `Bearer ${token}`);

    let respon = await request(app)
      .post("/membersBooks/" + 3)
      .send({ MemberId: user.id });
    // .set("authorization", `Bearer ${token}`);

    expect(respon.status).toBe(403);
    expect(respon.body).toBeInstanceOf(Object);
    expect(respon.body).toHaveProperty(
      "message",
      "Members may not borrow more than 2 books"
    );
  });

  // Member is currently being penalized. Member with penalty cannot able to borrow the book for 3 days
  test("should response 403-OK", async () => {
    let user = await MembersBook.create({
      MemberId: checkToken(token2).id,
      BookId: 4,
      status: "penalized",
    });

    let respon = await request(app)
      .post("/membersBooks/" + 3)
      .send({ MemberId: user.MemberId });
    // .set("authorization", `Bearer ${token2}`);

    expect(respon.status).toBe(403);
    expect(respon.body).toBeInstanceOf(Object);
    expect(respon.body).toHaveProperty(
      "message",
      "Member is currently being penalized. Member with penalty cannot able to borrow the book for 3 days."
    );
  });

  // // token salah
  // test("should response 401-Unauthorized", async () => {
  //   let respon = await request(app)
  //     .post("/membersBooks/" + 2)
  //     .set("authorization", `Bearer ${token}-salah`);

  //   expect(respon.status).toBe(401);
  //   expect(respon.body).toBeInstanceOf(Object);
  //   expect(respon.body).toHaveProperty("message", "Invalid Token");
  // });
});

describe("GET /membersBooks", () => {
  test("should response 200-OK", async () => {
    let user = await Member.create({
      code: "M004",
      name: "Pupy",
      email: "pupy@mail.com",
      password: hashedPassword("secret"),
    });
    token = createToken({ id: user.id });
    let respon = await request(app)
      .get("/membersBooks")
      .set("authorization", `Bearer ${token}`);

    expect(respon.status).toBe(200);
    expect(respon.body).toBeInstanceOf(Array);
    expect(respon.body[0]).toHaveProperty("id", expect.any(Number));
    expect(respon.body[0]).toHaveProperty("MemberId", expect.any(Number));
    expect(respon.body[0]).toHaveProperty("BookId", expect.any(Number));
  });

  // // tanpa token
  // test("should response 401-Invalid token", async () => {
  //   let respon = await request(app).get("/membersBooks");

  //   expect(respon.status).toBe(401);
  //   expect(respon.body).toBeInstanceOf(Object);
  //   expect(respon.body).toHaveProperty("message", "Invalid Token");
  // });

  // // token salah
  // test("should response 401-Invalid token", async () => {
  //   let respon = await request(app)
  //     .get("/membersBooks")
  //     .set("authorization", `Bearer ${token}-salah`);

  //   expect(respon.status).toBe(401);
  //   expect(respon.body).toBeInstanceOf(Object);
  //   expect(respon.body).toHaveProperty("message", "Invalid Token");
  // });
});

// Member returns the book with conditions
describe("PATCH /membersBooks/:BookId", () => {
  test("should response 200-OK", async () => {
    let user = await Member.findOne({ where: { email: "nan@mail.com" } });
    // token = createToken({ id: user.id });

    let respon = await request(app)
      .patch("/membersBooks/" + 1)
      .send({ MemberId: user.id });
    // .set("authorization", `Bearer ${token}`);

    let book = await Books.findByPk(1);

    expect(respon.status).toBe(200);
    expect(respon.body).toBeInstanceOf(Object);
    expect(respon.body).toHaveProperty(
      "message",
      `${book.title} in status returned!`
    );
  });

  // book not found
  test("should response 404-Not Found", async () => {
    let user = await Member.findOne({ where: { email: "nan@mail.com" } });
    let respon = await request(app)
      .patch("/membersBooks/" + 1000)
      .send({ MemberId: user.id });
    // .set("authorization", `Bearer ${token}`);

    expect(respon.status).toBe(404);
    expect(respon.body).toBeInstanceOf(Object);
    expect(respon.body).toHaveProperty(
      "message",
      `Book with id 1000 not found`
    );
  });

  // The returned book is a book that the member has borrowed
  test("should response 404-Not Found", async () => {
    let user = await Member.create({
      code: "M002",
      name: "Putri",
      email: "putri@mail.com",
      password: hashedPassword("secret"),
    });
    // let tokenUser = createToken({ id: user.id });

    let respon = await request(app)
      .patch("/membersBooks/" + 2)
      .send({ MemberId: user.id });
    // .set("authorization", `Bearer ${tokenUser}`);

    expect(respon.status).toBe(404);
    expect(respon.body).toBeInstanceOf(Object);
    expect(respon.body).toHaveProperty(
      "message",
      "The returned book is a book that the member has borrowed"
    );
  });

  // If the book is returned after more than 7 days, the member will be subject to a penalty
  test("should response 200-OK pinalty", async () => {
    let user = await Member.findOne({ where: { email: "nan@mail.com" } });
    let date = new Date(new Date().setDate(new Date().getDate() - 8));
    await MembersBook.update(
      { createdAt: date },
      { where: { MemberId: user.id, BookId: 2 } }
    );

    let book = await Books.findByPk(2);

    let respon = await request(app)
      .patch("/membersBooks/" + 2)
      .send({ MemberId: user.id });
    // .set("authorization", `Bearer ${token}`);

    expect(respon.status).toBe(200);
    expect(respon.body).toBeInstanceOf(Object);
    expect(respon.body).toHaveProperty(
      "message",
      `${book.title} in status penalized!`
    );
  });
});
