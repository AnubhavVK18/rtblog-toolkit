const fs = require("fs");
const path = require("path");
const axios = require("axios");
const showdown = require("showdown");
const { wpUrl, username, password } = require("./config");

const filePath = path.join(__dirname, "posts", "hello-world.md");
const markdown = fs.readFileSync(filePath, "utf-8");
const converter = new showdown.Converter();
const html = converter.makeHtml(markdown);

const postData = {
  title: "Hello from Markdown!",
  content: html,
  status: "publish",
};

axios
  .post(`${wpUrl}/wp-json/wp/v2/posts`, postData, {
    auth: { username, password },
  })
  .then((res) => {
    console.log("✅ Post published successfully!");
    console.log("🔗", res.data.link);
  })
  .catch((err) => {
    console.error("❌ Failed to publish:", err.response?.data || err.message);
  });
