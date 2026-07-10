#!/usr/bin/env node
const res = await fetch("https://www.destinyhomehk.com");
const html = await res.text();

console.log("G-9785R0BX68 in HTML:", html.includes("G-9785R0BX68"));
console.log("gtag/js preload:", html.includes("gtag/js?id=G-9785R0BX68"));
console.log("inline gtag config:", /gtag\('config',\s*'G-9785R0BX68'\)/.test(html));
console.log("async gtag script tag:", /<script async src="https:\/\/www.googletagmanager.com\/gtag\/js\?id=G-9785R0BX68"/.test(html));
console.log("dataLayer in HTML:", html.includes("dataLayer"));

const gaRes = await fetch(
  "https://www.googletagmanager.com/gtag/js?id=G-9785R0BX68",
);
console.log("\ngtag.js status:", gaRes.status, "bytes:", (await gaRes.text()).length);
