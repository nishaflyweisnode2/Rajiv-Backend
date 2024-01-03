const express = require('express'); 
const cancel = require('../Controller/cancelController');


const router = express();


router.post('/', [  cancel.addcancel]);
router.get('/', [  cancel.getcancel]);
router.put('/:id',[ cancel.updatecancel]);
router.delete('/:id',[  cancel.Deletecancel]);

module.exports = router;