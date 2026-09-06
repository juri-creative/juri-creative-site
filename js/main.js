document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.nav-primary');

  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      toggle.classList.toggle('is-active');
      nav.classList.toggle('is-open');
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.classList.remove('is-active');
        nav.classList.remove('is-open');
      });
    });
  }

  // Scroll reveal
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Works filter (works.html only)
  var filterButtons = document.querySelectorAll('.filter-row button');
  var workItems = document.querySelectorAll('.work-item');
  if (filterButtons.length && workItems.length) {
    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterButtons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var cat = btn.getAttribute('data-filter');
        workItems.forEach(function (item) {
          if (cat === 'all' || item.getAttribute('data-category') === cat) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
            var hiddenVideo = item.querySelector('video');
            if (hiddenVideo) { hiddenVideo.pause(); }
          }
        });
      });
    });
  }

  // Click-to-play video work items (no autoplay, always muted, no source audio playback)
  document.querySelectorAll('.ph.video').forEach(function (wrap) {
    var video = wrap.querySelector('video');
    var btn = wrap.querySelector('.play-btn');
    if (!video || !btn) return;

    video.muted = true;
    video.addEventListener('volumechange', function () {
      if (!video.muted) { video.muted = true; }
    });

    function playVideo() {
      video.controls = true;
      video.muted = true;
      video.play();
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      playVideo();
    });
    wrap.addEventListener('click', function () {
      if (video.paused) { playVideo(); }
    });

    video.addEventListener('play', function () { wrap.classList.add('is-playing'); });
    video.addEventListener('pause', function () { wrap.classList.remove('is-playing'); });
    video.addEventListener('ended', function () {
      wrap.classList.remove('is-playing');
      video.controls = false;
    });
  });

  // Formspree-backed form submission (AJAX, no page reload)
  var forms = document.querySelectorAll('.js-formspree-form');
  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var msg = form.querySelector('.form-message');
      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            if (msg) {
              msg.textContent = 'お問い合わせありがとうございます。内容を確認後、ご連絡いたします。';
              msg.classList.add('is-visible');
            }
            form.reset();
          } else {
            if (msg) {
              msg.textContent = '送信に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、メールにて直接ご連絡ください。';
              msg.classList.add('is-visible');
            }
          }
        })
        .catch(function () {
          if (msg) {
            msg.textContent = '送信に失敗しました。お手数ですが、時間をおいて再度お試しいただくか、メールにて直接ご連絡ください。';
            msg.classList.add('is-visible');
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  });
});
