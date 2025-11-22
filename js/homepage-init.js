/**
 * Inicialização da Homepage - Inicializa os componentes diários na homepage
 */

/**
 * Inicializa os componentes diários quando o DOM estiver pronto
 */
function initializeDailyComponents() {
  // Aguarda o DOM estar pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }
}

/**
 * Inicializa os componentes
 */
function initComponents() {
  try {
    // Verifica se os dados e classes necessários foram carregados
    if (typeof window.SITE_DATA === 'undefined' || 
        !window.SITE_DATA.quotes || 
        !window.SITE_DATA.links ||
        typeof window.DailyContentManager === 'undefined' ||
        typeof window.DailyQuoteComponent === 'undefined' ||
        typeof window.DailyLinkComponent === 'undefined') {
      console.error('Componentes diários: dependências necessárias não foram carregadas');
      return;
    }

    // Encontra os contêineres
    const quoteContainer = document.getElementById('daily-quote-container');
    const linkContainer = document.getElementById('daily-link-container');

    if (!quoteContainer || !linkContainer) {
      console.error('Componentes diários: contêineres necessários não encontrados');
      return;
    }

    // Inicializa o gerenciador de conteúdo
    const contentManager = new window.DailyContentManager(
      window.SITE_DATA.quotes,
      window.SITE_DATA.links
    );

    // Inicializa e renderiza os componentes
    const quoteComponent = new window.DailyQuoteComponent(quoteContainer, contentManager);
    const linkComponent = new window.DailyLinkComponent(linkContainer, contentManager);

    quoteComponent.render();
    linkComponent.render();

    console.log('Componentes diários inicializados com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar os componentes diários:', error);
  }
}

// Inicializa automaticamente quando o script carregar
initializeDailyComponents();