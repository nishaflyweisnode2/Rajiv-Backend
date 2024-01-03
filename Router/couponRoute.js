const express = require('express'); 
const coupon = require('../Controller/couponController');


const router = express();


router.post('/', [  coupon.addcoupon]);
router.get('/', [  coupon.getcoupon]);
router.put('/:id',[ coupon.updateCoupon]);
router.delete('/:id',[  coupon.deleteCoupon]);

module.exports = router;