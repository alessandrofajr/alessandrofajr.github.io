---
layout: default
title: citações
templateEngineOverride: njk,md
pagination:
  data: collections.quotes
  size: 15
  alias: quotes
---

<span class="section-title">citações, trechos e outros</span>

{% for quote in quotes %}
    <div class="quotes">
        <a href="/quotes/{{ quote.title | slug }}/">{{ quote.quote }}</a> ― <b>{{ quote.author }}</b>
        <div class="quote-date">Adicionado em {{ quote.date }}</div>
        <div class="breaker"></div>
    <div>
{% endfor %}

<nav class="pagination">
  {% if pagination.href.previous %}
    <a href="{{ pagination.href.previous }}">página anterior</a>
  {% else %}
    &nbsp;
  {% endif %}
  {% if pagination.href.next %}
    <a href="{{ pagination.href.next }}">próxima página</a>
  {% else %}
    &nbsp;
  {% endif %}
</nav>