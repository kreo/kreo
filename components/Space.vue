<template>
  <section :class="name">
    <div id="canvas"></div>
  </section>
</template>

<script>

  import * as THREE from 'three'

  (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var exports = {
  getRandomInt: function(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
  },
  getDegree: function(radian) {
    return radian / Math.PI * 180;
  },
  getRadian: function(degrees) {
    return degrees * Math.PI / 180;
  },
  getSpherical: function(rad1, rad2, r) {
    var x = Math.cos(rad1) * Math.cos(rad2) * r;
    var z = Math.cos(rad1) * Math.sin(rad2) * r;
    var y = Math.sin(rad1) * r;
    return [x, y, z];
  }
};

module.exports = exports;

},{}],2:[function(require,module,exports){
var Util = require('./util');

var exports = function(){
  var Camera = function() {
    this.rad1 = Util.getRadian(90);
    this.rad2 = Util.getRadian(0);
    this.range = 1000;
    this.obj;
  };

  Camera.prototype = {
    init: function(width, height) {
      this.obj = new THREE.PerspectiveCamera(35, width / height, 1, 10000);
      this.obj.up.set(0, 1, 0);
      this.setPosition();
      this.lookAtCenter();
    },
    reset: function() {
      this.setPosition();
      this.lookAtCenter();
    },
    resize: function(width, height) {
      this.obj.aspect = width / height;
      this.obj.updateProjectionMatrix();
    },
    setPosition: function() {
      var points = Util.getSpherical(this.rad1, this.rad2, this.range);
      this.obj.position.set(points[0], points[1], points[2]);
    },
    lookAtCenter: function() {
      this.obj.lookAt({
        x: 0,
        y: 0,
        z: 0
      });
    }
  };

  return Camera;
};

module.exports = exports();

},{"./util":8}],3:[function(require,module,exports){
module.exports = function(object, eventType, callback){
  var timer;

  object.addEventListener(eventType, function(event) {
    clearTimeout(timer);
    timer = setTimeout(function(){
      callback(event);
    }, 500);
  }, false);
};

},{}],4:[function(require,module,exports){
var exports = {
  friction: function(acceleration, mu, normal, mass) {
    var force = acceleration.clone();
    if (!normal) normal = 1;
    if (!mass) mass = 1;
    force.multiplyScalar(-1);
    force.normalize();
    force.multiplyScalar(mu);
    return force;
  },
  drag: function(acceleration, value) {
    var force = acceleration.clone();
    force.multiplyScalar(-1);
    force.normalize();
    force.multiplyScalar(acceleration.length() * value);
    return force;
  },
  hook: function(velocity, anchor, rest_length, k) {
    var force = velocity.clone().sub(anchor);
    var distance = force.length() - rest_length;
    force.normalize();
    force.multiplyScalar(-1 * k * distance);
    return force;
  }
};

module.exports = exports;

},{}],5:[function(require,module,exports){
var Util = require('./util');

var exports = function(){
  var HemiLight = function() {
    this.rad1 = Util.getRadian(60);
    this.rad2 = Util.getRadian(30);
    this.range = 1000;
    this.hex1 = 0xffffff;
    this.hex2 = 0x000000;
    this.intensity = 1;
    this.obj;
  };

  HemiLight.prototype = {
    init: function(hex1, hex2) {
      if (hex1) this.hex1 = hex1;
      if (hex2) this.hex2 = hex2;
      this.obj = new THREE.HemisphereLight(this.hex1, this.hex2, this.intensity);
      this.setPosition();
    },
    setPosition: function() {
      var points = Util.getSpherical(this.rad1, this.rad2, this.range);
      this.obj.position.set(points[0], points[1], points[2]);
    }
  };

  return HemiLight;
};

module.exports = exports();

},{"./util":8}],6:[function(require,module,exports){
var Util = require('./Util');
var debounce = require('./debounce');
var Camera = require('./camera');
var HemiLight = require('./hemiLight');
var Mover = require('./mover');

var body_width = document.body.clientWidth;
var body_height = document.body.clientHeight;
var last_time_activate = Date.now();

var canvas = null;
var renderer = null;
var scene = null;
var camera = null;
var light = null;

var movers_num = 10000;
var movers = [];
var points_geometry = null;
var points_material = null;
var points = null;

var textplate_geometry = null;
var textplate_material = null;
var textplate = null;

var antigravity = new THREE.Vector3(0, 30, 0);

var initThree = function() {
  canvas = document.getElementById('canvas');
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  if (!renderer) {
    alert('Three.js failed to load');
  }
  renderer.setSize(body_width, body_height);
  canvas.appendChild(renderer.domElement);
  renderer.setClearColor(0x111111, 1.0);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x000000, 800, 1600);

  camera = new Camera();
  camera.init(body_width, body_height);

  light = new HemiLight();
  light.init(0xffffff, 0xffffff);
  scene.add(light.obj);
};

var init = function() {
  initThree();
  buildPoints();
  renderloop();
  debounce(window, 'resize', function(event){
    resizeRenderer();
  });
};

var activateMover = function () {
  var count = 0;

  for (var i = 0; i < movers.length; i++) {
    var mover = movers[i];

    if (mover.is_active) continue;
    mover.activate();
    mover.velocity.y = -300;
    count++;
    if (count >= 50) break;
  }
};

var buildPoints = function() {
  var tx_canvas = document.createElement('canvas');
  var tx_ctx = tx_canvas.getContext('2d');
  var tx_grad = null;
  var texture = null;
  tx_canvas.width = 200;
  tx_canvas.height = 200;
  tx_grad = tx_ctx.createRadialGradient(100, 100, 20, 100, 100, 100);
  tx_grad.addColorStop(0.2, 'rgba(255, 255, 255, 1)');
  tx_grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
  tx_grad.addColorStop(1.0, 'rgba(255, 255, 255, 0)');
  tx_ctx.fillStyle = tx_grad;
  tx_ctx.arc(100, 100, 100, 0, Math.PI / 180, true);
  tx_ctx.fill();
  texture = new THREE.Texture(tx_canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.needsUpdate = true;

  points_geometry = new THREE.Geometry();
  points_material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 3,
    transparent: true,
    opacity: 0.8,
    map: texture,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  points_geometry2 = new THREE.Geometry();
  points_material2 = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 4,
    transparent: true,
    opacity: 1,
    map: texture,
    depthTest: false,
    blending: THREE.AdditiveBlending,
  });
  for (var i = 0; i < movers_num; i++) {
    var mover = new Mover();
    var range = Math.log(Util.getRandomInt(2, 256)) / Math.log(256) * 250 + 50;
    var rad = Util.getRadian(Util.getRandomInt(0, 180) * 2);
    var x = Math.cos(rad) * range;
    var z = Math.sin(rad) * range;
    mover.init(new THREE.Vector3(x, 1000, z));
    mover.mass = Util.getRandomInt(200, 500) / 100;
    movers.push(mover);
    if (i % 2 === 0) {
      points_geometry.vertices.push(mover.position);
    } else {
      points_geometry2.vertices.push(mover.position);
    }
  }
  points = new THREE.Points(points_geometry, points_material);
  points2 = new THREE.Points(points_geometry2, points_material2);
  scene.add(points);
  scene.add(points2);
};

var updatePoints = function() {
  var points_vertices = [];
  var points_vertices2 = [];
  for (var i = 0; i < movers.length; i++) {
    var mover = movers[i];
    if (mover.is_active) {
      mover.applyForce(antigravity);
      mover.updateVelocity();
      mover.updatePosition();
      if (mover.position.y > 1000) {
        var range = Math.log(Util.getRandomInt(2, 256)) / Math.log(256) * 250 + 50;
        var rad = Util.getRadian(Util.getRandomInt(0, 180) * 2);
        var x = Math.cos(rad) * range;
        var z = Math.sin(rad) * range;
        mover.init(new THREE.Vector3(x, -300, z));
        mover.mass = Util.getRandomInt(200, 500) / 100;
      }
    }
    if (i % 2 === 0) {
      points_vertices.push(mover.position);
    } else {
      points_vertices2.push(mover.position);
    }
  }
  points.geometry.vertices = points_vertices;
  points.geometry.verticesNeedUpdate = true;
  points2.geometry.vertices = points_vertices2;
  points2.geometry.verticesNeedUpdate = true;
};

var rotateCamera = function() {
  camera.rad2 += Util.getRadian(0.1);
  camera.reset();
};

var raycast = function(vector) {
  vector.x = (vector.x / window.innerWidth) * 2 - 1;
  vector.y = - (vector.y / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(vector, camera.obj);
  intersects = raycaster.intersectObjects(scene.children);
};

var render = function() {
  renderer.clear();
  updatePoints();
  rotateCamera();
  renderer.render(scene, camera.obj);
};

var renderloop = function() {
  var now = Date.now();
  requestAnimationFrame(renderloop);
  render();
  if (now - last_time_activate > 10) {
    activateMover();
    last_time_activate = Date.now();
  }
};

var resizeRenderer = function() {
  body_width  = document.body.clientWidth;
  body_height = document.body.clientHeight;
  renderer.setSize(body_width, body_height);
  camera.resize(body_width, body_height);
};

init();

},{"./Util":1,"./camera":2,"./debounce":3,"./hemiLight":5,"./mover":7}],7:[function(require,module,exports){
var Util = require('./util');
var Force = require('./force');

var exports = function(){
  var Mover = function() {
    this.position = new THREE.Vector3();
    this.velocity = new THREE.Vector3();
    this.acceleration = new THREE.Vector3();
    this.anchor = new THREE.Vector3();
    this.mass = 1;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 1;
    this.time = 0;
    this.is_active = false;
  };

  Mover.prototype = {
    init: function(vector) {
      this.position = vector.clone();
      this.velocity = vector.clone();
      this.anchor = vector.clone();
      this.acceleration.set(0, 0, 0);
      this.a = 1;
      this.time = 0;
    },
    updatePosition: function() {
      this.position.copy(this.velocity);
    },
    updateVelocity: function() {
      this.acceleration.divideScalar(this.mass);
      this.velocity.add(this.acceleration);
      // if (this.velocity.distanceTo(this.position) >= 1) {
      //   this.direct(this.velocity);
      // }
    },
    applyForce: function(vector) {
      this.acceleration.add(vector);
    },
    applyFriction: function() {
      var friction = Force.friction(this.acceleration, 0.1);
      this.applyForce(friction);
    },
    applyDragForce: function(value) {
      var drag = Force.drag(this.acceleration, value);
      this.applyForce(drag);
    },
    hook: function(rest_length, k) {
      var force = Force.hook(this.velocity, this.anchor, rest_length, k);
      this.applyForce(force);
    },
    activate: function () {
      this.is_active = true;
    },
    inactivate: function () {
      this.is_active = false;
    }
  };

  return Mover;
};

module.exports = exports();

},{"./force":4,"./util":8}],8:[function(require,module,exports){
arguments[4][1][0].apply(exports,arguments)
},{"dup":1}]},{},[6])

</script>

<style scoped>
  canvas {
    position: absolute;
  }
</style>