var express = require('express');
const controllerProduct = require('../controllers/product.controller')
const productImageUpload = require('../middlewares/multer.config')
const auth = require('../middlewares/auth')
var router = express.Router();

/* GET home page. */
router.get('/', auth, controllerProduct.list);
// get article by id 
router.get('/:id', auth, controllerProduct.show)

router.post('/', productImageUpload, auth, controllerProduct.create)

router.put('/:id', productImageUpload, auth, controllerProduct.update)

router.delete('/:id', auth, controllerProduct.delete)

module.exports = router;