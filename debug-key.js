require("dotenv").config();
const jwt = require("jsonwebtoken");

const appId = process.env.GITHUB_APP_ID;
const key = process.env.GITHUB_APP_PRIVATE_KEY.replace(/\\n/g, "\n");

const now = Math.floor(Date.now() / 1000);
const payload = {
  iat: now - 60,       // backdate 60s for clock drift, GitHub recommends this
  exp: now + 600,      // 10 min max
  iss: Number(appId),  // must be a number
};

const token = jwt.sign(payload, key, { algorithm: "RS256" });

console.log("Generated JWT:", token);
console.log("Decoded payload:", jwt.decode(token));

// Now hit GitHub directly, no Octokit involved
fetch("https://api.github.com/app", {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  },
})
  .then(async (res) => {
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
  });