const express = require("express");
const router = express.Router();
const { addClientController, allClient, updateClientController, deleteSingleClientController, addClientPaymentHistoryController } = require("../../controllers/clientController");


// get request
router.get("/all-client", allClient)
// post request
router.post("/add-client", addClientController)
router.post("/add-client-payment-history", addClientPaymentHistoryController)
// delete request
router.delete("/delete-client", deleteSingleClientController)
// update request
router.put("/update-client", updateClientController)

module.exports = router;