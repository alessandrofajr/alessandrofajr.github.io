---
layout: default
title: links interessantes
pagination:
  data: collections.links
  size: 20
  alias: links
---

## <span class="section-title">links interessantes</span>

<div class ="item-legend">
  <a href="/links/"><button class="legend-buttons-active">☉ todos</button></a>
  <a href="/links/tags/personal/"><button class="legend-buttons">❖ achados</button></a>
  <a href="/links/tags/tech/"><button class="legend-buttons">✱ técnicos</button></a>
</div>

{% for link in links %}
  <article>
    <div class="blogroll" data-tags="{% if link.tags %}{{ link.tags | join: ',' }}{% endif %}">
      <div class="blogroll-date">{{ link.date | date: "YYYY-MM-DD" }}</div>
      <div class="blogroll-tag">{% if link.tags contains 'personal' %}❖{% elsif link.tags contains 'tech' %}✱{% endif %}</div>
      <div class="blogroll-title"><a href="{{ link.link }}" target="_blank" rel="noopener noreferrer">{{ link.title }}</a> <span class="link-favorite">{% if link.favorite %}☆{% endif %}</span></div>
    </div>
  </article>
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
