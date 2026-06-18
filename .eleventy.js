module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Filtro de fecha
  eleventyConfig.addFilter("dataFormat", function(date) {
    if (!date) return "";
    const d = new Date(date);
    const mesos = ["gen","feb","mar","abr","mai","jun","jul","ago","set","oct","nov","des"];
    return mesos[d.getMonth()] + " " + d.getFullYear();
  });

  // Ordenar noticias por fecha descendente
  eleventyConfig.addCollection("noticias", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/noticias/*.md")
      .sort((a, b) => b.date - a.date);
  });

  // Ordenar recursos por fecha descendente
  eleventyConfig.addCollection("recursos", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/recursos/*.md")
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
