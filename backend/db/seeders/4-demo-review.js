'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Reviews';
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        userId: 2,
        review:'it was ok',
        stars: 3,
      },
      {
        spotId: 1,
        userId: 3,
        review:'it was great',
        stars: 5,
      },
      {
        spotId: 2,
        userId: 3,
        review:'it was awful',
        stars: 1,
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId:{[Op.in]: [1,2]}
    }, {});
  }
};
