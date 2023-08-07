const UAParser = require("ua-parser-js");
const SessionService = require("../services/SessionService");

const parseUserAgent = (req, res, next) => {
  let parser = new UAParser(req.get("user-agent"));
  let user_browser = parser.getResult().browser.name;
  if (user_browser) {
    req.user_browser = user_browser;
    next();
  } else {
    res.status(400).send("User agent not valid");
  }
};

const parseCookies = (cookie) => {
  if (!cookie) return null;
  let pairs = cookie.split(";").filter((element) => element);
  let splittedPairs = pairs.map((cookie) => cookie.split("="));
  const cookieObj = splittedPairs.reduce(function (obj, cookie) {
    obj[decodeURIComponent(cookie[0].trim())] = decodeURIComponent(
      cookie[1].trim()
    );

    return obj;
  }, {});

  return cookieObj;
};

const checkCookieSession = async (req, res, next) => {
  if (!req.user_browser) {
    res.status(400).send("user_browser not found");
    return;
  }
  console.log(req.get("cookie"));
  let cookie = parseCookies(req.get("Cookie"));
  let sessid = null;
  if (cookie) sessid = cookie["sessid"];

  if (sessid) {
    let user_browser_json = JSON.stringify(req.user_browser);
    let sess = await SessionService.getSessionById(sessid);
    if (sess && sess.sess && sess.sess === user_browser_json) {
      req.sessid = sessid;
      next();
    } else if (sess && sess.sess && sess.sess != user_browser_json) {
      res.status(401).send("Session already exists in another browser");
    } else if (!sess) {
      res.status(401).send("no session exists");
    }
  } else {
    res.status(401).send("no session exists");
  }
};

const checkCookieSessionLogin = async (req, res, next) => {
  if (!req.user_browser) {
    res.status(400).send("user_browser not found");
    return;
  }
  let user_browser_json = JSON.stringify(req.user_browser);
  let sess = await SessionService.getSessionById(
    `${req.query.name}${req.query.password}`
  );
  if (sess && sess.sess && sess.sess === user_browser_json) {
    res.status(200).send("user already logged in");
  } else if (sess && sess.sess && sess.sess != user_browser_json) {
    res.status(400).send("Session already exists in another browser");
  } else if (!sess) {
    next();
  }
};

module.exports = {
  checkCookieSessionLogin,
  checkCookieSession,
  parseUserAgent,
};
