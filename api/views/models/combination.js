 

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var combinationSchema = new Schema({
	tabId: {type: String, default: ''},
	totalPrice: {type: String, default: ''},
	complateTime: {type: String, default: ''},
	combinations: {type: Array, default: []}
});

module.exports = mongoose.model('combination', combinationSchema);