'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        onDelete
      },
      spotId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'Spots'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references:{
          model: 'Users'
        }
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      }
    });
    await queryInterface.addIndex('Bookings', ['startDate', 'endDate'], {
      name: 'idx_bookings_start_end_date'
    })
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Bookings');
    await queryInterface.removeIndex('Bookings', 'idx_bookings_start_end_date')
  }
};
