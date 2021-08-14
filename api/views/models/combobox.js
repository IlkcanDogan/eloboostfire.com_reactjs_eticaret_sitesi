var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var comboboxSchema = new Schema({
	tabId: {type: String, default: ''},
	float: {type: String, default: ''},
	name: {type: String, default: ''},
	options: {type: Array, default: []}
});

module.exports = mongoose.model('combobox', comboboxSchema);