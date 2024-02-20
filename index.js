const puppeteer = require("puppeteer");
const { regionList, selectorList } = require("./config.json");
var fs = require("fs");

(async () => {
    const url = process.argv[2];
    const region = process.argv[3];
    const id = process.argv[4] ? process.argv[4] : "";
    let savePath = "./results/" + region;
    fs.mkdir(savePath, { recursive: true }, (err) => {
        if (err) throw err;
    });
    savePath += "/" + (id ? id + "_" : "");

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.setViewport({
        width: 1280,
        height: 740,
        deviceScaleFactor: 1
    });

    // Выбор региона
    const { regionId } = regionList.find(({ name }) => name === region);
    await page.setCookie({
        name: "region",
        value: regionId.toString(),
        domain: "www.vprok.ru"
    });

    await page.goto(url, { waitUntil: "networkidle2" });

    await page.waitForNavigation({
        waitUntil: "networkidle0"
    });

    // Скриншот страницы
    await page.screenshot({
        path: savePath + "screenshot.jpg",
        type: "jpeg",
        fullPage: "true"
    });

    // Сбор информации о товаре
    let output = "";
    for (const selector of selectorList) {
        const element = await page.$(selector.value);
        if (element !== null) {
            const value = await page.evaluate((el) => el.innerText, element);
            output += selector.name + "=" + value.split(" ")[0] + "\n";
        }
    }

    // Запись в файл
    await fs.promises.writeFile(savePath + "product.txt", output);

    await browser.close();
})();
