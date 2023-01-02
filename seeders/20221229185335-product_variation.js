'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("product_variation", [
      {
        product_variation_name: "size",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        product_variation_name: "color",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },


  async down (queryInterface, Sequelize) {
   
     await queryInterface.bulkDelete("product_variation", null, {});
     
  }
};
