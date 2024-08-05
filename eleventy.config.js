const filters = require('./filters');
const pluginRss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/styles.css");

  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  eleventyConfig.addPassthroughCopy("src/CNAME");

  eleventyConfig.addCollection("blog", function(collection) {
    return collection.getFilteredByGlob("src/blog/*.md").filter(function(item) {
      return !item.inputPath.endsWith("index.md");
    });
  });

  eleventyConfig.addCollection("links", function() {
    const links = require("./src/_data/links.json");
    return links;
  });  

  eleventyConfig.addCollection("quotes", function() {
    const quotes = require("./src/_data/quotes.json");
    return quotes;
  });

  eleventyConfig.addPlugin(filters);

  eleventyConfig.addPlugin(pluginRss);

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts",
      output: "docs"
    }
  };
};