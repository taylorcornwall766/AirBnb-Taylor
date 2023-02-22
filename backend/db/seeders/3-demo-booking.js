'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Bookings';
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 3,
        startDate: '2023-02-22',
        endDate: '2022-02-24',
      },
      {
        spotId: 1,
        userId: 2,
        startDate: '2023-02-25',
        endDate: '2022-02-26',
      },
      {
        spotId: 2,
        userId: 3,
        startDate: '2023-02-22',
        endDate: '2022-02-24',
      },
    ])
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      city: 'tulsa'
    }, {});
  }
};
