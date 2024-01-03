const express = require("express");
const {
    addMoney,
    getWallet,
    deleteWallet
} = require("../Controller/walletController");

const router = express.Router();
  
  router.post("/addmoney/:userId", addMoney);
  router.get("/get/:userId", getWallet);
  router.post("/deduct/:userId", deleteWallet);
  
  module.exports = router;