'use strict';

/** @type {import('sequelize-cli').Migration} */

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Spots';
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        ownerId: 1,
        address: '3110 S 129th E Ave',
        city: 'tulsa',
        state: 'OK',
        country: 'US',
        lat: 36.1540,
        lng: 95.9928,
        name: "Friends house",
        description: "free wifi!",
        price: 150,
      },
      {
        ownerId: 2,
        address: '3111 S 129th E Ave',
        city: 'tulsa',
        state: 'OK',
        country: 'US',
        lat: 36.1541,
        lng: 95.9928,
        name: "Friends Neighbors house",
        description: "paid wifi!",
        price: 1200,
      },
      {
        ownerId: 2,
        address: '3112 S 129th E Ave',
        city: 'tulsa',
        state: 'OK',
        country: 'US',
        lat: 36.1542,
        lng: 95.9928,
        name: "Friends Other Neighbor's house",
        description: "free slow wifi!",
        price: 100,
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {}, {});
  }
};
