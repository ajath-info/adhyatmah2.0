const { getUser: getUserHelper } = require("../utils/getUser-util");

const getUser = async (req, res, next) => {
  try {
    const user = await getUserHelper(req, false); // Don't require email verification for profile access
    req.userData = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: error.message || "Unauthorized",
    });
  }
};

module.exports = { getUser };
