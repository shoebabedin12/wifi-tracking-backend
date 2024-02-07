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
  const { paymentDetails } = req.body;

  try {
    // Iterate through each payment data object
    for (const paymentData of paymentDetails) {
      const { clientId, paymentDate, paymentAmount } = paymentData;

      // Find the client by ID
      const existingClient = await Client.findById(clientId);

      if (!existingClient) {
        return res.status(404).json({ message: `Client with ID ${clientId} not found` });
      }

      // Push the payment data to the client's paymentDetails array
      existingClient.paymentDetails.push({
        paymentDate,
        paymentAmount
      });

      // Save the updated client document
      await existingClient.save();
    }

    return res.status(200).json({ message: "Payment details added successfully" });
  } catch (error) {
    console.error("Error adding payment details:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


module.exports = {
  addClientController,
  allClient,
  updateClientController,
  deleteSingleClientController,
  addClientPaymentHistoryController
};
