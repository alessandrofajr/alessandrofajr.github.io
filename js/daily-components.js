/**
 * Daily Components - UI components for rendering daily quote and link
 */

/**
 * DailyQuoteComponent - Handles rendering of daily quote
 */
class DailyQuoteComponent {
  constructor(container, contentManager) {
    this.container = container;
    this.contentManager = contentManager;
  }

  /**
   * Render the daily quote component
   */
  render() {
    try {
      const quote = this.contentManager.getDailyQuote();
      
      if (!quote) {
        this.renderFallback('Vixe... Algo deu errado.');
        return;
      }

      const html = this.generateQuoteHTML(quote);
      this.container.innerHTML = html;
    } catch (error) {
      console.error('Error rendering daily quote:', error);
      this.renderFallback('Erro ao carregar citação');
    }
  }

  /**
   * Generate HTML for quote display
   * @param {Object} quote - Quote object from data
   * @returns {string} HTML string for quote
   */
  generateQuoteHTML(quote) {
    const quoteUrl = this.generateQuoteURL(quote);
    const quoteText = this.escapeHtml(quote.quote || 'Citação não disponível');
    const author = quote.author ? this.escapeHtml(quote.author) : '';
    
    return `
      <div class="daily-quote">
        <div class="daily-quote__label">citação do dia</div>
        <p class="daily-quote__text">
          <a href="${quoteUrl}" class="daily-quote__link">${quoteText}</a>
        </p>
        ${author ? `<p class="daily-quote__author">— ${author}</p>` : ''}
      </div>
    `;
  }

  /**
   * Generate URL for quote page
   * @param {Object} quote - Quote object
   * @returns {string} URL path to quote page
   */
  generateQuoteURL(quote) {
    if (!quote.title) return '/quotes/';
    
    // Improved slugify logic to match 11ty behavior
    const slug = quote.title
      .toLowerCase()
      // Normalize accented characters
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      // Replace em dashes and en dashes with regular hyphens
      .replace(/[–—]/g, '-')
      // Remove special characters but keep letters, numbers, spaces, and hyphens
      .replace(/[^a-z0-9\s-]/g, '')
      // Replace multiple spaces/hyphens with single hyphen
      .replace(/[\s-]+/g, '-')
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, '');
    
    return `/quotes/${slug}`;
  }

  /**
   * Render fallback message
   * @param {string} message - Fallback message to display
   */
  renderFallback(message) {
    this.container.innerHTML = `
      <div class="daily-quote daily-quote--fallback">
        <div class="daily-quote__label">citação do dia</div>
        <p class="daily-quote__fallback">${this.escapeHtml(message)}</p>
      </div>
    `;
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/**
 * DailyLinkComponent - Handles rendering of daily link
 */
class DailyLinkComponent {
  constructor(container, contentManager) {
    this.container = container;
    this.contentManager = contentManager;
  }

  /**
   * Render the daily link component
   */
  render() {
    try {
      const link = this.contentManager.getDailyLink();
      
      if (!link) {
        this.renderFallback('Vixe... Algo deu errado.');
        return;
      }

      const html = this.generateLinkHTML(link);
      this.container.innerHTML = html;
    } catch (error) {
      console.error('Error rendering daily link:', error);
      this.renderFallback('Erro ao carregar link');
    }
  }

  /**
   * Generate HTML for link display
   * @param {Object} link - Link object from data
   * @returns {string} HTML string for link
   */
  generateLinkHTML(link) {
    const title = this.escapeHtml(link.title || 'Sem título');
    const url = this.escapeHtml(link.link || '#');
    const notes = link.notes ? this.escapeHtml(link.notes) : '';
    
    return `
      <div class="daily-link">
        <div class="daily-link__label">link do dia</div>
        <h3 class="daily-link__title">
          <a href="${url}" 
             class="daily-link__link" 
             target="_blank" 
             rel="noopener noreferrer">${title}</a>
        </h3>
        ${notes ? `<p class="daily-link__notes">${notes}</p>` : ''}
      </div>
    `;
  }

  /**
   * Render fallback message
   * @param {string} message - Fallback message to display
   */
  renderFallback(message) {
    this.container.innerHTML = `
      <div class="daily-link daily-link--fallback">
        <div class="daily-link__label">link do dia</div>
        <p class="daily-link__fallback">${this.escapeHtml(message)}</p>
      </div>
    `;
  }

  /**
   * Escape HTML to prevent XSS
   * @param {string} text - Text to escape
   * @returns {string} Escaped text
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Export for both CommonJS and ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DailyQuoteComponent, DailyLinkComponent };
} else if (typeof window !== 'undefined') {
  window.DailyQuoteComponent = DailyQuoteComponent;
  window.DailyLinkComponent = DailyLinkComponent;
}