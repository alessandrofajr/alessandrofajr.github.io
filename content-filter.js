document.addEventListener("DOMContentLoaded", function () {
  const buttons = document.querySelectorAll('.legend-buttons');
  const posts = document.querySelectorAll('.blogroll');

  function removeActiveClass() {
    buttons.forEach(button => {
      button.classList.remove('active');
    });
  }

  buttons.forEach(button => {
    button.addEventListener('click', function () {
      const filter = this.getAttribute('data-filter');

      removeActiveClass();
      this.classList.add('active');

      posts.forEach(post => {
        const tags = post.getAttribute('data-tags');

        if (filter === 'all' || tags.includes(filter)) {
          post.style.display = 'flex';
        } else {
          post.style.display = 'none';
        }
      });
    });
  });

  document.querySelector('.legend-buttons[data-filter="all"]').classList.add('active');
});
