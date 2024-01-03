const express = require('express'); 
const city = require('../Controller/cityController');


const router = express();


router.post('/', [  city.addcity]);
router.get('/', [  city.getcity]);
router.put('/:id',[ city.updatecity]);
router.delete('/:id',[  city.Deletecity]);

module.exports = router;