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

  function getRadiusList(n) {
    var list = [],
      i = 1;
    for (i = 0; i < n; i++) {
      list.push(10 * (1 + (i * 0.25)));
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

  function getParamsOnCircumference(circRadius, radiusList, origin) {
    var i = 0,
      params = [],
      extAngle = 2 * Math.PI / radiusList.length;

    origin = origin || {cx: 0, cy: 0};

    radiusList.forEach(function (r) {
      var coords = convPolarToCartesion(circRadius - r, extAngle * i, origin);
      params.push({x: coords.x, y: coords.y, r: r});
      i++;
    });

    return params;
  }

  function getParamsOnCircumference2(circRadius, radiusList, origin) {
    var angle = 0,
      prevAngle = 0,
      incrParams = [],
      params = [],
      i,
      r,
      p,
      coords,
      incrAngle;

    for (i = 0; i < radiusList.length; i++) {
      r = radiusList[i];
      if ((circRadius - 2 * r) > 0) {
        incrParams.push({radius: r, incrAngle: Math.asin(r / (circRadius - r))});
      } else { break; }
    }

    for (i = 0; i < incrParams.length; i++) {
      p = incrParams[i];
      incrAngle = p.incrAngle;

      if (i > 0) { angle += prevAngle + incrAngle; }
      coords = convPolarToCartesion(circRadius - p.radius, angle, origin);
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

  function refreshPoints(svg) {

    var cfg = getPolarOptions(),
      origin = {cx: cfg.cx, cy: cfg.cy},
      innerOptions = {r: 3, stroke: 'yellow'},
      outerOptions = {r: 4, fill: 'red', stroke: 'yellow'},
      radiusList = getRadiusList(cfg.n);

    mySvg.removeGroups(svg);
    svg.appendChild(mySvg.svgCircles(getCoOrdsOnCircumference(cfg.r1, cfg.n, origin), outerOptions));
    svg.appendChild(mySvg.svgCircles2(getParamsOnCircumference2(cfg.r1, radiusList, origin), innerOptions));
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
      eAnimate = document.getElementById("animate"),
      eAnimateDown = document.getElementById("animate-down");

    eAnimate.addEventListener("click", function () {
      tmrUp.toggle();
      this.textContent = tmrUp.isActive() ? 'stop' : 'fwd';
    }, false);

    eAnimateDown.addEventListener("click", function () {
      tmrDown.toggle();
      this.textContent = tmrDown.isActive() ? 'stop' : 'rev';
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