'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rooms', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'Name of the chat room'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Description of the chat room'
      },
      type: {
        type: Sequelize.ENUM('private', 'group'),
        defaultValue: 'private',
        comment: 'Type of the chat room'
      },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'User who created the room'
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
        comment: 'URL to room avatar image'
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
    await queryInterface.addIndex('rooms', ['name']);
    await queryInterface.addIndex('rooms', ['type']);
    await queryInterface.addIndex('rooms', ['created_by']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('rooms');
  }
};