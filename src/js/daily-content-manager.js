/**
 * DailyContentManager - Classe principal para gerenciar a seleção diária de conteúdo
 * Lida com cálculos de fuso horário brasileiro e seleção aleatória determinística
 */
class DailyContentManager {
  constructor(quotesData, linksData) {
    this.quotesData = quotesData || [];
    this.linksData = linksData || [];
  }

  /**
   * Obtém a citação diária para a data atual no Brasil
   * @returns {Object|null} Objeto da citação selecionada ou null se não houver dados
   */
  getDailyQuote() {
    const brazilianDateKey = this.getBrazilianDateKey();
    return this.selectDailyQuoteByDateKey(brazilianDateKey);
  }

  /**
   * Obtém o link diário para a data atual no Brasil
   * @returns {Object|null} Objeto do link selecionado ou null se não houver dados
   */
  getDailyLink() {
    const brazilianDateKey = this.getBrazilianDateKey();
    return this.selectRandomItem(this.linksData, `${brazilianDateKey}:link`);
  }

  /**
   * Obtém a data atual no fuso de Brasília em formato YYYY-MM-DD
   * @returns {string} Data formatada para seed diária
   */
  getBrazilianDateKey() {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Sao_Paulo',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(new Date());
  }

  /**
   * Gera uma seed determinística baseada em uma string
   * @param {string} seedInput
   * @returns {number} Seed numérica para seleção aleatória
   */
  generateSeed(seedInput) {
    let hash = 2166136261;

    for (let i = 0; i < seedInput.length; i++) {
      hash ^= seedInput.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    return hash >>> 0;
  }

  /**
   * Gera um PRNG determinístico a partir de uma seed de 32 bits
   * @param {number} seed
   * @returns {Function} Função que retorna um número entre 0 e 1
   */
  createPRNG(seed) {
    let state = seed >>> 0;

    return function() {
      state += 0x6D2B79F5;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * Seleciona um item aleatório do array usando uma seed determinística
   * @param {Array} items - Array de itens para selecionar
   * @param {string} seedInput - Texto-base para seed determinística
   * @returns {Object|null} Item selecionado ou null se o array estiver vazio
   */
  selectRandomItem(items, seedInput) {
    if (!Array.isArray(items) || items.length === 0) {
      return null;  // Se não tem itens, retorna nada
    }

    const random = this.createPRNG(this.generateSeed(seedInput));
    const index = Math.floor(random() * items.length);

    return items[index];
  }

  /**
   * Seleciona a citação diária usando peso igual por página e evitando repetição em dias seguidos
   * @param {string} dateKey - Data no formato YYYY-MM-DD
   * @returns {Object|null} Citação selecionada ou null
   */
  selectDailyQuoteByDateKey(dateKey) {
    const pages = this.buildQuotePages();

    if (pages.length === 0) {
      return null;
    }

    const previousDateKey = this.getPreviousBrazilianDateKey(dateKey);
    const previousPage = previousDateKey
      ? this.selectQuotePageForDate(previousDateKey, pages)
      : null;

    const selectedPage = this.selectQuotePageForDate(dateKey, pages, previousPage);

    if (!selectedPage) {
      return null;
    }

    return this.selectRandomItem(selectedPage.quotes, `${dateKey}:quote:item:${selectedPage.pageKey}`);
  }

  /**
   * Monta a lista de páginas elegíveis, cada uma com sua própria lista de citações
   * @returns {Array<Object>} Páginas com metadados e citações já normalizadas
   */
  buildQuotePages() {
    const pages = [];

    for (const quoteObj of this.quotesData) {
      if (!quoteObj || typeof quoteObj !== 'object') {
        continue;
      }

      const quotes = this.extractQuotesFromPage(quoteObj);
      if (quotes.length === 0) {
        continue;
      }

      pages.push({
        pageKey: this.getQuotePageKey(quoteObj, pages.length),
        ...quoteObj,
        quotes
      });
    }

    return pages;
  }

  /**
   * Extrai as citações válidas de uma página
   * @param {Object} quoteObj
   * @returns {Array<Object>} Pool de citações da página
   */
  extractQuotesFromPage(quoteObj) {
    const pageQuotes = [];

    if (quoteObj.quote) {
      pageQuotes.push({
        ...quoteObj,
        selectedQuote: quoteObj.quote
      });
    }

    if (Array.isArray(quoteObj.additionalQuotes) && quoteObj.additionalQuotes.length > 0) {
      for (let index = 0; index < quoteObj.additionalQuotes.length; index++) {
        const aq = quoteObj.additionalQuotes[index];
        if (aq && aq.quote) {
          pageQuotes.push({
            ...quoteObj,
            selectedQuote: aq.quote,
            selectedQuoteAnchor: this.generateSubquoteAnchor(index)
          });
        }
      }
    }

    return pageQuotes;
  }

  /**
   * Seleciona a página da data, removendo a do dia anterior quando possível
   * @param {string} dateKey
   * @param {Array<Object>} pages
   * @param {Object|null} previousPage
   * @returns {Object|null}
   */
  selectQuotePageForDate(dateKey, pages, previousPage = null) {
    if (!Array.isArray(pages) || pages.length === 0) {
      return null;
    }

    let candidatePages = pages;

    if (previousPage && pages.length > 1) {
      const filteredPages = pages.filter((page) => page.pageKey !== previousPage.pageKey);
      if (filteredPages.length > 0) {
        candidatePages = filteredPages;
      }
    }

    return this.selectRandomItem(candidatePages, `${dateKey}:quote:page`);
  }

  /**
   * Gera uma chave estável para a página da citação
   * @param {Object} quoteObj
   * @param {number} fallbackIndex
   * @returns {string}
   */
  getQuotePageKey(quoteObj, fallbackIndex) {
    if (typeof quoteObj.title === 'string' && quoteObj.title.trim()) {
      return quoteObj.title.trim();
    }

    return `quote-page-${fallbackIndex}`;
  }

  /**
   * Calcula a chave da data brasileira anterior
   * @param {string} dateKey
   * @returns {string|null}
   */
  getPreviousBrazilianDateKey(dateKey) {
    if (typeof dateKey !== 'string') {
      return null;
    }

    const parts = dateKey.split('-').map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) {
      return null;
    }

    const previousDate = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2] - 1));
    return previousDate.toISOString().slice(0, 10);
  }

  /**
   * Achata as citações para que cada texto tenha o mesmo peso na seleção diária
   * @returns {Array<Object>} Pool de citações individuais com metadados do item pai
   */
  flattenQuotes() {
    const pool = [];

    for (const page of this.buildQuotePages()) {
      for (const quote of page.quotes) {
        pool.push(quote);
      }
    }

    return pool;
  }

  /**
   * Gera um ID estável para uma subcitação baseado em sua posição no array
   * @param {number} index - Índice da subcitação
   * @returns {string} ID do fragmento da URL
   */
  generateSubquoteAnchor(index) {
    return `subquote-${index + 1}`;
  }
}

// Exporta para CommonJS e ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DailyContentManager;
} else if (typeof window !== 'undefined') {
  window.DailyContentManager = DailyContentManager;
}
