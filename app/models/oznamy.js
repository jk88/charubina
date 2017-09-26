var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var OznamySchema = new Schema({
	titulok: { type: String, required: true},
	text: { type: String, required: true}

});

module.exports = mongoose.model('Oznamy', OznamySchema);