const express = require("express");
const router = express.Router();

const { setClient, getClient, deleteClient } = require("../controllers/clientController.js");


router.route("/allClients").get(getClient);
router.route("/addClient").post(setClient);
router.route("/deleteClient/:id").delete(deleteClient);

module.exports = router;