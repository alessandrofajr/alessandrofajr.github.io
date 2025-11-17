/**
 * DailyContentManager - Core class for managing daily content selection
 * Handles Brazilian timezone calculations and deterministic random selection
 */
class DailyContentManager {
  constructor(quotesData, linksData) {
    this.quotesData = quotesData || [];
    this.linksData = linksData || [];
  }

  /**
   * Get daily quote for the current Brazilian date
   * @returns {Object|null} Selected quote object or null if no data
   */
  getDailyQuote() {
    const brazilianDate = this.getBrazilianDate();
    const seed = this.generateSeed(brazilianDate);
  
    const selectedQuoteObj = this.selectRandomItem(this.quotesData, seed);
    if (!selectedQuoteObj) return null;
  
    const innerQuote = this.selectInnerQuote(selectedQuoteObj, seed);
  
    return {
      ...selectedQuoteObj,
      selectedQuote: innerQuote
    };
  }

  /**
   * Get daily link for the current Brazilian date
   * @returns {Object|null} Selected link object or null if no data
   */
  getDailyLink() {
    const brazilianDate = this.getBrazilianDate();
    return this.selectRandomItem(this.linksData, this.generateSeed(brazilianDate));
  }

  /**
   * Calculate current date in Brazilian timezone (GMT-3)
   * @returns {Date} Date object adjusted for Brazilian timezone
   */
  getBrazilianDate() {
    const now = new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const brazilianTime = new Date(utc + (-3 * 3600000)); // GMT-3
    return brazilianTime;
  }

  /**
   * Generate deterministic seed based on date
   * @param {Date} date - Date to generate seed from
   * @returns {number} Numeric seed for random selection
   */
  generateSeed(date) {
    const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  /**
   * Select random item from array using deterministic seed
   * @param {Array} items - Array of items to select from
   * @param {number} seed - Seed for deterministic selection
   * @returns {Object|null} Selected item or null if array is empty
   */
  selectRandomItem(items, seed) {
    if (!Array.isArray(items) || items.length === 0) {
      return null;
    }
    
    const index = seed % items.length;
    return items[index];
  }
  /**
   * Selects either the main quote or one of its additionalQuotes
   * using a deterministic inner seed
   * @param {Object} quoteObj
   * @param {number} seed
   * @returns {string} The selected quote text
   */
  selectInnerQuote(quoteObj, seed) {
    const pool = [];

    // Always include main quote
    if (quoteObj.quote) {
      pool.push(quoteObj.quote);
    }

    // Include additional quotes if present
    if (Array.isArray(quoteObj.additionalQuotes) && quoteObj.additionalQuotes.length > 0) {
      for (const aq of quoteObj.additionalQuotes) {
        if (aq && aq.quote) {
          pool.push(aq.quote);
        }
      }
    }

    // Create a stable inner seed
    const idComponent = quoteObj.id ? Number(quoteObj.id) : 0;
    const innerSeed = (seed * 31 + idComponent) >>> 0;

    const index = innerSeed % pool.length;
    return pool[index];
  }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DailyContentManager;
} else if (typeof window !== 'undefined') {
  window.DailyContentManager = DailyContentManager;
}