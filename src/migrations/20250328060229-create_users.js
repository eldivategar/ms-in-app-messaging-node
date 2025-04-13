'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Name of the user'
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Email of the user'
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'Avatar of the user'
      },
      status: {
        type: Sequelize.STRING,
        defaultValue: 'offline',
        comment: 'User online status'
      },
      last_seen: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Last time user was seen online'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('users', ['name']);
    await queryInterface.addIndex('users', ['email']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};