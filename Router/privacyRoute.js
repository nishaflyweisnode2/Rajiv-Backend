const express = require('express'); 
const privacy = require('../Controller/privacyController');


const router = express();


router.post('/', [  privacy.addprivacy]);
router.get('/', [  privacy.getprivacy]);
router.get('/type/:type', [  privacy.getprivacybyType]);

router.put('/:id',[ privacy.updateprivacy]);
router.delete('/:id',[  privacy.Deleteprivacy]);

module.exports = router;