/*global mySvg*/

(function () {

  "use strict";

  var eSvg,
    eDemo,
    timer1,
    timer2;

  function convPolarToCartesion(radius, angle, origin) {
    origin = origin || {cx: 0, cy: 0};

    return {
      x: origin.cx + radius * Math.cos(angle),
      y: origin.cy - radius * Math.sin(angle)
    };
  }

  function getRadiusList(n, size) {
    var s = size || 0,
      list = [],
      i = 1;
    if (s === 0) {
      for (i = 0; i < n; i++) {
        list.push(10 * (1 + (i * 0.25)));
      }
    } else {
      for (i = 0; i < n; i++) {
        list.push(s);
      }
    }
    return list;
  }

  function getCoOrdsOnCircumference(radius, nmbrPts, origin) {
    var i,
      coords = [],
      extAngle = 2 * Math.PI / nmbrPts;

    origin = origin || {cx: 0, cy: 0};

    for (i = 0; i < nmbrPts; i++) {
      coords.push(convPolarToCartesion(radius, extAngle * i, origin));
    }
    return coords;
  }

  function getParamsOnCircumference(circRadius, radiusList, origin, spread) {
    var currAngle = 0,
      btwnAngle = 0,
      prevAngle = 0,
      incrParams = [],
      params = [],
      i,
      r,
      p,
      coords,
      incrAngle;

    spread = spread || 'even';

    for (i = 0; i < radiusList.length; i++) {
      r = radiusList[i];
      if ((circRadius - 2 * r) > 0) {
        incrParams.push({radius: r, incrAngle: Math.asin(r / (circRadius - r))});
      } else { break; }
    }

    if (spread === 'even') {
      btwnAngle = (function getAngleBetweenCircles(params) {
        var result = 0,
          totAngle = 0;

        if (params.length > 0) {
          params.forEach(function (p) {
            totAngle += 2 * p.incrAngle;
          });
          result = (2 * Math.PI - totAngle) / params.length;
        }
        return result;
      }(incrParams));
    }

    for (i = 0; i < incrParams.length; i++) {
      p = incrParams[i];
      incrAngle = p.incrAngle;

      if (i > 0) { currAngle += prevAngle + btwnAngle + incrAngle; }
      coords = convPolarToCartesion(circRadius - p.radius, currAngle, origin);
      params.push({x: coords.x, y: coords.y, r: p.radius});

      prevAngle = incrAngle;
    }

    return params;
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

  function getRadiusSize() {
    var radios = document.getElementsByName('radius'),
      result = 'fixed',
      i;

    for (i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        result = radios[i].value;
        break;
      }
    }
    return result === 'fixed' ? 25 : 0;
  }

  function getSpacing() {
    var radios = document.getElementsByName('spacing'),
      result = 'even',
      i;

    for (i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        result = radios[i].value;
        break;
      }
    }
    return result;
  }

  function refreshPoints(svg) {

    var cfg = getPolarOptions(),
      origin = {cx: cfg.cx, cy: cfg.cy},
      innerOptions = {r: 3, stroke: 'yellow'},
      outerOptions = {r: 4, fill: 'red', stroke: 'yellow'},
      radiusList = getRadiusList(cfg.n, getRadiusSize()),
      params = getParamsOnCircumference(cfg.r1, radiusList, origin, getSpacing()),
      coords = getCoOrdsOnCircumference(cfg.r1, params.length, origin);

    mySvg.removeGroups(svg);
    svg.appendChild(mySvg.svgCircles(coords, outerOptions));
    svg.appendChild(mySvg.svgCircles2(params, innerOptions));
  }

  function resetSvg(svg) {

    var cfg = getPolarOptions();

    while (svg.firstChild) {
      svg.removeChild(eSvg.firstChild);
    }

    mySvg.svgInit(svg, getSvgOptions());

    svg.appendChild(mySvg.svgDashedCircle({cx: cfg.cx, cy: cfg.cy, r: cfg.r1, stroke: 'yellow'}));
    //svg.appendChild(mySvg.svgDashedCircle({cx: cfg.cx, cy: cfg.cy, r: cfg.r2, stroke: 'yellow'}));

    refreshPoints(svg);
  }

  function timer(millis_, f_) {
    var id;

    function clear() {
      clearInterval(id);
      id = 0;
    }
    function start() {
      id = setInterval(f_, millis_);
    }
    function toggle() {
      if (id > 0) {
        clear();
      } else { start(); }
    }
    function isActive() { return !(id === 0); }

    return {
      isActive: isActive,
      clear: clear,
      start: start,
      toggle: toggle
    };
  }

  function decreaseValue(input) {
    var val = parseInt(input.value, 10),
      min = parseInt(input.min, 10),
      max = parseInt(input.max, 10),
      step = parseInt(input.step, 10);

    if (val > min) {
      input.value = val - step;
    } else {
      input.value = max;
    }
  }

  function increaseValue(input) {
    var val = parseInt(input.value, 10),
      min = parseInt(input.min, 10),
      max = parseInt(input.max, 10),
      step = parseInt(input.step, 10);

    if (val < max) {
      input.value = val + step;
    } else {
      input.value = min;
    }
  }

  function animateUp() {
    var counter = document.getElementById("counter");

    console.log(new Date());

    increaseValue(counter);
    refreshPoints(eSvg);
  }

  function animateDown() {
    var counter = document.getElementById("counter");

    console.log(new Date());

    decreaseValue(counter);
    refreshPoints(eSvg);
  }

  function addListeners(svg, tmrUp, tmrDown) {

    var eSize = document.getElementById("size"),
      eSizeUp = document.getElementById("size-up"),
      eSizeDown = document.getElementById("size-down"),
      eCounter = document.getElementById("counter"),
      eCounterUp = document.getElementById("counter-up"),
      eCounterDown = document.getElementById("counter-down"),
      eSpacingEven = document.getElementById("spacing-even"),
      eSpacingNone = document.getElementById("spacing-none"),

      eRadiusFixed = document.getElementById("radius-fixed"),
      eRadiusVariable = document.getElementById("radius-vrbl"),

      eAnimateUp = document.getElementById("animate-up"),
      eAnimateDown = document.getElementById("animate-down");

    eRadiusFixed.addEventListener("change", function () {
      refreshPoints(svg);
    }, false);

    eRadiusVariable.addEventListener("change", function () {
      refreshPoints(svg);
    }, false);

    eSpacingEven.addEventListener("change", function () {
      refreshPoints(svg);
    }, false);

    eSpacingNone.addEventListener("change", function () {
      refreshPoints(svg);
    }, false);

    eAnimateUp.addEventListener("click", function () {
      tmrUp.toggle();
      eAnimateUp.textContent = tmrUp.isActive() ? 'stop' : 'forward';
      eAnimateDown.disabled = tmrUp.isActive();
    }, false);

    eAnimateDown.addEventListener("click", function () {
      tmrDown.toggle();
      eAnimateDown.textContent = tmrDown.isActive() ? 'stop' : 'reverse';
      eAnimateUp.disabled = tmrDown.isActive();
    }, false);

    eSize.addEventListener("change", function () { resetSvg(svg); }, false);

    eSizeUp.addEventListener("click", function () {
      increaseValue(eSize);
      resetSvg(svg);
    }, false);

    eSizeDown.addEventListener("click", function () {
      decreaseValue(eSize);
      resetSvg(svg);
    }, false);

    eCounter.addEventListener("change", function () { refreshPoints(svg); }, false);

    eCounterUp.addEventListener("click", function () {
      increaseValue(eCounter);
      refreshPoints(svg);
    }, false);

    eCounterDown.addEventListener("click", function () {
      decreaseValue(eCounter);
      refreshPoints(svg);
    }, false);
  }

  eSvg = mySvg.svgElement(getSvgOptions());

  resetSvg(eSvg);

  eDemo = document.getElementById("demo");
  eDemo.appendChild(eSvg);

  timer1 = timer(100, animateUp);
  timer2 = timer(100, animateDown);
  addListeners(eSvg, timer1, timer2);

}());