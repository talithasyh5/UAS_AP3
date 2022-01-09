const mongoose = require("mongoose");

const wargaSchema = mongoose.Schema({
	nama: { type: String, required: true },
	alamat: { type: String, required: true },
	nohp: { type: String, required: true },
	status_tempat_tinggal: { type: String, required: true },
	agama: { type: String, required: true },
});

const Warga = mongoose.model("Warga", wargaSchema);

module.exports = Warga;
