'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      room_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'rooms',
          key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'ID of the room where message was sent'
      },
      sender_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onDelete: 'CASCADE',
        comment: 'ID of the user who sent the message'
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Content of the message'
      },
      type: {
        type: Sequelize.ENUM('text', 'image', 'file', 'system'),
        defaultValue: 'text',
        comment: 'Type of the message'
      },
      metadata: {
        type: Sequelize.JSONB,
        allowNull: true,
        comment: 'Additional metadata for the message (file size, dimensions, etc.)'
      },
      is_edited: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        comment: 'Whether the message has been edited'
      },
      edited_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'When the message was last edited'
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
    await queryInterface.addIndex('messages', ['room_id']);
    await queryInterface.addIndex('messages', ['sender_id']);
    await queryInterface.addIndex('messages', ['created_at']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('messages');
  }
};
