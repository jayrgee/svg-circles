/*global mySvg*/

(function () {

  "use strict";

  var eSvg,
    eDemo;

  function convPolarToCartesion(r, a, origin) {
    origin = origin || {cx: 0, cy: 0};

    return {
      x: origin.cx + r * Math.cos(a),
      y: origin.cy - r * Math.sin(a)
    };
  }

  function getPointsOnCircumference(n, cx, cy, radius) {
    var i,
      origin = {cx: cx, cy: cy},
      coords = [],
      extAngle = 2 * Math.PI / n;

    for (i = 0; i < n; i++) {
      coords.push(convPolarToCartesion(radius, extAngle * i, origin));
    }
    return coords;
  }

  function getPolarOptions() {

    var size = document.getElementById("size").value,
      noPts = document.getElementById("counter").value;

    return {
      cx: size / 2,
      cy: size / 2,
      r1: size * 0.45,
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
    svg.appendChild(mySvg.svgCircles(getPointsOnCircumference(cfg.n, cfg.cx, cfg.cy, cfg.r1), {r: 4, fill: 'red', stroke: 'yellow'}));
    svg.appendChild(mySvg.svgCircles2(getPointsOnCircumference(cfg.n, cfg.cx, cfg.cy, cfg.r2), {r: 3, stroke: 'yellow'}));
  }

  function resetSvg(svg) {

    var cfg = getPolarOptions();

    while (svg.firstChild) {
      svg.removeChild(eSvg.firstChild);
    }

    mySvg.svgInit(svg, getSvgOptions());

    svg.appendChild(mySvg.svgDashedCircle({cx: cfg.cx, cy: cfg.cy, r: cfg.r1, stroke: 'yellow'}));
    svg.appendChild(mySvg.svgDashedCircle({cx: cfg.cx, cy: cfg.cy, r: cfg.r2, stroke: 'yellow'}));

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