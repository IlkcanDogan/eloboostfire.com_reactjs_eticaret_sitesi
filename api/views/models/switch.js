var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var switchSchema = new Schema({
	tabId: {type: String, default: ''},
	name: {type: String, default: ''},
	price: {type: String, default: ''}
});

module.exports = mongoose.model('switchs', switchSchema);