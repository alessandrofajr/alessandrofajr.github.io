---
layout: default
title: citações
pagination:
  data: collections.quotes
  size: 15
  alias: quotes
---

## <span class="section-title">citações, trechos e outros</span>

{% for quote in quotes %}
    <div class="quotes">
        <a href="/quotes/{{ quote.id }}/">{{ quote.quote }}</a> ― {{ quote.author }}
        <p>adicionado em {{ quote.date }}</p>
        <div class="quote-breaker"></div>
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