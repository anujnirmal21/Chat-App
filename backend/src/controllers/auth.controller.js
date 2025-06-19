import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/genrateJwtToken.js";
import bcrypt from "bcryptjs";
import { User } from "./../models/User.model.js";

const userSignup = async (req, res) => {
  try {
    const { fullName, email, password, profile_pic } = req.body;

    // Check if all fields are provided
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
      profile_pic,
    });

    // Save user and generate token
    if (newUser) {
      await newUser.save();
      generateToken(newUser._id, res);

      return res.status(201).json({
        id: newUser._id,
        fullName,
        email,
        profile_pic,
        message: "User created successfully.",
      });
    } else {
      return res.status(400).json({ message: "Invalid user data." });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal server error: " + error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).json({ message: "all fields required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "invalid cridentials." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "invalid cridentials." });
    }

    generateToken(user._id, res);

    return res.status(200).json({
      userID: user._id,
      fullName: user.fullName,
      email: user.email,
      profile_pic: user.profile_pic,
      message: "user logged in successfully.",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error : " + error.message });
  }
};

const userLogout = async (req, res) => {
  try {
    res.cookie("token", "", { maxAge: 0 });
    res.status(200).json({ message: "user logged out successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error : " + error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { profile_pic } = req.body;
    // console.log(profile_pic);
    const userId = req.user._id;
    if (!profile_pic) {
      return res.status(400).json({ message: "profile pic required" });
    }

    const uploadRes = await cloudinary.uploader.upload(profile_pic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profile_pic: uploadRes.secure_url,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser.select("-password"),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error : " + error.message });
  }
};

const checkAuth = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error : " + error.message });
  }
};

export { userSignup, userLogin, userLogout, updateProfile, checkAuth };
