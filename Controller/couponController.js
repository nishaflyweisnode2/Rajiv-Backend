const Coupon = require('../Model/couponModel')


exports.addcoupon = async (req,res) =>{
    try {
        const { code, discount, startDate, expirationDate } = req.body;

        // Create a new coupon
        const coupon = new Coupon({
            code,
            discount,
            startDate,
            expirationDate
        });

        // Save the coupon to the database
        const savedCoupon = await coupon.save();

        res.status(201).json(savedCoupon);
    } catch (error) {
        res.status(400).json({ message: 'Coupon creation failed', error: error.message });
    }
};


    // Get all coupons
    exports.getcoupon = async (req,res) =>{
    try {
        const coupons = await Coupon.find();
        res.status(200).json(coupons);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving coupons', error: error.message });
    }
};


exports.updateCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;
        const { code, discount, startDate, expirationDate } = req.body;

        // Check if a coupon with the given ID exists
        const existingCoupon = await Coupon.findById(couponId);

        if (!existingCoupon) {
            return res.status(404).json({ message: 'Coupon not found.' });
        }

        // Update the existing coupon
        existingCoupon.code = code;
        existingCoupon.discount = discount;
        existingCoupon.startDate = startDate;
        existingCoupon.expirationDate = expirationDate;

        // Save the updated coupon to the database
        const updatedCoupon = await existingCoupon.save();

        res.status(200).json(updatedCoupon);
    } catch (error) {
        res.status(400).json({ message: 'Coupon update failed', error: error.message });
    }
};

exports.deleteCoupon = async (req, res) => {
    try {
        const couponId = req.params.id;

        // Check if a coupon with the given ID exists
        const existingCoupon = await Coupon.findById(couponId);

        if (!existingCoupon) {
            return res.status(404).json({ message: 'Coupon not found.' });
        }

        // Delete the coupon
        await existingCoupon.deleteOne(); // or use existingCoupon.deleteMany() if needed

        res.status(200).json({ message: 'Coupon deleted successfully', status: 200 });
    } catch (error) {
        res.status(500).json({ message: 'Server error', status: 500, error: error.message });
    }
};