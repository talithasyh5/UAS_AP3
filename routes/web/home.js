var express = require("express");
var passport = require("passport");

var ensureAuthenticated = require("../../auth/auth").ensureAuthenticated;

var User = require("../../models/user");
var Warga = require("../../models/warga");
var Berita = require("../../models/berita");

var router = express.Router();

router.get("/", function (req, res) {
	res.render("home/");
});

router.get("/home", async function (req, res) {
	const berita = await Berita.find({})
	console.log(berita)
	res.render("home/home", {
		berita: berita
	});
});

router.get("/about", function (req, res) {
	res.render("home/about");
});

router.get("/data", ensureAuthenticated,async function (req, res) {
	const row = await Warga.find({});
	console.log(row);
	res.render("home/data", { warga: row });
});

router.get("/data/tambah", function (req, res) {
	res.render("home/datav/tambah", { success: false });
});

router.get("/data/edit/:id", async function (req, res) {
	const record = await Warga.findById(req.params.id);
	res.render("home/datav/edit", {
		data: record,
		success: false,
	});
});

router.post("/data/edit/:id", async function (req, res) {
	const objUpdate = {
		nama: req.body.nama,
		alamat: req.body.alamat,
		nohp: req.body.nohp,
		status_tempat_tinggal: req.body.status_tempat_tinggal,
		agama: req.body.agama,
	};
	const update = await Warga.findByIdAndUpdate(req.params.id, objUpdate);
	console.log(update);
	const record = await Warga.findById(req.params.id);
	res.render("home/datav/edit", {
		data: record,
		success: true,
	});
});

router.get("/data/hapus/:id", async function (req, res) {
	const del = await Warga.findByIdAndRemove(req.params.id);
	res.redirect("/data");
});

router.post("/data/tambah", function (req, res) {
	const warga = new Warga({
		nama: req.body.nama,
		alamat: req.body.alamat,
		nohp: req.body.nohp,
		status_tempat_tinggal: req.body.status_tempat_tinggal,
		agama: req.body.agama,
	});
	warga.save();

	res.render("home/datav/tambah", { success: true });
});

router.get("/login", function (req, res) {
	res.render("home/login");
});

router.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/home");
});

router.post(
	"/login",
	passport.authenticate("login", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true,
	})
);

router.get("/signup", function (req, res) {
	res.render("home/signup");
});

router.post(
	"/signup",
	function (req, res, next) {
		var username = req.body.username;
		var email = req.body.email;
		var password = req.body.password;

		User.findOne({ email: email }, function (err, user) {
			if (err) {
				return next(err);
			}
			if (user) {
				req.flash(
					"error",
					"There's already an account with this email"
				);
				return res.redirect("/signup");
			}

			var newUser = new User({
				username: username,
				password: password,
				email: email,
			});

			newUser.save(next);
		});
	},
	passport.authenticate("login", {
		successRedirect: "/",
		failureRedirect: "/signup",
		failureFlash: true,
	})
);

module.exports = router;
