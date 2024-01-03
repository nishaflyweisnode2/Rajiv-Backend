const express = require('express'); 
const category = require('../Controller/categoryController');


const router = express();


router.post('/', [  category.addcategory]);
router.get('/', [  category.getcategory]);
router.put('/:id',[ category.updatecategory]);
router.delete('/:id',[  category.Deletecategory]);

module.exports = router;