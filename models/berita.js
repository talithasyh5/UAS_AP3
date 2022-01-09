const mongoose = require("mongoose");

const beritaSchema = mongoose.Schema({
	img_header: { type: String, required: false },
	title: { type: String, required: false },
	content: { type: String, required: true },
	created_at: { type: Date, required: true },
});

const Berita = mongoose.model("Berita", beritaSchema);

module.exports = Berita;
