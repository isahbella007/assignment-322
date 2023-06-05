const puppeteer = require("puppeteer");
const fs = require('fs')

// get links
async function scrapData() {
  const browser = await puppeteer.launch({headless: false,defaultViewport: null});
  const page = await browser.newPage();
  await page.goto("https://www.mayoclinic.org/appointments/find-a-doctor/search-results?lastInitial=A&page=5",{ waitUntil: "networkidle0" }
);

    const data = await page.evaluate(() => {
    const results = [];

    const items = document.querySelectorAll('ol.result-items > li');
    items.forEach((item) => {
      const image = item.querySelector('img')?.src || null;
      const name = item.querySelector('h4 > a')?.innerText || null;
      const link = item.querySelector('h4 > a')?.href || null;
      const specialities = Array.from(item.querySelectorAll('ol.speciality > li')).map((li) => li.innerText);
      const location = item.querySelector('ol.location > li')?.innerText || null;
      const areasOfFocusElement = item.querySelector('.ellipsis-container');
      let areasOfFocus = null;

      if (areasOfFocusElement) {
        const showHideContentDiv = areasOfFocusElement.querySelector('.show-hide-content');
        if (showHideContentDiv) {
          const paragraphs = Array.from(showHideContentDiv.querySelectorAll('p'));
          areasOfFocus = paragraphs.map((p) => p.innerText).join(', ');
        } else {
          const p = areasOfFocusElement.querySelector('p');
          if (p) {
            areasOfFocus = p.innerText;
          }
        }
      }

      results.push({
        doctorImage: image,
        doctorName: name,
        doctorLink: link,
        doctorSpeciality: specialities,
        doctorLocation: location,
        doctorAOF: areasOfFocus,
      });
    });

    return results;
  });

  console.log(data);
  fs.writeFile("mayoDoctors_5.json", JSON.stringify(data, null, 2), (error) => { 
    if(error){ 
        console.log("Problem dey o")
        return
    }
  })
}
scrapData();

