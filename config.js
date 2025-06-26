require("dotenv").config();

module.exports = {
  username: process.env.WP_USER,
  password: process.env.WP_PASS,
  wpUrl: process.env.WP_URL,
};
