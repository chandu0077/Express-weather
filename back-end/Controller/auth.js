const { registerValidation, loginValidation } = require("../validation");

const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

function generateAccessToken(userId) {
  return jwt.sign({ _id: userId }, process.env.TOKEN_SECRET, {
    expiresIn: "50m",
  });
}

const Register = async (req, res) => {
  const { name, email, password } = req.body.data;

  const { error } = registerValidation(req.body.data);

  if (error) {
    return res.status(400).send({ msg: "Validation failed!!!" });
  }
  const emailExists = await User.findOne({ email: email });
  if (emailExists) {
    return res.status(400).send({ msg: "Email already exists!!!" });
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });
  try {
    const savedUser = await user.save();
    res.send({ user: user._id, msg: "Registration Successfull!!!" });
  } catch (error) {
    res.status(400).send({ msg: "Something went wrong, Try Again" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body.data;

  const { error } = loginValidation(req.body.data);

  if (error) {
    return res.status(400).send({ msg: "Validation failed!!!", error });
  }
  const user = await User.findOne({ email: email });
  if (!user) return res.status(400).send({ msg: "Email does not exists!!!" });

  const validPass = await bcrypt.compare(password, user.password);

  if (!validPass) {
    return res.status(400).send({ msg: "Email or password is wrong!!!" });
  }
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  res.json({ accessToken, refreshToken, msg: "Login successful!!!" });
};

const RefreshToken = async (req, res) => {
  const refreshToken = req.body.refreshToken;

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const accessToken = generateAccessToken(decoded._id);

    res.json({ accessToken });
  } catch (error) {
    res.status(401).send("Invalid refresh Token!!!");
  }
};

const Update = async (req, res) => {
  const { email, name, password } = req.body;

  const { error } = registerValidation(req.body.data);
  try {
    const emailExists = await User.findOne({ email: email });
    if (!emailExists) {
      return res.status(400).send({ msg: "Email Not Found!!!" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.findByIdAndUpdate(req.user._id, {
      name: name,
      password: hashedPassword,
    });
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.json({ accessToken, refreshToken, msg: "Update Successfull!!!" });
  } catch (error) {
    res.status(401).send("Invalid Refresh Token!!!");
  }
};

const GetUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw Error("User does not exist");
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: err.message });
  }
};

function generateRefreshToken(userId) {
  jwt.sign({ _id: userId }, process.env.REFRESH_TOKEN_SECRET);
}

module.exports = { Register, Login, RefreshToken, Update, GetUser };
