// Keep cached NexT assets from being reused after the switch to Fluid.
// Bump this version when changing the theme or its shared CSS/JavaScript.
hexo.extend.filter.register('after_render:html', function (html) {
  return html.replace(/\b(href|src)="(\/blog\/[^"?]+\.(?:css|js))"/g,
    '$1="$2?v=fluid-1.9.9"');
});
