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
    const seed = this.generateSeed(brazilianDateKey);
  
    const selectedQuoteObj = this.selectRandomItem(this.quotesData, seed);
    if (!selectedQuoteObj) return null;
  
    const innerQuote = this.selectInnerQuote(selectedQuoteObj, seed);
  
    return {
      ...selectedQuoteObj,
      selectedQuote: innerQuote
    };
  }

  /**
   * Obtém o link diário para a data atual no Brasil
   * @returns {Object|null} Objeto do link selecionado ou null se não houver dados
   */
  getDailyLink() {
    const brazilianDateKey = this.getBrazilianDateKey();
    return this.selectRandomItem(this.linksData, this.generateSeed(brazilianDateKey));
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
   * Gera uma seed determinística baseada na data
   * @param {string} dateString - Data no formato YYYY-MM-DD
   * @returns {number} Seed numérica para seleção aleatória
   */
  generateSeed(dateString) {
    let hash = 0;
    for (let i = 0; i < dateString.length; i++) {
      const char = dateString.charCodeAt(i);  // Pega código numérico de cada caractere
      hash = ((hash << 5) - hash) + char;     // Fórmula matemática que mistura tudo
      hash = hash & hash;                     // Garante que seja um número de 32 bits
    }
    return Math.abs(hash);  // Retorna número positivo
}

  /**
   * Seleciona um item aleatório do array usando uma seed determinística
   * @param {Array} items - Array de itens para selecionar
   * @param {number} seed - Seed para seleção determinística
   * @returns {Object|null} Item selecionado ou null se o array estiver vazio
   */
  selectRandomItem(items, seed) {
    if (!Array.isArray(items) || items.length === 0) {
      return null;  // Se não tem itens, retorna nada
    }
    
    const index = seed % items.length;  // Operação módulo (%)
    return items[index];
  }
  /**
   * Seleciona a citação principal ou uma das additionalQuotes
   * usando uma seed interna determinística
   * @param {Object} quoteObj
   * @param {number} seed
   * @returns {string} O texto da citação selecionada
   */
  selectInnerQuote(quoteObj, seed) {
    const pool = [];

    // Inclui sempre a citação principal
    if (quoteObj.quote) {
      pool.push(quoteObj.quote);
    }

    // Tenta colocar citações adicionais, se estiverem presentes
    if (Array.isArray(quoteObj.additionalQuotes) && quoteObj.additionalQuotes.length > 0) {
      for (const aq of quoteObj.additionalQuotes) {
        if (aq && aq.quote) {
          pool.push(aq.quote);
        }
      }
    }

    // Cria uma seed interna
    const idComponent = quoteObj.id ? Number(quoteObj.id) : 0;
    const innerSeed = Math.abs((seed * 7919 + idComponent * 104729) ^ (seed >>> 16)); 

    const index = innerSeed % pool.length;
    return pool[index];
  }
}

// Exporta para CommonJS e ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DailyContentManager;
} else if (typeof window !== 'undefined') {
  window.DailyContentManager = DailyContentManager;
}
