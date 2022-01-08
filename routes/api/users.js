var express = require("express");

var router = express.Router();

router.get("/", function(req, res){
    res.json("json buat api");
});

module.exports = router;