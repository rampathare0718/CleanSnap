const express = require("express");

const {
    createWorker
} = require("../controllers/workerController");

const router = express.Router();

router.post("/workers", createWorker);

module.exports = router;