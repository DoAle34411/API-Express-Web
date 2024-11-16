// controllers/RentDetailsController.js

const RentDetail = require('../models/rentDetail');

exports.getRentDetailsByRentId = async (req, res) => {
  try {
    const rentDetails = await RentDetail.find({ Id_rent: req.params.rentId });
    if (!rentDetails.length) return res.status(404).json({ message: "No rent details found for this rent ID" });
    res.json(rentDetails);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};