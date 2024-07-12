const admin = require('./adminController');
const user = require('./userController');
const home = require('./homeController');
const profile = require('./profileController');
const product = require('./productController');
const cart = require('./cartController');
const category = require('./categoryController');
const order = require('./orderController');
const comment_product = require('./comment_productController');
const rating_product = require('./rating_productController');
const transaction_history = require('./transaction_historyController');

module.exports ={
	user,
	admin,
	home,
	profile,
    cart,
    category,
    product,
    order,
    comment_product,
    rating_product,
    transaction_history
};