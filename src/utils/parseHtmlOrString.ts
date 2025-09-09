export const parseHtmlOrString = (value: string, basePath: string): string => {
  if (!value) return "";

  const parser = new DOMParser();
  const doc = parser.parseFromString(value, "text/html");

  if (!doc.body.innerHTML.trim()) return value;

  // Tags to resolve src for
  const tags = ["img", "video", "audio"];
  const resolveSrc = (el: Element, attr: string) => {
    const src = el.getAttribute(attr);
    if (src) {
      el.setAttribute(
        attr,
        new URL(src, `${window.location.origin}${basePath}/`).href
      );
    }
  };

  tags.forEach(tag => {
    doc.querySelectorAll(tag).forEach(el => {
      resolveSrc(el, "src");
      el.querySelectorAll("source").forEach(source => {
        resolveSrc(source, "src");
      });
    });
  });

  return doc.body.innerHTML;
};