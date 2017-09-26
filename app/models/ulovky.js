var mongoose = require('mongoose');

var Schema = mongoose.Schema;


var UlovkySchema = new Schema({

	uzivatelId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	uzivatelMeno: { type: String, required: true },
	znacka: { type: String, required: true},
	cas: { type: Date, default: Date.now}, // defaultne ak neni v parametry cas tak sa da aktualny
	zver: { type: String, required: true}
});

module.exports = mongoose.model('Ulovky', UlovkySchema);