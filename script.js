var mySvg = (function () {

  "use strict";

  var nsSvg = "http://www.w3.org/2000/svg";

  function svgInit(s, options) {
    var o = options || {},
      h = o.height || 100,
      w = o.width || 100;

    s.setAttributeNS(null, 'width', w);
    s.setAttributeNS(null, 'height', h);
  }

  function svgElement(options) {
    var s = document.createElementNS(nsSvg, "svg");

    svgInit(s, options);
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
      g.appendChild(svgPoint({cx: c.x, cy: c.y, r: o.r}));
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
    svgInit: svgInit,
    svgElement: svgElement,
    svgCircle: svgCircle,
    svgDashedCircle: svgDashedCircle,
    svgPoint: svgPoint,
    svgPoints: svgPoints,
    removeGroups: removeGroups
  };
}());

(function () {

  "use strict";

  var palette = {
      primary: '#fff',
      secondary: "red",
      background: '#4169e1'
    },
    eSvg = null,
    eDemo;

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

  function getPolarOptions() {

    var size = document.getElementById("size").value,
      noPts = document.getElementById("counter").value;

    return {
      cx: size / 2,
      cy: size / 2,
      r1: size * 0.4,
      r2: size * 0.3,
      n : noPts
    };
  }

  function getSvgOptions() {

    var size = document.getElementById("size").value;

    return {height: size, width: size};
  }

  function refreshPoints(svg) {

    var cfg = getPolarOptions();

    mySvg.removeGroups(svg);
    svg.appendChild(mySvg.svgPoints(getPointsOnCircumference(cfg.n, cfg.cx, cfg.cy, cfg.r1), {r: 4, fill: '#fff'}));
    //svg.appendChild(mySvg.svgPoints(getPointsOnCircumference(n, cfg.cx, cfg.cy, cfg.r2), {fill: 'red'}));
  }

  function resetSvg(svg) {

    var cfg = getPolarOptions();

    while (svg.firstChild) {
      svg.removeChild(eSvg.firstChild);
    }

    mySvg.svgInit(svg, getSvgOptions());

    svg.appendChild(mySvg.svgDashedCircle({cx: cfg.cx, cy: cfg.cy, r: cfg.r1}));
    //eSvg.appendChild(mySvg.svgDashedCircle({cx: cfg.cx, cy: cfg.cy, r: cfg.r2, stroke: 'red'}));

    refreshPoints(svg);

  }

  function decreasedValue(input) {
    var val = parseInt(input.value, 10),
      min = parseInt(input.min, 10),
      step = parseInt(input.step, 10);

    if (val > min) {
      input.value = val - step;
      return true;
    }
    return false;
  }

  function increasedValue(input) {
    var val = parseInt(input.value, 10),
      max = parseInt(input.max, 10),
      step = parseInt(input.step, 10);

    if (val < max) {
      input.value = val + step;
      return true;
    }
    return false;
  }

  function addListeners(svg) {

    var eSize = document.getElementById("size"),
      eSizeUp = document.getElementById("size-up"),
      eSizeDown = document.getElementById("size-down"),
      eCounter = document.getElementById("counter"),
      eCounterUp = document.getElementById("counter-up"),
      eCounterDown = document.getElementById("counter-down");

    eSize.addEventListener("change", function () { resetSvg(svg); }, false);

    eSizeUp.addEventListener("click", function () {
      if (increasedValue(eSize)) { resetSvg(svg); }
    }, false);

    eSizeDown.addEventListener("click", function () {
      if (decreasedValue(eSize)) { resetSvg(svg); }
    }, false);

    eCounter.addEventListener("change", function () { refreshPoints(svg); }, false);

    eCounterUp.addEventListener("click", function () {
      if (increasedValue(eCounter)) { refreshPoints(svg); }
    }, false);

    eCounterDown.addEventListener("click", function () {
      if (decreasedValue(eCounter)) { refreshPoints(svg); }
    }, false);
  }

  eSvg = mySvg.svgElement(getSvgOptions());
  resetSvg(eSvg);

  eDemo = document.getElementById("demo");
  eDemo.appendChild(eSvg);

  addListeners(eSvg);

}());