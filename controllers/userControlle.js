const User = require('../models/Users');
const bcrypt = require('bcryptjs');

// Create User
exports.createUser = async (req, res) => {
  const { cedula, email, name, lastName, birthDate, phoneNumber, password, gender } = req.body;

  try {
    // Check if cedula or email already exists
    const existingUser = await User.findOne({ $or: [{ cedula }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Cedula or email already in use" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      cedula,
      email,
      name,
      lastName,
      birthDate,
      phoneNumber,
      password: hashedPassword,
      gender,
    });

    // Save the user to the database
    await newUser.save();

    // Return the created user (you might omit the password field in the response)
    return res.status(201).json({
      id: newUser._id,
      cedula: newUser.cedula,
      email: newUser.email,
      name: newUser.name,
      lastName: newUser.lastName,
      birthDate: newUser.birthDate,
      phoneNumber: newUser.phoneNumber,
      gender: newUser.gender
    });
  } catch (err) {
    // Log the error for debugging purposes and send a 500 error response
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Read User by cedula
exports.findUserByCedula = async (req, res) => {
  try {
    const user = await User.findOne({ cedula: req.params.cedula });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update User
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete User
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    req.session.userId = user._id;
    res.json({ message: "Login successful", userId: user.cedula });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.params.id);
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password does not match" });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};