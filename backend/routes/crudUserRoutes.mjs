// import bcrypt from "bcrypt";
import { User } from "../schemas/userSchema.mjs";
import { Router } from "express";
import nodemailer from "nodemailer";
// import generateToken from "../middleware/generateToken.mjs";

const router = new Router();

router.post("/addUser", async (req, res) => {
  try {
    const { sno, name, email, phNo, hobbies } = req.body;
    // const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ sno, name, email, phNo, hobbies: [hobbies] });
    if (user) {
      await user.save();
    }
    // const token = await generateToken(user._id, user.email);
    // req.session._id = user._id;
    res.send({ message: "User adding Successfull", _id: user._id });
  } catch (error) {
    res.status(500).send(`Error adding user ${error}`);
  }
});

router.get("/getUsers", async (req, res) => {
  try {
    // const hashedPassword = await bcrypt.hash(password, 10);
    const users = await User.find();
    console.log(users);
    // const token = await generateToken(user._id, user.email);
    // req.session._id = user._id;
    res.send({ message: " Successfully got data", users: users });
  } catch (error) {
    res.status(500).send(`Error getting data ${error}`);
  }
});

router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  try {
    const userToDelete = await User.findById(userId);
    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }

    await User.findByIdAndDelete(userId);
    await User.updateMany(
      { sno: { $gt: userToDelete.sno } },
      { $inc: { sno: -1 } }
    );
    const data = await User.find();
    return res.status(200).json({ message: "User deleted successfully", data });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, phNo, email, hobbies } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, phNo, email, hobbies },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Server error" });
  }
});
export default router;

router.post("/send-email", async (req, res) => {
  const { selectedRows } = req.body;
  console.log(selectedRows);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let emailContent = "Here are the selected rows data:\n\n";
  selectedRows.forEach((row) => {
    emailContent += `User ${row.sno}\n`;
    emailContent += `Sno: ${row.sno}\n`;
    emailContent += `Name: ${row.name}\n`;
    emailContent += `Email: ${row.email}\n`;
    emailContent += `Phone Number: ${row.phNo}\n`;
    if (row.hobbies) {
      emailContent += `Hobbies: ${row.hobbies[0]}\n\n`;
    }
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: "info@redpositive.in",
    subject: "Selected Rows Data (Lakshmi Amrutha Assigment)",
    text: emailContent,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ message: "Error sending email", error });
  }
});
