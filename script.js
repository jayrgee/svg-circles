var mySvg = (function () {
  var nsSvg = "http://www.w3.org/2000/svg";

  function svgElement(options) {
    var s = document.createElementNS(nsSvg, "svg"),
      o = options || {},
      h = o.height || 100,
      w = o.width || 100;

    s.setAttributeNS(null, 'width', w);
    s.setAttributeNS(null, 'height', h);
    return s;
  }

  function svgCircle(options) {
    var c = document.createElementNS(nsSvg, "circle"),
      o = options || {},
      cx = o.cx || 50,
      cy = o.cy || 50,
      r = o.r || 40;

    c.setAttributeNS(null, 'cx', cx);
    c.setAttributeNS(null, 'cy', cy);
    c.setAttributeNS(null, 'r', r);

    return c;
  }

  function svgDashedCircle(options) {
    var c = svgCircle(options),
      o = options || {},
      stroke = o.stroke || '#fff';

    c.setAttributeNS(null, 'stroke', stroke);
    c.setAttributeNS(null, 'fill', 'transparent');
    c.setAttributeNS(null, 'stroke-dasharray', '5,10');
    c.setAttributeNS(null, 'stroke-width', 1);
    c.setAttributeNS(null, 'class', 'persist');

    return c;
  }

  function svgPoint(options) {
    var p = svgCircle(options),
      o = options || {},
      r = o.r || 5;

    p.setAttributeNS(null, 'r', r);

    return p;
  }

  function svgPoints(coords, options) {
    var g = document.createElementNS(nsSvg, "g"),
      o = options || {},
      fill = o.fill || 'transparent';

    g.setAttributeNS(null, 'fill', fill);
    coords.forEach(function (c) {
      g.appendChild(svgPoint({cx: c.x, cy: c.y}));
    });

    return g;
  }

  function removeGroups(parent) {
    var gNodes = parent.getElementsByTagName('g'),
      arrNodes = [],
      i;

    for (i = 0; i < gNodes.length; i++) {
      arrNodes.push(gNodes[i]);
    }

    arrNodes.forEach(function (node) {
      if (node.parentNode) { node.parentNode.removeChild(node); }
    });
  }

  return {
    svgElement: svgElement,
    svgCircle: svgCircle,
    svgDashedCircle: svgDashedCircle,
    svgPoint: svgPoint,
    svgPoints: svgPoints,
    removeGroups: removeGroups
  };
}());

(function () {

  var h = 500,
    w = 500,
    config = {
      h: h,
      w: w,
      cx: w / 2,
      cy: h / 2,
      r1: (h < w) ? h * 0.4 : w * 0.4,
      r2: (h < w) ? h * 0.3 : w * 0.3
    },
    eSvg = mySvg.svgElement({height: config.h, width: config.w}),
    eDemo = document.getElementById("demo"),
    initPts = document.getElementById("counter").value;

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

  function refreshPoints(n, svg, cfg) {

    mySvg.removeGroups(svg);
    svg.appendChild(mySvg.svgPoints(getPointsOnCircumference(n, cfg.cx, cfg.cy, cfg.r1), {fill: '#fff'}));
    //svg.appendChild(mySvg.svgPoints(getPointsOnCircumference(n, cfg.cx, cfg.cy, cfg.r2), {fill: 'red'}));
  }

  function addListeners(svg, cfg) {

    var eCounter = document.getElementById("counter"),
      eCounterUp = document.getElementById("counter-up"),
      eCounterDown = document.getElementById("counter-down");

    eCounter.addEventListener("change", function () { refreshPoints(eCounter.value, svg, cfg); }, false);

    eCounterUp.addEventListener("click", function () {
      if (eCounter.value < eCounter.max) {
        eCounter.value++;
        refreshPoints(eCounter.value, svg, cfg);
      }
    }, false);

    eCounterDown.addEventListener("click", function () {
      if (eCounter.value > eCounter.min) {
        eCounter.value--;
        refreshPoints(eCounter.value, svg, cfg);
      }
    }, false);
  }

  eSvg.appendChild(mySvg.svgDashedCircle({cx: config.cx, cy: config.cy, r: config.r1}));
  eSvg.appendChild(mySvg.svgDashedCircle({cx: config.cx, cy: config.cy, r: config.r2, stroke: 'red'}));
  refreshPoints(initPts, eSvg, config);
  eDemo.appendChild(eSvg);
  addListeners(eSvg, config);

}());