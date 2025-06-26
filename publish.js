const fs = require("fs");
const path = require("path");
const axios = require("axios");
const showdown = require("showdown");
const { wpUrl, username, password } = require("./config");

// ✅ 1. Get latest .md file from /posts folder
const postsDir = path.join(__dirname, "posts");
const mdFiles = fs.readdirSync(postsDir)
  .filter(file => file.endsWith(".md"))
  .map(file => ({
    file,
    time: fs.statSync(path.join(postsDir, file)).mtime.getTime()
  }))
  .sort((a, b) => b.time - a.time); // sort by latest modified

if (mdFiles.length === 0) {
  console.log("❌ No markdown files found in /posts");
  process.exit(1);
}

const latestFile = mdFiles[0].file;
const filePath = path.join(postsDir, latestFile);
const markdown = fs.readFileSync(filePath, "utf-8");

// ✅ 2. Convert to HTML using showdown
const converter = new showdown.Converter();
const html = converter.makeHtml(markdown);

// ✅ 3. Generate title from file name
const fileName = path.basename(latestFile, ".md");
const title = fileName
  .split("-")
  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  .join(" ");

// ✅ 4. Prepare post data
const postData = {
  title,
  content: html,
  status: "publish",
  date: new Date().toISOString()
};

// ✅ 5. Send POST request to WP REST API
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
