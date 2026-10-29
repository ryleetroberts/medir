/* The Mediran Chronicles · theme switch
   Load in <head> without defer so the theme is set before the page paints.
   With no saved choice the site follows the device. A tap on the switch saves
   the choice for every page on this device. The browser bar color
   (theme-color) follows whichever theme is showing. */
(function () {
  var KEY = 'medir-theme';
  var BAR = { light: '#eceef1', dark: '#08090f' };
  var root = document.documentElement;
  var media = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function saved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function resolve() {
    var s = saved();
    if (s === 'light' || s === 'dark') return s;
    return media && media.matches ? 'dark' : 'light';
  }
  function paintBrowserBar(theme) {
    // A theme-color tag with no media attribute, placed first, wins over the
    // device-preference pair in the page head.
    var tag = document.getElementById('theme-color-active');
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'theme-color';
      tag.id = 'theme-color-active';
      document.head.insertBefore(tag, document.head.firstChild);
    }
    tag.content = BAR[theme];
  }
  function apply(theme) {
    root.setAttribute('data-theme', theme);
    if (document.head) paintBrowserBar(theme);
    var btn = document.querySelector('.medir-toggle');
    if (btn) btn.setAttribute('aria-checked', theme === 'dark' ? 'true' : 'false');
  }

  apply(resolve());

  if (media && media.addEventListener) {
    media.addEventListener('change', function () { if (!saved()) apply(resolve()); });
  }

  // another tab on the same device changed the theme
  window.addEventListener('storage', function (e) { if (e.key === KEY) apply(resolve()); });

  // Elements marked data-pin stick to the top of the screen. This adds the
  // class is-pinned while they are stuck, so they only draw a background then.
  function watchPins() {
    if (!('IntersectionObserver' in window)) return;
    document.querySelectorAll('[data-pin]').forEach(function (el) {
      var mark = document.createElement('div');
      mark.setAttribute('aria-hidden', 'true');
      mark.style.cssText = 'height:1px;margin-bottom:-1px;pointer-events:none;';
      el.parentNode.insertBefore(mark, el);
      new IntersectionObserver(function (entries) {
        var e = entries[0];
        el.classList.toggle('is-pinned', !e.isIntersecting && e.boundingClientRect.top < 0);
      }).observe(mark);
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    apply(resolve());
    watchPins();
    var btn = document.querySelector('.medir-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (e) {}
      apply(next);
    });
  });
})();
