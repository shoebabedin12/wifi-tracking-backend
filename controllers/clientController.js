const Client = require("../models/clientModel");

const addClientController = async (req, res) => {
  const clientsData = req.body.users;

  if (!clientsData || !Array.isArray(clientsData) || clientsData.length === 0) {
    return res
      .status(400)
      .json({ message: "Please provide valid client data" });
  }
  try {
    for (const clientData of clientsData) {
      const { name, macAddress, device, roomNo } = clientData;

      if (!name || !macAddress || !device || !roomNo) {
        return res
          .status(400)
          .json({ message: "Please enter all fields for each client" });
      }

      const existingClient = await Client.findOne({ name: name });

      if (existingClient) {
        return res.status(403).json({ message: "Client already exists" });
      }

      const newClient = new Client({
        name,
        macAddress,
        device,
        roomNo
      });

      await newClient.save();
    }

    return res.status(200).json({ message: "Clients created successfully" });
  } catch (error) {
    console.error("Error creating clients:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const allClient = async (req, res) => {
  try {
    const allClients = await Client.find({}); // Note the plural 'allClients'

    const clientsData = allClients.map((client) => ({
      key: client._id,
      name: client.name,
      macAddress: client.macAddress,
      device: client.device,
      roomNo: client.roomNo,
      status: client.status,
      paymentDetails: client.paymentDetails
    }));

    res.json({
      message: "Fetch all data",
      data: clientsData
    });
  } catch (error) {
    console.error("Error fetching all clients:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateClientController = async (req, res) => {
  const { device, key, macAddress, name, roomNo, status } = req.body;
  if (!device || !key || !macAddress || !name || !roomNo || !status) {
    return res.status(403).json({
      message: "Missing or invalid parameters for updating client information"
    });
  }
  try {
    const existingClient = await Client.findById({ _id: key });

    if (!existingClient) {
      return res.status(404).json({ message: "Client not found" });
    }

    existingClient.device = device;
    existingClient.macAddress = macAddress;
    existingClient.name = name;
    existingClient.roomNo = roomNo;
    existingClient.status = status;

    await existingClient.save();

    res.status(200).json({
      success: `User ${existingClient.name} updated successfully`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteSingleClientController = async (req, res) => {
  try {
    const { id } = req.body;
    const deletedClient = await Client.findByIdAndDelete({ _id: id });
    res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addClientPaymentHistoryController = async (req, res) => {
  const { clientId } = req.body;
  console.log(req.body);
  try {
    if (!clientId) {
      return res.status(400).json({ message: "Invalid client ID" });
    }

    const existingClient = await Client.findById(clientId);

    if (!existingClient) {
      return res
        .status(404)
        .json({ message: `Client with ID ${clientId} not found` });
    }

    // Assuming paymentDate and paymentAmount are obtained from somewhere in your request body
    const { paymentDate, paymentAmount, paymentStatus } = req.body;

    // Push the payment data to the client's paymentDetails array
    existingClient.paymentDetails.push({
      paymentDate,
      paymentAmount,
      paymentStatus
    });

    // Save the updated client document
    await existingClient.save();

    return res
      .status(200)
      .json({ message: "Payment details added successfully" });
  } catch (error) {
    console.error("Error adding payment details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllClientPaymentsController = async (req, res) => {
  try {
    // Fetch all users from the database using the Client model
    const users = await Client.find();

    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so add 1
    const currentYear = currentDate.getFullYear();

    // Filter users with pending payments for the current month
    const usersWithPendingPayments = getUsersWithPendingPayments(users, currentMonth, currentYear);

    // Extract user IDs and payment status
    const pendingPayments = extractPendingPayments(usersWithPendingPayments);

    // Send the user IDs and payment status as response
    res.json({ pendingPayments });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching users with pending payments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUsersWithPendingPayments = (users, currentMonth, currentYear) => {
  return users.filter(user =>
    user.paymentDetails &&
    user.paymentDetails.some(payment =>
      payment.paymentStatus === "pending" &&
      new Date(payment.paymentDate).getMonth() + 1 === currentMonth &&
      new Date(payment.paymentDate).getFullYear() === currentYear
    )
  );
};

const extractPendingPayments = (usersWithPendingPayments) => {
  return usersWithPendingPayments.map(user => ({
    userId: user._id, // Assuming user IDs are stored in the "_id" field
    paymentStatus: user.paymentDetails.find(payment => payment.paymentStatus === "pending").paymentStatus
  }));
};


const updatePaymentDetailsController = async (req, res) => {
  try {
    // Get the current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Month is zero-based, so add 1
    const currentYear = currentDate.getFullYear();

    // Fetch all users from the database using the Client model
    const users = await Client.find();

    // Update paymentDetails data for each user
    for (const user of users) {
      let paymentDetails = user.paymentDetails || []; // Existing paymentDetails or empty array

      // Check if paymentDetails for the current month already exist
      const paymentExists = paymentDetails.some((payment) => {
        const paymentDate = new Date(payment.paymentDate); // Define paymentDate here
        return (
          paymentDate.getMonth() + 1 === currentMonth &&
          paymentDate.getFullYear() === currentYear
        );
      });

      // If paymentDetails for the current month don't exist, add them
      if (!paymentExists) {
        // Add default or empty paymentDetails for the current month
        const paymentDate = new Date(); // Define paymentDate here
        paymentDetails.push({
          paymentDate: paymentDate,
          paymentAmount: "100",
          paymentStatus: "pending" // Assuming default payment status is 'pending'
          // You can add more fields as needed
        });

        // Update the user's paymentDetails in the database
        await Client.findByIdAndUpdate(user._id, { paymentDetails });
      }
    }

    // Send success response
    res.json({ message: "Payment details updated successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error updating payment details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


const deletePaymentDetailsController = async () => {
  try {
    const { id } = req.body;
    console.log(req.body);
    // const deletedClient = await Client.findByIdAndDelete({ _id: id });
    // res.status(200).json({ message: "Client deleted successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error deleting client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = {
  addClientController,
  allClient,
  updateClientController,
  deleteSingleClientController,
  addClientPaymentHistoryController,
  getAllClientPaymentsController,updatePaymentDetailsController,deletePaymentDetailsController
};
