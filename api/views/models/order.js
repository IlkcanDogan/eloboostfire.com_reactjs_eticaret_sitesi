var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
	orderId: {type: String, default: ''},
	customerId: {type: String, default: ''},
	discordAcceptUsername: {type: String, default: ''},
	discordSuccess: {type: Boolean, default: false},
	orderCheck: {type: Boolean, default: false},
	totalPrice: {type: String, default: ''},
	detail: {type: Array, default: []},
	account: {type:Array, default: []},
},{ timestamps: true });

module.exports = mongoose.model('order', orderSchema);