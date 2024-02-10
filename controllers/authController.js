const User = require("../models/userModels");
const bcrypt = require("bcryptjs");

const loginController = async (req, res) => {
  const { email, password, agreement } = req.body;
  if (!email || !password) {
    res.status(403).json({ message: "Please enter a valid data" });
  }
  const isExistUser = await User.find({ email: email });
  if (!isExistUser.length > 0) {
    res.status(404).json({ message: "User not found" });
  }
  console.log(isExistUser);
  bcrypt.compare(password, isExistUser[0].password).then(function (result) {
    if (result) {
      res.json({
        message: "login successful",
        user: {
          id: isExistUser[0]._id,
          email: isExistUser[0].email,
          gender: isExistUser[0].gender,
          prefix: isExistUser[0].prefix,
          phone: isExistUser[0].phone
        }
      });
    }
  });
};
const signupController = async (req, res) => {
  const { email, password, confirm, prefix, phone, gender, agreement } =
    req.body;

  console.log(req.body);
  if (password !== confirm) {
    res.status(403).json({ message: "Please enter a valid password" });
  }

  if (!email || !password || !prefix || !phone || !gender || !agreement) {
    res.status(403).json({ message: "Please enter a valid data" });
  } else {
    const duplicateEmail = await User.find({ email: email });

    if (duplicateEmail.length > 0) {
      return res.status(403).json({ message: "Duplicate email" });
    }

    bcrypt.hash(password, 10, async function (err, hash) {
      const user = await User({
        email,
        password: hash,
        prefix,
        phone,
        gender,
        agreement
      });

      user.save();

      if (user) {
        res
          .status(200)
          .json({ message: `New user ${user.email} created successfully` });
      } else {
        res.status(400).json({ message: "Invalid user data received" });
      }
    });
  }
};

module.exports = { loginController, signupController };
