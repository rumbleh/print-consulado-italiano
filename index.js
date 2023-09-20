import puppeteer from 'puppeteer';
import env from 'dotenv';
import desktopscreen from 'screenshot-desktop';
import fs from 'fs';

env.config();
const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

// verifica se a pasta prints existe
if (!fs.existsSync('prints')) {
  fs.mkdirSync('prints');
}

(async () => {

  const browser = await puppeteer.launch(
    {
      headless: false,
      slowMo: 10,
      executablePath: 'c:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
      args: [
        '--user-data-dir=c:\\temp\\',
        '--start-maximized',
        '--disable-infobars',
        '--disable-extensions',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--no-first-run',

      ],
      ignoreDefaultArgs: [
        '--enable-automation',
        '--enable-blink-features=IdleDetection'
      ],
    }
  );

  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  await page.setViewport({ width: 1920, height: 1080 });
  await page.goto(process.env.home, { waitUntil: 'networkidle2' });

  await page.waitForSelector('#login-email');
  await page.type('#login-email', process.env.email);
  await page.type('#login-password', process.env.password);

  await page.click('#login-form > button');

  // Aguarda o elemento #advanced
  await page.waitForSelector('#advanced');

  // Clica no elemento #advanced
  await page.click('#advanced');


  // Aguarda o elemento #dataTableServices > tbody > tr.even > td:nth-child(4) > a
  var link = await page.waitForSelector('#dataTableServices > tbody > tr.even > td:nth-child(4) > a');

  // Clica no link
  await link.click();

  // verifica se o elemento 'body > div.jconfirm.jconfirm-light.jconfirm-open > div.jconfirm-scrollpane > div > div > div > div > div > div > div' existe na página
  var element = await page.waitForSelector('body > div.jconfirm.jconfirm-light.jconfirm-open > div.jconfirm-scrollpane > div > div > div > div > div > div > div');
  if (element) {
    desktopscreen().then((img) => {
      // pega o dia atual no formato dd
      const day = new Date().getDate();

      // pega o mes atual no formato mm
      const month = new Date().getMonth() + 1;

      // pega o ano atual no formato yyyy
      const year = new Date().getFullYear();


      // salva o print na pasta prints
      fs.writeFileSync(`prints/${year}-${month}-${day}.png`, img);

    });

    await delay(5000);
    await browser.close();
    return;
  }
})();
