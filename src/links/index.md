---
layout: default
title: links interessantes
pagination:
  data: collections.links
  size: 15
  alias: links
---

## <span class="section-title">links interessantes</span>

{% for link in links %}
  <article>
    <div class="blogroll">
      <div class="blogroll-date">{{ link.date | date: "YYYY-MM-DD" }}</div>
      <div class="blogroll-title">{ <a href="{{ link.link }}" target="_blank" rel="noopener noreferrer">{{ link.title }}</a> } </div>
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
