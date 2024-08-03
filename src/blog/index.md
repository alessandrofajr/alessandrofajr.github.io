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

{% for post in pagination.items %}
  <article>
      <div class="blogroll">
      <div class="blogroll-date">{{ post.date | date: "%Y-%m-%d" }}</div>
      <div class="blogroll-title">{ <a href="{{ post.url }}">{{ post.data.title }}</a> }</div>
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