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
    return this.selectRandomItem(this.flattenQuotes(), `${brazilianDateKey}:quote`);
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
   * Achata as citações para que cada texto tenha o mesmo peso na seleção diária
   * @returns {Array<Object>} Pool de citações individuais com metadados do item pai
   */
  flattenQuotes() {
    const pool = [];

    for (const quoteObj of this.quotesData) {
      if (!quoteObj || typeof quoteObj !== 'object') {
        continue;
      }

      if (quoteObj.quote) {
        pool.push({
          ...quoteObj,
          selectedQuote: quoteObj.quote
        });
      }

      if (Array.isArray(quoteObj.additionalQuotes) && quoteObj.additionalQuotes.length > 0) {
        for (const aq of quoteObj.additionalQuotes) {
          if (aq && aq.quote) {
            pool.push({
              ...quoteObj,
              selectedQuote: aq.quote
            });
          }
        }
      }
    }

    return pool;
  }
}

// Exporta para CommonJS e ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DailyContentManager;
} else if (typeof window !== 'undefined') {
  window.DailyContentManager = DailyContentManager;
}
