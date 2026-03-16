/**
 * Daily Components - Componentes de UI para renderizar a citação e o link do dia
 */

/**
 * DailyQuoteComponent - Responsável por renderizar a citação do dia
 */
class DailyQuoteComponent {
  static WORD_LIMIT = 100;

  constructor(container, contentManager) {
    this.container = container;
    this.contentManager = contentManager;
  }

  /**
   * Renderiza o componente de citação do dia
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
      console.error('Erro ao renderizar a citação do dia:', error);
      this.renderFallback('Erro ao carregar citação');
    }
  }

  /**
   * Gera o HTML para exibir a citação
   * @param {Object} quote - Objeto da citação vindo dos dados
   * @returns {string} HTML da citação
   */
  generateQuoteHTML(quote) {
    const quoteUrl = this.generateQuoteURL(quote);
    const { text, truncated } = this.truncateQuote(quote.selectedQuote || 'Citação não disponível');
    const quoteText = this.escapeHtml(text);
    const author = quote.author ? this.escapeHtml(quote.author) : '';
    const continuation = truncated ? ' <span class="daily-quote__more">... ler mais</span>' : '';
    
    return `
      <div class="daily-quote">
        <div class="daily-quote__label">citação do dia</div>
        <p class="daily-quote__text">
          <a href="${quoteUrl}" class="daily-quote__link">${quoteText}${continuation}</a>
        </p>
        ${author ? `<p class="daily-quote__author">— ${author}</p>` : ''}
      </div>
    `;
  }

  /**
   * Limita a citação por quantidade de palavras para evitar cortes no meio de palavras
   * @param {string} quoteText
   * @returns {{ text: string, truncated: boolean }}
   */
  truncateQuote(quoteText) {
    const normalizedText = typeof quoteText === 'string' ? quoteText.trim() : '';
    const words = normalizedText ? normalizedText.split(/\s+/) : [];

    if (words.length <= DailyQuoteComponent.WORD_LIMIT) {
      return {
        text: normalizedText,
        truncated: false
      };
    }

    return {
      text: words.slice(0, DailyQuoteComponent.WORD_LIMIT).join(' '),
      truncated: true
    };
  }

  /**
   * Gera a URL para a página da citação
   * @param {Object} quote - Objeto da citação
   * @returns {string} Caminho da URL para a página da citação
   */
  generateQuoteURL(quote) {
    if (!quote.title) return '/quotes/';
    
    // Lógica de slugify aprimorada para combinar com o comportamento do 11ty
    const slug = quote.title
      .toLowerCase()
      // Normaliza caracteres acentuados
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacríticos
      // Substitui travessões/em-dashes por hífens
      .replace(/[–—]/g, '-')
      // Remove caracteres especiais, mantendo letras, números, espaços e hífens
      .replace(/[^a-z0-9\s-]/g, '')
      // Substitui múltiplos espaços/hífens por um único hífen
      .replace(/[\s-]+/g, '-')
      // Remove hífens no começo/fim
      .replace(/^-+|-+$/g, '');
    
    const anchor = quote.selectedQuoteAnchor ? `#${quote.selectedQuoteAnchor}` : '';

    return `/quotes/${slug}/${anchor}`;
  }

  /**
   * Renderiza mensagem de fallback
   * @param {string} message - Mensagem a ser exibida
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
   * Faz escape de HTML para evitar XSS
   * @param {string} text - Texto a ser tratado
   * @returns {string} Texto com escape aplicado
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

/**
 * DailyLinkComponent - Responsável por renderizar o link do dia
 */
class DailyLinkComponent {
  constructor(container, contentManager) {
    this.container = container;
    this.contentManager = contentManager;
  }

  /**
   * Renderiza o componente de link do dia
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
      console.error('Erro ao renderizar o link do dia:', error);
      this.renderFallback('Erro ao carregar link');
    }
  }

  /**
   * Gera o HTML para exibir o link
   * @param {Object} link - Objeto do link vindo dos dados
   * @returns {string} HTML do link
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
   * Renderiza mensagem de fallback
   * @param {string} message - Mensagem a ser exibida
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
   * Faz escape de HTML para evitar XSS
   * @param {string} text - Texto a ser tratado
   * @returns {string} Texto com escape aplicado
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Exporta para CommonJS e ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DailyQuoteComponent, DailyLinkComponent };
} else if (typeof window !== 'undefined') {
  window.DailyQuoteComponent = DailyQuoteComponent;
  window.DailyLinkComponent = DailyLinkComponent;
}
