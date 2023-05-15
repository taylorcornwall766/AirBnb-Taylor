'use strict';

/** @type {import('sequelize-cli').Migration} */
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'SpotImages';
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert(options, [
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-804804520397374197/original/123701d8-33a3-42cb-b2ac-f5df79e61d4b.jpeg?im_w=720',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-804804520397374197/original/8f133849-3cdb-41fe-8331-5752e8521963.jpeg?im_w=720',
        preview: false,
      },
      {
        spotId: 1,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-804804520397374197/original/61aadac4-6c63-4ff0-8c8f-3b34a8740e0c.jpeg?im_w=720',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-635507702363038238/original/bedf684f-1955-4873-a12c-aecac1ac1683.jpeg?im_w=720',
        preview: true,
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-635507702363038238/original/509ed099-1a54-4d5f-a7b9-2ae4e894a693.jpeg?im_w=720',
        preview: false,
      },
      {
        spotId: 2,
        url: 'https://a0.muscache.com/im/pictures/miso/Hosting-635507702363038238/original/fb858617-a89f-41b8-a0fd-ed46ca5f121b.jpeg?im_w=720',
        preview: true,
      },
      {
        spotId: 3,
        url: 'https://a0.muscache.com/im/pictures/a33dc9e4-bcac-4431-9f17-9825b594ac5e.jpg?im_w=720',
        preview: true,
      },
    ])
  },

  async down (queryInterface, Sequelize) {
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId:{[Op.in]: [1,2,3,4,5]}
    }, {});
  }
};
