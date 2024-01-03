const express = require('express'); 
const bannerControllers = require('../Controller/bannerController');

const router = express();



router.post('/',[bannerControllers.AddBanner]);
router.get('/',[  bannerControllers.getBanner]);
router.get('/type/:type',[  bannerControllers.getbannerbyType]);

router.put('/updateBanner/:id',[ bannerControllers.updateBanner]);

router.delete('/:id',[ bannerControllers.removeBanner])


module.exports = router;