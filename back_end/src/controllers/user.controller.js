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

export default { signUp };
