const fs = require("fs");
const path = require("path");

const distDir = path.resolve(__dirname, "..", "dist");
const indexPath = path.join(distDir, "index.html");
const notFoundPath = path.join(distDir, "404.html");
const redirectsPath = path.join(distDir, "_redirects");

function fail(message) {
  console.error(`[postbuild-web] ${message}`);
  process.exit(1);
}

if (!fs.existsSync(distDir)) {
  fail("dist directory was not generated. Check Expo web export output.");
}

if (!fs.existsSync(indexPath)) {
  fail("dist/index.html was not generated. EdgeOne Pages needs dist as the output directory.");
}

fs.copyFileSync(indexPath, notFoundPath);
fs.writeFileSync(
  redirectsPath,
  [
    "/_expo/* /_expo/:splat 200",
    "/assets/* /assets/:splat 200",
    "/favicon.ico /favicon.ico 200",
    "/* /index.html 200",
    ""
  ].join("\n"),
  "utf8"
);

console.log("[postbuild-web] verified dist/index.html");
console.log("[postbuild-web] wrote dist/404.html");
console.log("[postbuild-web] wrote dist/_redirects");
