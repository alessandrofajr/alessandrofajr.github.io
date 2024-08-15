---
layout: default
title: blog
pagination:
  data: collections.blog
  size: 10
  reverse: true
  alias: posts
---

## <span class="section-title">blog</span>

<div class ="item-legend">
  <a href="/blog/"><button class="legend-buttons-active">☉ todos</button></a>
  <a href="/blog/tags/personal/"><button class="legend-buttons">❖ reflexões</button></a>
  <a href="/blog/tags/tech/"><button class="legend-buttons">✱ técnicos</button></a>
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