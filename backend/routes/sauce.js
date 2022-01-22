const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');

// mise en place des routes avec manipulation de l'objet sauce //
router.post('/', auth, multer, sauceCtrl.createSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.get('/', auth, sauceCtrl.getAllsauces);
router.get('/:id', auth, sauceCtrl.getOnesauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.put('/:id/like', auth, sauceCtrl.evalSauce);

module.exports = router;