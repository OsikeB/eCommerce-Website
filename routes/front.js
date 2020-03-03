const express = require("express");
const router = express.Router();

//HomePage
router.get("/hom", (req, res) => res.render ("homepage"));

//Backpage
router.get("/backpage", (req, res) => res.render ("backpage"));



module.exports = router;