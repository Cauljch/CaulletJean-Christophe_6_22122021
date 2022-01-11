const express = req('express');
const router = express.Router();
const auth = req('../middleware/auth');
const multer = req('../middleware/multer-config');

const stuffCtrl = req('../controllers/stuff');

module.exports = router;