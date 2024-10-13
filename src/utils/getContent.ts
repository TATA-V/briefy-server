import { JSDOM } from 'jsdom';

export const getContentFromArticle = ({ html }: { html: string }) => {
  const dom = new JSDOM(html);
  const document = dom.window.document;

  const textElement: HTMLDivElement | null = document.querySelector('._article_content, #article-view-content-div');

  if (textElement !== null) {
    return textElement.textContent;
  } else return null;
};
