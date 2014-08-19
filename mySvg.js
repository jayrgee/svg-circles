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

  function svgCircles(coords, options) {
    var g = document.createElementNS(nsSvg, "g"),
      o = options || {},
      stroke = o.stroke || '#fff',
      fill = o.fill || 'transparent';

    g.setAttributeNS(null, 'stroke', stroke);
    g.setAttributeNS(null, 'fill', fill);
    coords.forEach(function (c) {
      g.appendChild(svgCircle({cx: c.x, cy: c.y, r: o.r}));
    });

    return g;
  }

  function svgCircles2(params, options) {
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g"),
      o = options || {},
      stroke = o.stroke || '#fff',
      fill = o.fill || 'transparent';

    g.setAttributeNS(null, 'fill', fill);
    g.setAttributeNS(null, 'stroke', stroke);

    params.forEach(function (p) {
      g.appendChild(svgCircle({cx: p.coords.x, cy: p.coords.y, r: p.r}));
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
    svgCircles: svgCircles,
    svgCircles2: svgCircles2,
    removeGroups: removeGroups
  };
}());
