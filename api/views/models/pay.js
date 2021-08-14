var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var paySchema = new Schema({
	data: {type: Array, default: []}	
});

module.exports = mongoose.model('pay', paySchema);