const test = require('node:test');
const assert = require('node:assert/strict');

const { DailyQuoteComponent } = require('../src/js/daily-components.js');

function createComponent() {
  return new DailyQuoteComponent({ innerHTML: '' }, { getDailyQuote() {} });
}

function installDocumentStub() {
  const originalDocument = global.document;

  global.document = {
    createElement() {
      return {
        _textContent: '',
        set textContent(value) {
          this._textContent = value;
        },
        get innerHTML() {
          return this._textContent
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
        }
      };
    }
  };

  return () => {
    global.document = originalDocument;
  };
}

function buildLongQuote(wordCount) {
  return Array.from({ length: wordCount }, (_, index) => `word${index + 1}`).join(' ');
}

test('quotes under the word limit render unchanged without continuation cue', () => {
  const restoreDocument = installDocumentStub();
  const component = createComponent();
  const quote = buildLongQuote(100);

  const html = component.generateQuoteHTML({
    title: 'Limite Exato',
    selectedQuote: quote,
    author: 'Autor'
  });

  restoreDocument();

  assert.match(html, new RegExp(`>${quote}<`));
  assert.doesNotMatch(html, /daily-quote__more/);
});

test('quotes over the word limit truncate at a word boundary and append continuation cue', () => {
  const restoreDocument = installDocumentStub();
  const component = createComponent();
  const quote = buildLongQuote(101);

  const html = component.generateQuoteHTML({
    title: 'Longa',
    selectedQuote: quote
  });

  restoreDocument();

  const truncated = buildLongQuote(100);

  assert.match(html, new RegExp(`>${truncated} <span class="daily-quote__more">\\.\\.\\. ler mais</span><`));
  assert.doesNotMatch(html, /word101/);
});

test('truncated quotes preserve anchored subquote URLs', () => {
  const restoreDocument = installDocumentStub();
  const component = createComponent();

  const html = component.generateQuoteHTML({
    title: 'Título com Acento',
    selectedQuote: buildLongQuote(120),
    selectedQuoteAnchor: 'subquote-2'
  });

  restoreDocument();

  assert.match(html, /href="\/quotes\/titulo-com-acento\/#subquote-2"/);
});

test('escaping still applies after truncation', () => {
  const restoreDocument = installDocumentStub();
  const component = createComponent();
  const quote = `${buildLongQuote(99)} <script>alert("xss")</script> tail`;

  const html = component.generateQuoteHTML({
    title: 'Escape',
    selectedQuote: quote
  });

  restoreDocument();

  assert.match(html, /&lt;script&gt;alert\(&quot;xss&quot;\)&lt;\/script&gt;/);
  assert.match(html, /daily-quote__more/);
  assert.doesNotMatch(html, /<script>/);
});
