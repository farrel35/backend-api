const express = require('express');
const router = express.Router();
const transaction_historyController = require('../controller/transaction_historyController');
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

router.get('/transaction-histories', transaction_historyController.getAllTransactionHistories);
router.get('/transaction-histories/:id_riwayat', transaction_historyController.getTransactionHistoryById);

module.exports = router;