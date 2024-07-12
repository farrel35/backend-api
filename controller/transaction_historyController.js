const db = require('../library/database');

// Fungsi untuk mengambil semua riwayat transaksi
const getAllTransactionHistories = async (id_user) => {
    try {
        const connection = await db.getConnection();
        const [rows] = await connection.execute(
            `SELECT th.*, op.id_product, p.product_name, p.price
             FROM tbl_transaction_historys th
             JOIN tbl_orders op ON th.id_order = op.id_order
             JOIN tbl_products p ON op.id_product = p.id_product
             WHERE th.id_user = ?`,
            [id_user]
        );
        await connection.end();
        return rows;
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
};

// Fungsi untuk mengambil riwayat transaksi berdasarkan ID
const getTransactionHistoryById = async (id_riwayat, id_user) => {
    try {
        const connection = await db.getConnection();
        const [rows] = await connection.execute(
            `SELECT th.*, op.id_product, p.product_name, p.price
             FROM tbl_transaction_historys th
             JOIN tbl_orders op ON th.id_order = op.id_order
             JOIN tbl_products p ON op.id_product = p.id_product
             WHERE th.id_riwayat = ? AND th.id_user = ?`,
            [id_riwayat, id_user]
        );
        await connection.end();
        return rows.length > 0 ? rows[0] : null;
    } catch (error) {
        console.error(error);
        throw new Error('Internal Server Error');
    }
};

module.exports = {
    getAllTransactionHistories,
    getTransactionHistoryById,
};
