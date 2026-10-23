// Turns a YouTube / Vimeo link into a player URL. Unlisted Vimeo links
// (vimeo.com/123/abc) keep their hash so they still play.
export function embedUrl(url) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-z0-9]+))?/i);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}?${vm[2] ? `h=${vm[2]}&` : ''}dnt=1`;
  return url;
}

export const isVideoUrl = (url) => /youtube\.com|youtu\.be|vimeo\.com/.test(url);

export function embedHtml(url, title = 'Video') {
  return `<figure class="embed"><iframe src="${embedUrl(url)}" title="${title}" loading="lazy" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe></figure>`;
}
