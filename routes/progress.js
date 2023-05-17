const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
  res.render("progress", { title: "My Progress" });
});

module.exports = router;