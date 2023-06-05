const puppeteer = require("puppeteer");
const fs = require('fs')
async function scrapePage(url, page) {
    // await page.setExtraHTTPHeaders({
    //     'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36',
    //   });
  await page.goto(url, { waitUntil: "networkidle0" });
  const doctorContainer = await page.$$(".doctor-container");
  let doctorDetails = [];

  for (const doctorTag of doctorContainer) {
    const getName = await doctorTag.$$("span a");
    const getAddress = await doctorTag.$(".doctor-address");
    const getImage = await doctorTag.$$("span img");

    const name = await page.evaluate((el) => el.textContent.trim(), getName[0]);
    const field = await page.evaluate(
      (el) => el.textContent.trim(),
      getName[1]
    );
    const getLink = await page.evaluate(
      (el) => el.getAttribute("href"),
      getName[0]
    );

    const address = await page.evaluate((el) => {
      if (el !== null) {
        const innerHTML = el.innerHTML.trim();
        return innerHTML !== "" ? innerHTML : "Address Not Stated";
      }
      return "Address Not Stated";
    }, getAddress);

    const image = await page.evaluate(
      (el) => el.getAttribute("src"),
      getImage[0]
    );

    doctorDetails.push({
        doctorImage: image,
      doctorName: name,
      doctorLink: `https://www.ratemds.com${getLink}`,
      doctorSpeciality: field,
      doctorLocation: address,
      doctorAOF: "not mentioned"
    });
  }
  return doctorDetails;
};

function delay(ms){ 
    return new Promise((resolve) => setTimeout(resolve, ms))
}
async function main() {
    const browser = await puppeteer.launch({headless: false,defaultViewport: null});
    const page = await browser.newPage();


    const data = await scrapePage('https://www.ratemds.com/best-doctors/?page=3', page);
    await delay(5000)


    console.log(data)

    fs.writeFile("ratemds_3.json", JSON.stringify(data, null, 2), (error) => { 
        if(error){ 
            console.log("Problem dey o")
            return
        }
    })
}
main();
