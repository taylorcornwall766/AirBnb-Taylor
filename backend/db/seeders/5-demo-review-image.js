'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'ReviewImages';
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        reviewId: 1,
        url: 'image.jpg'
      },
      {
        reviewId: 2,
        url: 'image.jpg'
      },
      {
        reviewId: 2,
        url: 'image.jpg'
      },
      {
        reviewId: 2,
        url: 'image.jpg'
      },
      {
        reviewId: 3,
        url: 'image.jpg'
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      reviewId:{[Op.in]: [1,2,3]}
    }, {});
  }
};
