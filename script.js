var mySvg = (function () {
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

  var initSize = 400,
    initPts = 4,
    h = initSize,
    w = initSize,
    config = {
      h: h,
      w: w,
      cx: w / 2,
      cy: h / 2,
      r1: Math.min(h, w) * 0.4,
      r2: Math.min(h, w) * 0.3,
      n : initPts
    },
    eSvg,
    demo = document.getElementById("demo");

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

  function refreshPoints(svg, cfg) {

    mySvg.removeGroups(svg);
    svg.appendChild(mySvg.svgPoints(getPointsOnCircumference(cfg.n, cfg.cx, cfg.cy, cfg.r1), {fill: '#fff'}));
    //svg.appendChild(mySvg.svgPoints(getPointsOnCircumference(n, cfg.cx, cfg.cy, cfg.r2), {fill: 'red'}));
  }

  function init(svg, cfg) {

    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    mySvg.svgInit(svg, {height: cfg.h, width: cfg.w});

    svg.appendChild(mySvg.svgDashedCircle({cx: cfg.cx, cy: cfg.cy, r: cfg.r1}));
    svg.appendChild(mySvg.svgDashedCircle({cx: cfg.cx, cy: cfg.cy, r: cfg.r2, stroke: 'red'}));

    refreshPoints(svg, cfg);
  }

  function addListeners(svg, cfg) {

    var eSize = document.getElementById("size"),
      eSizeUp = document.getElementById("size-up"),
      eSizeDown = document.getElementById("size-down"),
      eCounter = document.getElementById("counter"),
      eCounterUp = document.getElementById("counter-up"),
      eCounterDown = document.getElementById("counter-down");

    eSize.addEventListener("change", function () {
      var size = eSize.value;
      cfg.h = size;
      cfg.w = size;
      cfg.cx = size / 2;
      cfg.cy = size / 2;
      cfg.r1 = size * 0.4;
      cfg.r2 = size * 0.3;
      cfg.n = eCounter.value;
      init(svg, cfg);
    }, false);

    eCounter.addEventListener("change", function () {
      cfg.n = eCounter.value;
      refreshPoints(svg, cfg);
    }, false);

    eCounterUp.addEventListener("click", function () {
      if (eCounter.value < eCounter.max) {
        eCounter.value++;
        cfg.n = eCounter.value;
        refreshPoints(svg, cfg);
      }
    }, false);

    eCounterDown.addEventListener("click", function () {
      if (eCounter.value > eCounter.min) {
        eCounter.value--;
        cfg.n = eCounter.value;
        refreshPoints(svg, cfg);
      }
    }, false);
  }

  document.getElementById("size").value = initSize;
  document.getElementById("counter").value = initPts;

  eSvg = mySvg.svgElement({height: initSize, width: initSize});
  addListeners(eSvg, config);
  init(eSvg, config);
  demo.appendChild(eSvg);

}());