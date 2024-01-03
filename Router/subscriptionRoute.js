const express = require('express'); 
const subscriptionControllers = require('../Controller/subscriptionController');

const router = express();



router.post('/',[subscriptionControllers.AddSubscription]);
router.get('/',[  subscriptionControllers.getsubscription]);
router.put('/updatesubscription/:id',[ subscriptionControllers.updateSubscription]);

router.delete('/:id',[ subscriptionControllers.removeSubscription])


module.exports = router;