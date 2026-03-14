const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const registerController = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;
    if (
      username.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const isValidUsername = await User.findOne({ username: username });
    // console.log(isValidUsername);
    if (isValidUsername) {
      return res.status(400).json({
        success: false,
        message: "Username is already in use",
      });
    }
    const isValidEmail = await User.findOne({ email: email });
    if (isValidEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is already in use",
      });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "password and confirm-password doesn't match",
      });
    }

    //hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user
    const newlyCreatedUser = await User.create({
      username: username,
      email: email,
      password: hashedPassword,
      role: req.body.role || "user",
    });

    if (!newlyCreatedUser) {
      return res.status(400).json({
        success: false,
        message: "Registeration Failed",
      });
    }
    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      data: newlyCreatedUser,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { credential, password } = req.body;
    // console.log(req.body);
    if (credential.trim() === "" || password.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await User.findOne({
      $or: [{ email: credential }, { username: credential }],
    });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
      token: token,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || email.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email: email.trim().toLowerCase() });

    // Always respond with success to avoid leaking which emails are registered.
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account with that email exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(20).toString("hex");
    const expires = Date.now() + 1000 * 60 * 60; // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(expires);
    await user.save();

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const resetUrl = `${clientUrl}/auth/reset-password?token=${encodeURIComponent(
      token,
    )}&email=${encodeURIComponent(user.email)}`;

    // TODO: Send this link via email. For now, log it for development.
    console.log("[Forgot password] reset link:", resetUrl);

    return res.status(200).json({
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
      resetUrl,
    });
  } catch (error) {
    console.error("forgotPasswordController error", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { token, password, confirmPassword } = req.body;

    if (!token || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Token, password and confirmPassword are required",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Passwords do not match",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or has expired",
      });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("resetPasswordController error", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  registerController,
  loginController,
  forgotPasswordController,
  resetPasswordController,
};
