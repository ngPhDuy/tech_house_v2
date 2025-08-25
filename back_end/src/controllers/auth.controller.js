import accountService from "../services/account.service.js";

const login = async (req, res) => {
  try {
    const { username, password, adminLogin } = req.body;
    let token;

    if (!adminLogin) {
      token = await accountService.canMemberLogin(username, password);
    } else {
      token = await accountService.canEmployeeLogin(username, password);
    }

    if (token) {
      res.cookie("refreshToken", token.refreshToken.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/api/auth",
        expires: token.refreshToken.thoi_diem_het_han,
      });

      res.status(200).json({ accessToken: token.accessToken });
    } else {
      res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader.split(" ")[1];
    const refreshToken = req.cookies?.refreshToken;

    console.log(accessToken, refreshToken);
    const result = await accountService.logout(accessToken, refreshToken);

    if (result) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // chỉ secure khi deploy https
        sameSite: "strict",
      });

      res.status(200).json({ message: "Logout successful" });
    } else {
      res.status(400).json({ message: "Logout failed" });
    }
  } catch (err) {
    console.log(err);
  }
};

const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    const result = await accountService.refreshToken(refreshToken);

    if (result) {
      res.status(200).json({ accessToken: result.accessToken });
    } else {
      res.status(401).json({ message: "Invalid refresh token" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default { login, logout, refreshToken };
