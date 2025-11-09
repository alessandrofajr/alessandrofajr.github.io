/**
 * Homepage Initialization - Initialize daily components on homepage
 */

/**
 * Initialize daily components when DOM is ready
 */
function initializeDailyComponents() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
  } else {
    initComponents();
  }
}

/**
 * Initialize the components
 */
function initComponents() {
  try {
    // Check if we have the required data and classes
    if (typeof window.SITE_DATA === 'undefined' || 
        !window.SITE_DATA.quotes || 
        !window.SITE_DATA.links ||
        typeof window.DailyContentManager === 'undefined' ||
        typeof window.DailyQuoteComponent === 'undefined' ||
        typeof window.DailyLinkComponent === 'undefined') {
      console.error('Daily components: Required dependencies not loaded');
      return;
    }

    // Find containers
    const quoteContainer = document.getElementById('daily-quote-container');
    const linkContainer = document.getElementById('daily-link-container');

    if (!quoteContainer || !linkContainer) {
      console.error('Daily components: Required containers not found');
      return;
    }

    // Initialize content manager
    const contentManager = new window.DailyContentManager(
      window.SITE_DATA.quotes,
      window.SITE_DATA.links
    );

    // Initialize and render components
    const quoteComponent = new window.DailyQuoteComponent(quoteContainer, contentManager);
    const linkComponent = new window.DailyLinkComponent(linkContainer, contentManager);

    quoteComponent.render();
    linkComponent.render();

    console.log('Daily components initialized successfully');
  } catch (error) {
    console.error('Error initializing daily components:', error);
  }
}

// Auto-initialize when script loads
initializeDailyComponents();