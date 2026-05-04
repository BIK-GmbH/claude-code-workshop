import { chromium } from "@playwright/test";

const URL = "https://didactic-broccoli-k5o2omq.pages.github.io/claude-code-workshop/";

const browser = await chromium.launch();
const page = await browser.newPage({ locale: "de-DE" });

const errors = [];
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));
page.on("console", (m) => {
  if (m.type() === "error") errors.push(`console: ${m.text()}`);
});
page.on("requestfailed", (r) =>
  errors.push(`requestfailed: ${r.url()} — ${r.failure()?.errorText}`),
);

await page.goto(URL, { waitUntil: "networkidle" });

const bodyText = await page.locator("body").textContent();

console.log({
  url: page.url(),
  title: await page.title(),
  bodyTextSnippet: bodyText?.slice(0, 200),
  errors,
});

await page.screenshot({ path: "/tmp/live-debug.png", fullPage: true });
await browser.close();
