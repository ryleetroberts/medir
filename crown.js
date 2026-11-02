/* The Mediran Chronicles · header ornament: builds the stars and the inlay. */
(function () {
  var NS = 'http://www.w3.org/2000/svg';
  var crown = document.createElement('div');
  crown.className = 'crown'; crown.setAttribute('aria-hidden', 'true');

  /* Stars: a fixed seed so the sky is the same on every visit */
  var seed = 1473;
  function rnd() { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }
  var sky = document.createElement('div'); sky.className = 'sky';
  var count = Math.round(Math.min(150, Math.max(60, innerWidth / 10)));
  for (var i = 0; i < count; i++) {
    var s = document.createElement('i');
    var big = rnd() < .12, size = big ? 2 + rnd() * 1.2 : .8 + rnd() * 1.1;
    s.className = 'star' + (rnd() < .18 ? ' warm' : '');
    var y = Math.pow(rnd(), 1.5) * 92;            // denser toward the top
    s.style.cssText = 'left:' + (rnd() * 100).toFixed(2) + '%;top:' + y.toFixed(2) + '%;width:' + size.toFixed(2) + 'px;height:' + size.toFixed(2) + 'px;' +
      '--o:' + (.35 + rnd() * .6).toFixed(2) + ';--d:' + (2.5 + rnd() * 4).toFixed(2) + 's;--w:-' + (rnd() * 6).toFixed(2) + 's';
    if (big) s.style.boxShadow = '0 0 6px rgba(233,236,247,.55)';
    sky.appendChild(s);
  }
  var sparks = Math.round(count / 18);
  for (var j = 0; j < sparks; j++) {
    var k = document.createElement('span'); k.className = 'spark';
    var sz = 7 + rnd() * 7;
    k.style.cssText = 'left:' + (4 + rnd() * 92).toFixed(2) + '%;top:' + (4 + rnd() * 55).toFixed(2) + '%;--s:' + sz.toFixed(1) + 'px;' +
      '--o:' + (.55 + rnd() * .4).toFixed(2) + ';--d:' + (3.5 + rnd() * 3).toFixed(2) + 's;--w:-' + (rnd() * 6).toFixed(2) + 's';
    k.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 0C12.7 7.5 16.5 11.3 24 12 16.5 12.7 12.7 16.5 12 24 11.3 16.5 7.5 12.7 0 12 7.5 11.3 11.3 7.5 12 0Z"/></svg>';
    sky.appendChild(k);
  }
  crown.appendChild(sky);

  /* Inlay: a gold rule the full width of the page, a diamond set in a frame at its centre */
  var inlay = document.createElement('div');
  inlay.className = 'inlay';
  var orn = document.createElementNS(NS, 'svg');
  orn.setAttribute('viewBox', '0 0 1000 60');
  // each piece carries the delay at which it draws itself in, working outward from the centre
  var d = [
    ['M440 14H560V46H440Z', '', 0],
    ['M500 4L540 30 500 56 460 30Z', '', .15],
    ['M440 22H476M524 22H560M440 38H476M524 38H560', ' fine', .4],
    ['M440 24H330L322 30M560 24H670L678 30M440 36H330L322 30M560 36H670L678 30', ' fine', .55],
    ['M322 30L310 22H120M678 30L690 22H880', ' fine', .8]
  ];
  [[290, 1.0], [276, 1.08], [262, 1.16], [710, 1.0], [724, 1.08], [738, 1.16]].forEach(function (c) {
    var x = c[0];
    d.push(['M' + x + ' 25L' + (x + 7) + ' 30 ' + x + ' 35 ' + (x - 7) + ' 30Z', ' fine', c[1]]);
  });
  function paths(cls) {
    return d.map(function (p) {
      return '<path class="' + cls + p[1] + '" pathLength="1" style="--dl:' + p[2] + 's" d="' + p[0] + '"/>';
    }).join('');
  }
  orn.innerHTML =
    '<defs><linearGradient id="crownGold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1000" y2="0">' +
      '<stop offset="0" stop-color="#b8953f"/><stop offset=".38" stop-color="#e2c77f"/><stop offset=".5" stop-color="#a8832f"/>' +
      '<stop offset=".62" stop-color="#e2c77f"/><stop offset="1" stop-color="#b8953f"/></linearGradient>' +
      // a narrow band of light that slides across the gold now and then
      '<linearGradient id="crownShine" gradientUnits="userSpaceOnUse" x1="-160" y1="0" x2="0" y2="0">' +
        '<stop offset="0" stop-color="#fff8e2" stop-opacity="0"/><stop offset=".5" stop-color="#ffe9a8" stop-opacity="1"/>' +
        '<stop offset="1" stop-color="#fff8e2" stop-opacity="0"/>' +
        '<animateTransform attributeName="gradientTransform" type="translate" values="0 0;0 0;1160 0;1160 0" keyTimes="0;.35;.6;1" dur="9s" begin="2s" repeatCount="indefinite"/>' +
      '</linearGradient></defs>' +
    '<g class="draw">' + paths('gl') + '</g>' +
    '<g class="shine">' + paths('gl') + '</g>';
  ['l', 'r'].forEach(function (side) {
    var run = document.createElement('i'); run.className = 'run ' + side; inlay.appendChild(run);
  });
  inlay.appendChild(orn);
  crown.appendChild(inlay);

  document.body.insertBefore(crown, document.body.firstChild);
})();
