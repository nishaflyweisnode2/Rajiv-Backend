const express = require('express'); 
const serviceControllers = require('../Controller/serviceController');

const router = express();



router.post('/',[serviceControllers.AddService]);
router.get('/',[  serviceControllers.getService]);
router.put('/updateService/:id',[ serviceControllers.updateService]);

router.delete('/:id',[ serviceControllers.removeService])


module.exports = router;