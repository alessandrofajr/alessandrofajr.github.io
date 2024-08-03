module.exports = function(eleventyConfig) {
    eleventyConfig.addFilter('date', function(date, format) {
      const dateObj = new Date(date);
      return formatDate(dateObj, format);
    });
  };
  
  function formatDate(date, format) {

    date.setHours(date.getHours() + 3);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    
    switch (format) {
      case 'YYYY-MM-DD':
        return `${year}-${month}-${day}`;
      default:
        return `${year}-${month}-${day}`;
    }
  }
  