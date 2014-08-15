function svgElement(options) {
  var s = document.createElementNS("http://www.w3.org/2000/svg", "svg"),
    o = options || {},
    h = o.height || 100,
    w = o.width || 100;

  s.setAttributeNS(null, 'width', w);
  s.setAttributeNS(null, 'height', h);
  return s;
}

function svgCircle(options) {
  var c = document.createElementNS("http://www.w3.org/2000/svg", "circle"),
    o = options || {},
    cx = o.cx || 50,
    cy = o.cy || 50,
    r = o.r || 40,
    fill = o.fill || 'transparent',  
    stroke = o.stroke || '#fff';

  c.setAttributeNS(null, 'cx', cx);
  c.setAttributeNS(null, 'cy', cy);
  c.setAttributeNS(null, 'r', r);
  c.setAttributeNS(null, 'fill', fill);
  c.setAttributeNS(null, 'stroke', stroke);
  return c;
}

function svgDashedCircle(options) {
  var c = svgCircle(options);

  c.setAttributeNS(null, 'stroke-dasharray', '5,10');
  c.setAttributeNS(null, 'stroke-width', 1);
  c.setAttributeNS(null, 'class', 'persist');
  return c;
}

function svgPoint(options){
  var p = svgCircle(options),
    o = options || {},
    r = o.r || 5;

  p.setAttributeNS(null, 'r', r);
  return p;
}

function svgPoints(coords, options){
  var g = document.createElementNS("http://www.w3.org/2000/svg", "g"),
    o = options || {},
    fill = o.fill || 'transparent';

  coords.forEach(function(c){
    g.appendChild(svgPoint({cx: c.x, cy: c.y, fill: fill}));
  });
  return g;
}

function getPointsOnCircumference(n, cx, cy, radius) {
  var i,
      coord = {},
      coords = [],
      extAngle = 2 * Math.PI / n;

  for (i = 0; i < n; i++) {
      coord = {
        x: cx + radius * Math.sin(extAngle * i),
        y: cy - radius * Math.cos(extAngle * i)
      };
      coords.push(coord);
    }
    return coords;
}
  
(function() {

  function refreshPoints(n, e, cfg){

    while (e.firstChild) {
      e.removeChild(e.firstChild);
    }
    
    e.appendChild(svgDashedCircle({cx: cfg.cx, cy: cfg.cy, r: cfg.r}));
    e.appendChild(svgPoints(getPointsOnCircumference(n, cfg.cx, cfg.cy, cfg.r), {fill: '#fff'}));
  }

  var h = 500,
      w = 500,
      config = {
        h: h,
        w: w,
        cx: w / 2,
        cy: h / 2,
        r: (h < w) ? h * 0.4 : w * 0.4
      },
      eSvg = svgElement({height: config.h, width: config.w}),
      eDemo = document.getElementById("demo"),
      eCounter = document.getElementById("counter"),
      eCounterUp = document.getElementById("counter-up"),
      eCounterDown = document.getElementById("counter-down");

  refreshPoints(eCounter.value, eSvg, config);
  eDemo.appendChild(eSvg);

  eCounter.addEventListener("change", function() {refreshPoints(eCounter.value, eSvg, config);}, false);

  eCounterUp.addEventListener("click", function() {
    if (eCounter.value < eCounter.max) {
      eCounter.value++;
      refreshPoints(eCounter.value, eSvg, config);
    }
  }, false);

  eCounterDown.addEventListener("click", function() {
    if (eCounter.value > eCounter.min) {
      eCounter.value--;
      refreshPoints(eCounter.value, eSvg, config);
    }
  }, false);
}())