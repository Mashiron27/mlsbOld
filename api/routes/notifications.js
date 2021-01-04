// Imports:
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const NotificationController = require('../controllers/notifications');

// Handle incoming requests:
router.get('/', checkAuth, NotificationController.notifications_get_all);

router.post('/', checkAuth, NotificationController.notifications_create_notification);

router.get('/:notificationId', checkAuth, NotificationController.notifications_get_one);

router.delete('/:notificationId', checkAuth, NotificationController.notifications_delete_one);

module.exports = router;