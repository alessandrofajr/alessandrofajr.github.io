---
layout: default
title: blog
pagination:
  data: collections.blog
  size: 30
  reverse: true
  alias: posts
---

## <span class="section-title">blog</span>

<div class ="item-legend">
  <button class="legend-buttons" data-filter="all">☉ todos</button> 
  <button class="legend-buttons" data-filter="personal">❖ reflexões</button> 
  <button class="legend-buttons" data-filter="tech">✱ técnicos</button> 
</div>

{% for post in pagination.items %}
  <article>
    <div class="blogroll" data-tags="{% if post.data.tags %}{{ post.data.tags | join: ',' }}{% endif %}">
      <div class="blogroll-date">{{ post.date | date: "%Y-%m-%d" }}</div>
      <div class="blogroll-tag">{% if post.data.tags contains 'personal' %}❖{% elsif post.data.tags contains 'tech' %}✱{% endif %}</div>
      <div class="blogroll-title"><a href="{{ post.url }}"> {{ post.data.title }} </a></div>
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