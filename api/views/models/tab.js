var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var tabSchema = new Schema({
	imageUrl: {type: String, default: ''},
	title: {type: String, default: ''}
});

module.exports = mongoose.model('tab', tabSchema);