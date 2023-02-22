'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'spotImages';
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'image1.jpg',
        preview: false,
      },
      {
        spotId: 1,
        url: 'image2.jpg',
        preview: false,
      },
      {
        spotId: 1,
        url: 'image3.jpg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'image4.jpg',
        preview: true,
      },
      {
        spotId: 2,
        url: 'image5.jpg',
        preview: false,
      },
      {
        spotId: 2,
        url: 'image6.jpg',
        preview: true,
      },
      {
        spotId: 3,
        url: 'image7.jpg',
        preview: true,
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId:{[Op.in]: [1,2,3]}
    }, {});
  }
};
