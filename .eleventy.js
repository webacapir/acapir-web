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

  // Filtro de fecha
  eleventyConfig.addFilter("dataFormat", function(date) {
    if (!date) return "";
    const d = new Date(date);
    const mesos = ["gen","feb","mar","abr","mai","jun","jul","ago","set","oct","nov","des"];
    return mesos[d.getMonth()] + " " + d.getFullYear();
  });

  // Noticias ordenadas por fecha descendente
  eleventyConfig.addCollection("noticias", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/noticias/*.md")
      .filter(item => !item.data.esborrany)
      .sort((a, b) => b.date - a.date);
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
