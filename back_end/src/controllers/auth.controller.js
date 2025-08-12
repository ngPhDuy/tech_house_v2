import accountService from "../services/account.service.js";

const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    let isValid;

    if (role === "tv") {
      isValid = await accountService.canMemberLogin(username, password);
    } else if (role === "nv") {
      isValid = await accountService.canEmployeeLogin(username, password);
    }

    if (isValid) {
      res.status(200).json({ message: "Login successful" });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { login };
