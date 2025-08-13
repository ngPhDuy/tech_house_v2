import accountService from "../services/account.service.js";

const signUp = async (req, res) => {
  try {
    const { username, password, phoneNumber } = req.body;

    const newAccount = await accountService.createOne(
      username,
      password,
      phoneNumber
    );

    if (newAccount) {
      res.status(200).json({ message: "Sign up successful" });
    } else {
      res.status(400).json({ message: "Sign up failed" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getOne = async (req, res) => {
  try {
    const { userID } = req.params;

    const result = await accountService.getOne(userID);

    if (result) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateOne = async (req, res) => {
  try {
    const { userID } = req.params;
    const payload = req.body;

    //check if payload is empty
    if (Object.keys(payload).length === 0) {
      return res.status(400).json({ message: "Payload is empty" });
    }

    const result = await accountService.updateOne(userID, payload);

    if (result) {
      res.status(200).json({ message: "User updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePasswordByUser = async (req, res) => {
  try {
    const { userID } = req.params;
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old password and new password are required" });
    }

    const result = await accountService.updatePasswordByUser(
      userID,
      oldPassword,
      newPassword
    );

    if (result) {
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAll = async (req, res) => {
  try {
    const result = await accountService.getAll();

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePasswordByAdmin = async (req, res) => {
  try {
    const { userID } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password is required" });
    }

    const result = await accountService.updatePasswordByAdmin(
      userID,
      newPassword
    );

    if (result) {
      res.status(200).json({ message: "Password updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateActiveStatus = async (req, res) => {
  try {
    const { userID } = req.params;
    const { activeStatus } = req.body;

    if (activeStatus === undefined) {
      return res.status(400).json({ message: "Active status is required" });
    }

    const result = await accountService.updateActiveStatus(
      userID,
      activeStatus
    );

    if (result) {
      res.status(200).json({ message: "Active status updated successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default {
  signUp,
  getOne,
  updateOne,
  updatePasswordByUser,
  getAll,
  updatePasswordByAdmin,
  updateActiveStatus,
};
