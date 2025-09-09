export function resolveCreditsPath(credits: any, basePath: string) {
  if (!credits || !credits.credit) return credits;

  const parser = new DOMParser();
  const doc = parser.parseFromString(credits.credit, "text/html");

  // Helper to resolve src attributes for any tag
  const resolveSrcForTag = (tag: string, attr: string = "src") => {
    doc.querySelectorAll(tag).forEach(el => {
      const src = el.getAttribute(attr);
      if (src) {
        el.setAttribute(attr, new URL(src, `${window.location.origin}${basePath}/`).href);
      }
    });
  };

  // Extendable: resolve src for <img>, <video>, <audio>, etc.
  ["img"].forEach(tag => resolveSrcForTag(tag));

  credits.credit = doc.body.innerHTML;
  return credits;
}