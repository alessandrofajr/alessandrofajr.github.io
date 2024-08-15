const filters = require('./filters');
const pluginRss = require("@11ty/eleventy-plugin-rss");
const lodash = require("lodash");

module.exports = function(eleventyConfig) {

  eleventyConfig.addPassthroughCopy("src/styles.css");

  eleventyConfig.addPassthroughCopy("src/favicon.svg");

  eleventyConfig.addPassthroughCopy("src/img");

  eleventyConfig.addCollection("blog", function(collection) {
    return collection.getFilteredByGlob("src/blog/*.md").filter(function(item) {
      return !item.inputPath.endsWith("index.md");
    });
  });

  eleventyConfig.addCollection("drawer", function(collection) {
    return collection.getFilteredByGlob("src/drawer/*.md").filter(function(item) {
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

  eleventyConfig.addCollection("blogTagPagination", function(collection) {
    let tagSet = new Set();
    collection.getAllSorted().map(function(item) {
        if ("tags" in item.data) {
            let tags = item.data.tags;
            for (let tag of tags) {
                tagSet.add(tag);
            }
        }
    });

    let paginationSize = 10;
    let tagMap = [];
    let tagArray = [...tagSet];
    
    for (let tagName of tagArray) {
        let tagItems = collection.getFilteredByTag(tagName);
        let pagedItems = lodash.chunk(tagItems.reverse(), paginationSize);

        let pagesSlugs = [];
        for (let i = 0; i < pagedItems.length; i++) {
            let pageSlug = i > 0 ? `${tagName}/${i + 1}` : `${tagName}`;
            pagesSlugs.push(pageSlug);
        }

        for (let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
            tagMap.push({
                title: tagName,
                tagName: tagName,
                slug: pagesSlugs[pageNumber], 
                pageNumber: pageNumber,
                totalPages: pagesSlugs.length,
                pageSlugs: {
                    all: pagesSlugs,
                    next: pagesSlugs[pageNumber + 1] || null,
                    previous: pagesSlugs[pageNumber - 1] || null,
                    first: pagesSlugs[0] || null,
                    last: pagesSlugs[pagesSlugs.length - 1] || null,
                },
                pageData: pagedItems[pageNumber]
            });
        }
    }

    return tagMap;
  });

  eleventyConfig.addCollection("linkTagPagination", function() {
    const links = require("./src/_data/links.json");

    let tagSet = new Set();
    links.forEach(link => {
        if (Array.isArray(link.tags)) {
            let tags = link.tags;
            for (let tag of tags) {
                tagSet.add(tag);
            }
        }
    });

    let paginationSize = 20;
    let tagMap = [];
    let tagArray = [...tagSet];
    
    for (let tagName of tagArray) {
        let tagItems = links.filter(link => link.tags && link.tags.includes(tagName));
        let pagedItems = lodash.chunk(tagItems.reverse(), paginationSize);

        let pagesSlugs = [];
        for (let i = 0; i < pagedItems.length; i++) {
            let pageSlug = i > 0 ? `${tagName}/${i + 1}` : `${tagName}`;
            pagesSlugs.push(pageSlug);
        }

        for (let pageNumber = 0, max = pagedItems.length; pageNumber < max; pageNumber++) {
            tagMap.push({
                title: tagName,
                tagName: tagName,
                slug: pagesSlugs[pageNumber], 
                pageNumber: pageNumber,
                totalPages: pagesSlugs.length,
                pageSlugs: {
                    all: pagesSlugs,
                    next: pagesSlugs[pageNumber + 1] || null,
                    previous: pagesSlugs[pageNumber - 1] || null,
                    first: pagesSlugs[0] || null,
                    last: pagesSlugs[pagesSlugs.length - 1] || null,
                },
                pageData: pagedItems[pageNumber]
            });
        }
    }

    return tagMap;
  });

  eleventyConfig.addPlugin(filters);

  eleventyConfig.addPlugin(pluginRss);

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts",
      output: "_site"
    }
  };
};