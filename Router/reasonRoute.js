const express = require('express'); 
const reason = require('../Controller/reasonController');


const router = express();


router.post('/', [  reason.addreason]);
router.get('/', [  reason.getreason]);
router.put('/:id',[ reason.updatereason]);
router.delete('/:id',[  reason.Deletereason]);

module.exports = router;