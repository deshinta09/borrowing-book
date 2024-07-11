"use strict";

const { hashedPassword } = require("../helpers/bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert(
      "Members",
      [
        {
          code: "M001",
          name: "Angga",
          email: "angga@mail.com",
          password: hashedPassword("secret"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "M002",
          name: "Ferry",
          email: "ferry@mail.com",
          password: hashedPassword("secret"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          code: "M003",
          name: "Putri",
          email: "putri@mail.com",
          password: hashedPassword("secret"),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("Members", null, {});
  },
};
