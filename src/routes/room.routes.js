const express = require('express');
const router = express.Router();
const roomController = require('../controllers/room.controller');

// Room Routes
router.post('/', roomController.createRoom);
router.get('/users/:userId', roomController.getUserRooms);
router.delete('/:roomId', roomController.deleteRoom);

// Utility Routes
router.put('/:roomId/members/:userId/read', roomController.updateLastRead);
router.get('/:roomId/members/:userId/unread', roomController.getUnreadCount);

// Get room messages
router.get('/:roomId/messages', roomController.getRoomMessages);

module.exports = router;
