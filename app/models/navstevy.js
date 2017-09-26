var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var NavstevySchema = new Schema({

	uzivatelId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	uzivatelMeno: { type: String, required: true },
	lokalita: { type: String, required: true},
	prichod: { type: String, required: true},
	odchod: { type: String, required: true}

});

module.exports = mongoose.model('Navstevy', NavstevySchema);