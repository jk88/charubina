var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var OznamyNavstevySchema = new Schema({
	titulok: { type: String, required: true},
	text: { type: String, required: true}

});

module.exports = mongoose.model('OznamyNavstevy', OznamyNavstevySchema);