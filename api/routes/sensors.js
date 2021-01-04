// Imports:
const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const multer = require('multer');   // form-data parser.
const storage = multer.diskStorage({    // Adjust how files get stored.
    destination: function(req, file, cb) {
        cb(null, './uploads/');     // callback (potential error, path)
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname); // callback (error, fileName)
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        // store the file:
        cb(null, true);
    }
    else {
        // reject a file:
        cb(null, false);
    }
};
const upload = multer({
    storage: storage,  // Store all uploaded files in this place.
    limits: {
        fileSize: 1024 * 1024 * 5   // Only accept files up to 5MB.
    },
    fileFilter: fileFilter
});

const SensorController = require('../controllers/sensors');

// Handle the resuests:

router.get('/', SensorController.sensors_get_all);

router.post('/', checkAuth, upload.single('sensorImage'), SensorController.sensors_create_one);

router.get('/:sensorId', SensorController.sensors_get_one);

router.patch('/:sensorId', checkAuth, SensorController.sensors_update_one);

router.delete('/:sensorId', checkAuth, SensorController.sensors_delete_one);


module.exports = router;