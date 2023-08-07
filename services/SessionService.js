const db = require("../models/models");
const MOMENT = require("moment");
const { Op } = require("sequelize");

const getUserName = async (name, password) => {
  let user = await db.User.findOne({
    attributes: ["name", "password"],
    where: {
      name: name,
      password: password,
    },
  });
  return user;
};

const createOrUpdateSession = async (user, user_browser) => {
  let user_browser_json = JSON.stringify(user_browser);
  return await db.Session.upsert({
    sid: `${user.name}${user.password}`,
    expire: MOMENT().add(30, "m").format("YYYY-MM-DD  HH:mm:ss.000"),
    sess: user_browser_json,
  })
    .then(() => {
      return {
        type: "success",
        user: user,
      };
    })
    .catch((err) => {
      console.log(err);
      return {
        type: "error",
        error: err,
      };
    });
};

const authenticateUser = async (name, password, user_browser) => {
  let user = await getUserName(name, password);
  console.log(user);
  if (user) {
    return await createOrUpdateSession(user, user_browser);
  } else {
    return {
      type: "error",
      error: new Error("user not found"),
    };
  }
};

const deleteSession = async (sessid) => {
  return await db.Session.destroy({
    where: {
      sid: sessid,
    },
  })
    .then(() => {
      return {
        type: "success",
      };
    })
    .catch((err) => {
      console.log(err);
      return {
        type: "error",
        error: err,
      };
    });
};

const getSessionById = async (sessid) => {
  let sess = await db.Session.findOne({
    attributes: ["sid", "expire", "sess"],
    where: {
      sid: sessid,
      expire: {
        [Op.gt]: MOMENT().format("YYYY-MM-DD  HH:mm:ss.000"),
      },
    },
  });
  return sess;
};

module.exports = {
  authenticateUser,
  getSessionById,
  createOrUpdateSession,
  deleteSession,
};

/**
 * let user_browser_json = JSON.stringify(user_browser);
  let sess = await db.Session.findOne({
    raw: true,
    attributes: ["sid", "expire", "sess"],
    where: {
      sid: `${user.name}${user.password}`,
      expire: {
        [Op.gt]: MOMENT().format("YYYY-MM-DD  HH:mm:ss.000"),
      },
    },
  });
  if (sess && sess.sess && sess.sess === user_browser_json) {
    return {
      type: "success",
      user: user,
    };
  } else if (sess && sess.sess && sess.sess != user_browser_json) {
    return {
      type: "error",
      error: new Error("Session already exists in another browser"),
    };
  } else {
    return await db.Session.upsert({
      sid: `${user.name}${user.password}`,
      expire: MOMENT().add(30, "m").format("YYYY-MM-DD  HH:mm:ss.000"),
      sess: user_browser_json,
    })
      .then(() => {
        return {
          type: "success",
          user: user,
        };
      })
      .catch((err) => {
        console.log(err);
        return {
          type: "error",
          error: err,
        };
      });
  }
 */
