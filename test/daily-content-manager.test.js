const test = require('node:test');
const assert = require('node:assert/strict');

const DailyContentManager = require('../src/js/daily-content-manager.js');
const quotesData = require('../src/_data/quotes.json');

test('buildQuotePages gives equal page weight regardless of subquote count', () => {
  const manager = new DailyContentManager([
    {
      title: 'Many',
      quote: 'Main',
      additionalQuotes: [
        { quote: 'A' },
        { quote: 'B' },
        { quote: 'C' }
      ]
    },
    {
      title: 'Single',
      quote: 'Only'
    }
  ], []);

  const pages = manager.buildQuotePages();

  assert.equal(pages.length, 2);
  assert.equal(pages[0].quotes.length, 4);
  assert.equal(pages[1].quotes.length, 1);
});

test('selected subquotes keep selectedQuote and anchor metadata', () => {
  const manager = new DailyContentManager([
    {
      title: 'Source',
      quote: 'Main',
      additionalQuotes: [{ quote: 'Extra' }]
    }
  ], []);

  const page = manager.buildQuotePages()[0];

  assert.equal(page.quotes[0].selectedQuote, 'Main');
  assert.equal(page.quotes[1].selectedQuote, 'Extra');
  assert.equal(page.quotes[1].selectedQuoteAnchor, 'subquote-1');
});

test('does not repeat the same page on consecutive days when alternatives exist', () => {
  const manager = new DailyContentManager(quotesData, []);

  const first = manager.selectDailyQuoteByDateKey('2026-03-14');
  const second = manager.selectDailyQuoteByDateKey('2026-03-15');

  assert.ok(first);
  assert.ok(second);
  assert.notEqual(first.title, second.title);
});

test('single-page datasets can repeat across consecutive days', () => {
  const manager = new DailyContentManager([
    {
      title: 'Only Page',
      quote: 'Main',
      additionalQuotes: [{ quote: 'Extra' }]
    }
  ], []);

  const first = manager.selectDailyQuoteByDateKey('2026-03-14');
  const second = manager.selectDailyQuoteByDateKey('2026-03-15');

  assert.equal(first.title, 'Only Page');
  assert.equal(second.title, 'Only Page');
});

test('ignores invalid quote items consistently', () => {
  const manager = new DailyContentManager([
    null,
    {},
    {
      title: 'Invalid extras',
      additionalQuotes: [{ nope: 'x' }, null]
    },
    {
      title: 'Valid',
      quote: 'Main'
    }
  ], []);

  const pages = manager.buildQuotePages();
  const result = manager.selectDailyQuoteByDateKey('2026-03-15');

  assert.equal(pages.length, 1);
  assert.equal(result.title, 'Valid');
  assert.equal(result.selectedQuote, 'Main');
});
