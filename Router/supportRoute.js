const express = require('express'); 
const support = require('../Controller/supportController');


const router = express();


router.post('/', [  support.addsupport]);
router.get('/', [  support.getsupport]);
router.put('/:id',[ support.updatesupport]);
router.delete('/:id',[  support.Deletesupport]);

module.exports = router;