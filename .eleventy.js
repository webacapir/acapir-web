const markdownIt = require("markdown-it");
const md = markdownIt({ html: false, breaks: true, linkify: true });
const defaultLinkOpen = md.renderer.rules.link_open || function(tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options);
};
md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
  const href = tokens[idx].attrGet("href") || "";
  if (/^https?:\/\//.test(href)) {
    tokens[idx].attrSet("target", "_blank");
    tokens[idx].attrSet("rel", "noopener");
  }
  return defaultLinkOpen(tokens, idx, options, env, self);
};

module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");
  eleventyConfig.addPassthroughCopy("src/assets/favicon.svg");

  // Filtre linkify: converteix URLs en text a enllaços clicables
  eleventyConfig.addFilter("linkify", function(text) {
    if (!text) return "";
    var escaped = String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return escaped.replace(/(https?:\/\/[^\s<]+)/g,
      '<a href="$1" target="_blank" rel="noopener" style="color:#4ADDD5;word-break:break-all;">$1</a>');
  });

  // Filtre md: text del panel (Markdown) a HTML amb paràgrafs, negretes, llistes i enllaços
  eleventyConfig.addFilter("md", function(text) {
    if (!text) return "";
    const clean = String(text).replace(/^[ \t]{4,}(?![-*+] |\d+[.)] )/gm, "");
    return md.render(clean);
  });

  // Filtro de fecha
  eleventyConfig.addFilter("dataFormat", function(date) {
    if (!date) return "";
    const d = new Date(date);
    const mesos = ["gen","feb","mar","abr","mai","jun","jul","ago","set","oct","nov","des"];
    return mesos[d.getMonth()] + " " + d.getFullYear();
  });

  // Notícies per data descendent; la marcada com a "destacada" (la més recent si n'hi ha diverses) va al davant
  eleventyConfig.addCollection("noticias", function(collectionApi) {
    const items = collectionApi.getFilteredByGlob("src/noticias/*.md")
      .filter(item => !item.data.esborrany)
      .sort((a, b) => b.date - a.date);
    const i = items.findIndex(item => item.data.destacada);
    if (i > 0) items.unshift(items.splice(i, 1)[0]);
    return items;
  });

  // Recursos ordenados por fecha descendente
  eleventyConfig.addCollection("recursos", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/recursos/*.md")
      .filter(item => !item.data.esborrany)
      .sort((a, b) => b.date - a.date);
  });

  // Arxiu de formació
  eleventyConfig.addCollection("formacio", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/formacio/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Documents institucionals
  eleventyConfig.addCollection("documents", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/documents/*.md")
      .filter(item => !item.data.esborrany)
      .sort((a, b) => b.date - a.date);
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes"
    }
  };
};
