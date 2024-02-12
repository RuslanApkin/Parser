const puppeteer = require("puppeteer");

(async () => {
    const url = process.argv[2];
    const region = process.argv[3];

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
    });
    await page.goto(url, { waitUntil: "networkidle2" });

    // Скриншот страницы
    await page.screenshot({
        path: "screenshot.jpg",
        type: "jpeg",
        fullPage: "true"
    });

    await browser.close();
})();
