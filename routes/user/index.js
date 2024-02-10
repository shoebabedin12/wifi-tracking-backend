const express = require("express");
const router = express.Router();
const {
  addClientController,
  allClient,
  updateClientController,
  deleteSingleClientController,
  addClientPaymentHistoryController,
  getAllClientPaymentsController,
  deletePaymentDetailsController,
  updateSingleClientPaymentDetails,
  updatePaymentDetails
} = require("../../controllers/clientController");

// get request
router.get("/all-client", allClient);
router.get("/all-client-payments-status", getAllClientPaymentsController);
// post request
router.post("/add-client", addClientController);
router.post("/add-client-payment-history", addClientPaymentHistoryController);
router.post("/update-single-client-details", updateSingleClientPaymentDetails);
// delete request
router.delete("/delete-client", deleteSingleClientController);
router.delete('/delete-payment-details', deletePaymentDetailsController)
// update request
router.put("/update-client", updateClientController);

module.exports = router;
