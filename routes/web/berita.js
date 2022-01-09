const express = require("express");
const multer = require("multer");
const fs = require("fs");
const upload = multer({ dest: "uploads/" });

const ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;
const Berita = require("../../models/berita");
const path = require("path");
const { route } = require("./home");

const router = express.Router();

function move(oldPath, newPath, callback) {
	fs.rename(oldPath, newPath, function (err) {
		if (err) {
			if (err.code === "EXDEV") {
				copy();
			} else {
				callback(err);
			}
			return;
		}
		callback();
	});

	function copy() {
		var readStream = fs.createReadStream(oldPath);
		var writeStream = fs.createWriteStream(newPath);

		readStream.on("error", callback);
		writeStream.on("error", callback);

		readStream.on("close", function () {
			fs.unlink(oldPath, callback);
		});

		readStream.pipe(writeStream);
	}
}
router.get("/", ensureAuthenticated, async (req, res) => {
	let berita = await Berita.find({});
	console.log(berita);
	res.render("home/berita/list", {
		berita: berita,
	});
});

router.get("/tambah", ensureAuthenticated, (req, res) => {
	res.render("home/berita/tambah", {
		success: false,
	});
});

router.post("/tambah", upload.single("img_header"), (req, res) => {
	move(
		`uploads/${req.file.filename}`,
		`public/${req.file.originalname}`,
		(err) => {
			console.log(err);
		}
	);
	const berita = new Berita({
		img_header: req.file.originalname,
		title: req.body.title,
		content: req.body.content,
		created_at: new Date(),
	});

	berita.save();
	res.render("home/berita/tambah", {
		success: true,
	});
});

router.get("/baca/:id", ensureAuthenticated, async (req, res) => {
	const berita = await Berita.findById(req.params.id);
	console.log(berita);
	return res.render("home/berita/baca", {
		berita: berita,
	});
});

router.get("/hapus/:id", ensureAuthenticated, async (req, res) => {
	const berita = await Berita.findByIdAndRemove(req.params.id);
	console.log(berita);
	return res.redirect("/berita");
});

router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
	const berita = await Berita.findById(req.params.id);
	return res.render("home/berita/edit", {
		success: false,
		berita: berita,
	});
});

router.post("/edit/:id", ensureAuthenticated, async (req, res) => {
	const objUpdate = {
		title: req.body.title,
		content: req.body.content,
		created_at: new Date(),
	};
	const update = await Berita.findByIdAndUpdate(req.params.id, objUpdate);
	const berita = await Berita.findById(req.params.id);
	return res.render("home/berita/edit", {
		success: true,
		berita: berita,
	});
});

module.exports = router;
