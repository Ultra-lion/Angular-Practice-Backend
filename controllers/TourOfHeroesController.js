const SessionService = require("../services/SessionService");

const login = async (req, res) => {
  let result = await SessionService.authenticateUser(
    req.query.name,
    req.query.password,
    req.user_browser
  ).catch((error) => ({ type: "error", error: error }));

  console.log(result);
  if (result.type && result.type === "success" && result.user) {
    res.cookie("sessid", `${result.user.name}${result.user.password}`);
    res.status(200).send("user logged in");
  } else if (result.type && result.type === "error") {
    res.status(500).send(`error my man: ${result.error.message}`);
  } else {
    res.status(404).send("user does not exist");
  }
};

const logout = async (req, res) => {
  let result = await SessionService.deleteSession(req.sessid).catch(
    (error) => ({ type: "error", error: error })
  );
  console.log(result);
  if (result.type && result.type === "success") {
    res.clearCookie("sessid");
    res.status(200).send("user logged out");
  } else if (result.type && result.type === "error") {
    res.clearCookie("sessid");
    res.status(500).send(`error my man: ${result.error.message}`);
  }
};


module.exports = { login, logout };
