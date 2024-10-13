interface GetImageFromArticle {
  html: string;
  link: string;
}

export const getImageFromArticle = ({ html, link }: GetImageFromArticle) => {
  const regex = /<img[^>]+src=["']([^"']+)["']/g;
  const images: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(html)) !== null) {
    images.push(match[1]);
  }
  const filteredImages = images.filter((img) => img.includes('photo' || 'content' || 'upload'));
  const baseUrl = new URL(link).origin;
  const formattedImages = filteredImages.map((img) => (img.startsWith('http') ? img : `${baseUrl}${img}`));

  return formattedImages.length > 0 ? formattedImages[0] : [images[1]];
};
