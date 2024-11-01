import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

async function fetchFullHTML(url: string): Promise<string> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  const html = await page.content();
  await browser.close();
  return html;
}

export const extractArticleInfo = async ({ url }: { url: string }) => {
  const html = await fetchFullHTML(url);
  if (!html) return;
  const $ = cheerio.load(html);
  const reporters: string[] = [];
  const images: string[] = [];
  const alts: string[] = [];

  const content = $('._article_content, #article-view-content-div, .wikitree_content, .news_bm, #dic_area').text().trim();
  const reporterText = $('.name, .reporter, .journalist, .author, em').text().trim();
  const reporterMatch = reporterText.match(/([가-힣]+ 기자)/);
  if (reporterMatch && reporterMatch.length > 0) {
    reporterMatch.forEach((name) => {
      if (!reporters.includes(name)) {
        reporters.push(name);
      }
    });
  }
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    const alt = $(el).attr('alt');
    images.push(src);
    alts.push(alt);
  });
  const baseUrl = new URL(url).origin;
  const thumbnails = images.map((img) => (img.startsWith('http') ? img : `${baseUrl}${img}`));
  const thumbnail = thumbnails.length > 1 ? thumbnails[1] : thumbnails[0];
  const company = alts[0] ? alts[0] : null;

  return { content, thumbnail, company, reporters };
};
