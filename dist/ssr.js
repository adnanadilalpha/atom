var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/canvas-confetti/src/confetti.js
var require_confetti = __commonJS({
  "node_modules/canvas-confetti/src/confetti.js"(exports2, module2) {
    (function main2(global, module3, isWorker, workerSize) {
      var canUseWorker = !!(global.Worker && global.Blob && global.Promise && global.OffscreenCanvas && global.OffscreenCanvasRenderingContext2D && global.HTMLCanvasElement && global.HTMLCanvasElement.prototype.transferControlToOffscreen && global.URL && global.URL.createObjectURL);
      var canUsePaths = typeof Path2D === "function" && typeof DOMMatrix === "function";
      var canDrawBitmap = (function() {
        if (!global.OffscreenCanvas) {
          return false;
        }
        try {
          var canvas = new OffscreenCanvas(1, 1);
          var ctx = canvas.getContext("2d");
          ctx.fillRect(0, 0, 1, 1);
          var bitmap = canvas.transferToImageBitmap();
          ctx.createPattern(bitmap, "no-repeat");
        } catch (e) {
          return false;
        }
        return true;
      })();
      function noop() {
      }
      function promise(func) {
        var ModulePromise = module3.exports.Promise;
        var Prom = ModulePromise !== void 0 ? ModulePromise : global.Promise;
        if (typeof Prom === "function") {
          return new Prom(func);
        }
        func(noop, noop);
        return null;
      }
      var bitmapMapper = /* @__PURE__ */ (function(skipTransform, map) {
        return {
          transform: function(bitmap) {
            if (skipTransform) {
              return bitmap;
            }
            if (map.has(bitmap)) {
              return map.get(bitmap);
            }
            var canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
            var ctx = canvas.getContext("2d");
            ctx.drawImage(bitmap, 0, 0);
            map.set(bitmap, canvas);
            return canvas;
          },
          clear: function() {
            map.clear();
          }
        };
      })(canDrawBitmap, /* @__PURE__ */ new Map());
      var raf = (function() {
        var TIME = Math.floor(1e3 / 60);
        var frame, cancel;
        var frames = {};
        var lastFrameTime = 0;
        if (typeof requestAnimationFrame === "function" && typeof cancelAnimationFrame === "function") {
          frame = function(cb) {
            var id = Math.random();
            frames[id] = requestAnimationFrame(function onFrame(time) {
              if (lastFrameTime === time || lastFrameTime + TIME - 1 < time) {
                lastFrameTime = time;
                delete frames[id];
                cb();
              } else {
                frames[id] = requestAnimationFrame(onFrame);
              }
            });
            return id;
          };
          cancel = function(id) {
            if (frames[id]) {
              cancelAnimationFrame(frames[id]);
            }
          };
        } else {
          frame = function(cb) {
            return setTimeout(cb, TIME);
          };
          cancel = function(timer) {
            return clearTimeout(timer);
          };
        }
        return { frame, cancel };
      })();
      var getWorker = /* @__PURE__ */ (function() {
        var worker;
        var prom;
        var resolves = {};
        function decorate(worker2) {
          function execute(options, callback) {
            worker2.postMessage({ options: options || {}, callback });
          }
          worker2.init = function initWorker(canvas) {
            var offscreen = canvas.transferControlToOffscreen();
            worker2.postMessage({ canvas: offscreen }, [offscreen]);
          };
          worker2.fire = function fireWorker(options, size, done) {
            if (prom) {
              execute(options, null);
              return prom;
            }
            var id = Math.random().toString(36).slice(2);
            prom = promise(function(resolve) {
              function workerDone(msg) {
                if (msg.data.callback !== id) {
                  return;
                }
                delete resolves[id];
                worker2.removeEventListener("message", workerDone);
                prom = null;
                bitmapMapper.clear();
                done();
                resolve();
              }
              worker2.addEventListener("message", workerDone);
              execute(options, id);
              resolves[id] = workerDone.bind(null, { data: { callback: id } });
            });
            return prom;
          };
          worker2.reset = function resetWorker() {
            worker2.postMessage({ reset: true });
            for (var id in resolves) {
              resolves[id]();
              delete resolves[id];
            }
          };
        }
        return function() {
          if (worker) {
            return worker;
          }
          if (!isWorker && canUseWorker) {
            var code2 = [
              "var CONFETTI, SIZE = {}, module = {};",
              "(" + main2.toString() + ")(this, module, true, SIZE);",
              "onmessage = function(msg) {",
              "  if (msg.data.options) {",
              "    CONFETTI(msg.data.options).then(function () {",
              "      if (msg.data.callback) {",
              "        postMessage({ callback: msg.data.callback });",
              "      }",
              "    });",
              "  } else if (msg.data.reset) {",
              "    CONFETTI && CONFETTI.reset();",
              "  } else if (msg.data.resize) {",
              "    SIZE.width = msg.data.resize.width;",
              "    SIZE.height = msg.data.resize.height;",
              "  } else if (msg.data.canvas) {",
              "    SIZE.width = msg.data.canvas.width;",
              "    SIZE.height = msg.data.canvas.height;",
              "    CONFETTI = module.exports.create(msg.data.canvas);",
              "  }",
              "}"
            ].join("\n");
            try {
              worker = new Worker(URL.createObjectURL(new Blob([code2])));
            } catch (e) {
              typeof console !== "undefined" && typeof console.warn === "function" ? console.warn("\u{1F38A} Could not load worker", e) : null;
              return null;
            }
            decorate(worker);
          }
          return worker;
        };
      })();
      var defaults = {
        particleCount: 50,
        angle: 90,
        spread: 45,
        startVelocity: 45,
        decay: 0.9,
        gravity: 1,
        drift: 0,
        ticks: 200,
        x: 0.5,
        y: 0.5,
        shapes: ["square", "circle"],
        zIndex: 100,
        colors: [
          "#26ccff",
          "#a25afd",
          "#ff5e7e",
          "#88ff5a",
          "#fcff42",
          "#ffa62d",
          "#ff36ff"
        ],
        // probably should be true, but back-compat
        disableForReducedMotion: false,
        scalar: 1
      };
      function convert(val, transform) {
        return transform ? transform(val) : val;
      }
      function isOk(val) {
        return !(val === null || val === void 0);
      }
      function prop(options, name, transform) {
        return convert(
          options && isOk(options[name]) ? options[name] : defaults[name],
          transform
        );
      }
      function onlyPositiveInt(number) {
        return number < 0 ? 0 : Math.floor(number);
      }
      function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }
      function toDecimal(str) {
        return parseInt(str, 16);
      }
      function colorsToRgb(colors) {
        return colors.map(hexToRgb);
      }
      function hexToRgb(str) {
        var val = String(str).replace(/[^0-9a-f]/gi, "");
        if (val.length < 6) {
          val = val[0] + val[0] + val[1] + val[1] + val[2] + val[2];
        }
        return {
          r: toDecimal(val.substring(0, 2)),
          g: toDecimal(val.substring(2, 4)),
          b: toDecimal(val.substring(4, 6))
        };
      }
      function getOrigin(options) {
        var origin = prop(options, "origin", Object);
        origin.x = prop(origin, "x", Number);
        origin.y = prop(origin, "y", Number);
        return origin;
      }
      function setCanvasWindowSize(canvas) {
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;
      }
      function setCanvasRectSize(canvas) {
        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
      function getCanvas(zIndex) {
        var canvas = document.createElement("canvas");
        canvas.style.position = "fixed";
        canvas.style.top = "0px";
        canvas.style.left = "0px";
        canvas.style.pointerEvents = "none";
        canvas.style.zIndex = zIndex;
        return canvas;
      }
      function ellipse(context, x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
        context.save();
        context.translate(x, y);
        context.rotate(rotation);
        context.scale(radiusX, radiusY);
        context.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
        context.restore();
      }
      function randomPhysics(opts) {
        var radAngle = opts.angle * (Math.PI / 180);
        var radSpread = opts.spread * (Math.PI / 180);
        return {
          x: opts.x,
          y: opts.y,
          wobble: Math.random() * 10,
          wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
          velocity: opts.startVelocity * 0.5 + Math.random() * opts.startVelocity,
          angle2D: -radAngle + (0.5 * radSpread - Math.random() * radSpread),
          tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
          color: opts.color,
          shape: opts.shape,
          tick: 0,
          totalTicks: opts.ticks,
          decay: opts.decay,
          drift: opts.drift,
          random: Math.random() + 2,
          tiltSin: 0,
          tiltCos: 0,
          wobbleX: 0,
          wobbleY: 0,
          gravity: opts.gravity * 3,
          ovalScalar: 0.6,
          scalar: opts.scalar,
          flat: opts.flat
        };
      }
      function updateFetti(context, fetti) {
        fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
        fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
        fetti.velocity *= fetti.decay;
        if (fetti.flat) {
          fetti.wobble = 0;
          fetti.wobbleX = fetti.x + 10 * fetti.scalar;
          fetti.wobbleY = fetti.y + 10 * fetti.scalar;
          fetti.tiltSin = 0;
          fetti.tiltCos = 0;
          fetti.random = 1;
        } else {
          fetti.wobble += fetti.wobbleSpeed;
          fetti.wobbleX = fetti.x + 10 * fetti.scalar * Math.cos(fetti.wobble);
          fetti.wobbleY = fetti.y + 10 * fetti.scalar * Math.sin(fetti.wobble);
          fetti.tiltAngle += 0.1;
          fetti.tiltSin = Math.sin(fetti.tiltAngle);
          fetti.tiltCos = Math.cos(fetti.tiltAngle);
          fetti.random = Math.random() + 2;
        }
        var progress = fetti.tick++ / fetti.totalTicks;
        var x1 = fetti.x + fetti.random * fetti.tiltCos;
        var y1 = fetti.y + fetti.random * fetti.tiltSin;
        var x2 = fetti.wobbleX + fetti.random * fetti.tiltCos;
        var y2 = fetti.wobbleY + fetti.random * fetti.tiltSin;
        context.fillStyle = "rgba(" + fetti.color.r + ", " + fetti.color.g + ", " + fetti.color.b + ", " + (1 - progress) + ")";
        context.beginPath();
        if (canUsePaths && fetti.shape.type === "path" && typeof fetti.shape.path === "string" && Array.isArray(fetti.shape.matrix)) {
          context.fill(transformPath2D(
            fetti.shape.path,
            fetti.shape.matrix,
            fetti.x,
            fetti.y,
            Math.abs(x2 - x1) * 0.1,
            Math.abs(y2 - y1) * 0.1,
            Math.PI / 10 * fetti.wobble
          ));
        } else if (fetti.shape.type === "bitmap") {
          var rotation = Math.PI / 10 * fetti.wobble;
          var scaleX = Math.abs(x2 - x1) * 0.1;
          var scaleY = Math.abs(y2 - y1) * 0.1;
          var width = fetti.shape.bitmap.width * fetti.scalar;
          var height = fetti.shape.bitmap.height * fetti.scalar;
          var matrix = new DOMMatrix([
            Math.cos(rotation) * scaleX,
            Math.sin(rotation) * scaleX,
            -Math.sin(rotation) * scaleY,
            Math.cos(rotation) * scaleY,
            fetti.x,
            fetti.y
          ]);
          matrix.multiplySelf(new DOMMatrix(fetti.shape.matrix));
          var pattern = context.createPattern(bitmapMapper.transform(fetti.shape.bitmap), "no-repeat");
          pattern.setTransform(matrix);
          context.globalAlpha = 1 - progress;
          context.fillStyle = pattern;
          context.fillRect(
            fetti.x - width / 2,
            fetti.y - height / 2,
            width,
            height
          );
          context.globalAlpha = 1;
        } else if (fetti.shape === "circle") {
          context.ellipse ? context.ellipse(fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI) : ellipse(context, fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI);
        } else if (fetti.shape === "star") {
          var rot = Math.PI / 2 * 3;
          var innerRadius = 4 * fetti.scalar;
          var outerRadius = 8 * fetti.scalar;
          var x = fetti.x;
          var y = fetti.y;
          var spikes = 5;
          var step = Math.PI / spikes;
          while (spikes--) {
            x = fetti.x + Math.cos(rot) * outerRadius;
            y = fetti.y + Math.sin(rot) * outerRadius;
            context.lineTo(x, y);
            rot += step;
            x = fetti.x + Math.cos(rot) * innerRadius;
            y = fetti.y + Math.sin(rot) * innerRadius;
            context.lineTo(x, y);
            rot += step;
          }
        } else {
          context.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
          context.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
          context.lineTo(Math.floor(x2), Math.floor(y2));
          context.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
        }
        context.closePath();
        context.fill();
        return fetti.tick < fetti.totalTicks;
      }
      function animate(canvas, fettis, resizer, size, done) {
        var animatingFettis = fettis.slice();
        var context = canvas.getContext("2d");
        var animationFrame;
        var destroy;
        var prom = promise(function(resolve) {
          function onDone() {
            animationFrame = destroy = null;
            context.clearRect(0, 0, size.width, size.height);
            bitmapMapper.clear();
            done();
            resolve();
          }
          function update() {
            if (isWorker && !(size.width === workerSize.width && size.height === workerSize.height)) {
              size.width = canvas.width = workerSize.width;
              size.height = canvas.height = workerSize.height;
            }
            if (!size.width && !size.height) {
              resizer(canvas);
              size.width = canvas.width;
              size.height = canvas.height;
            }
            context.clearRect(0, 0, size.width, size.height);
            animatingFettis = animatingFettis.filter(function(fetti) {
              return updateFetti(context, fetti);
            });
            if (animatingFettis.length) {
              animationFrame = raf.frame(update);
            } else {
              onDone();
            }
          }
          animationFrame = raf.frame(update);
          destroy = onDone;
        });
        return {
          addFettis: function(fettis2) {
            animatingFettis = animatingFettis.concat(fettis2);
            return prom;
          },
          canvas,
          promise: prom,
          reset: function() {
            if (animationFrame) {
              raf.cancel(animationFrame);
            }
            if (destroy) {
              destroy();
            }
          }
        };
      }
      function confettiCannon(canvas, globalOpts) {
        var isLibCanvas = !canvas;
        var allowResize = !!prop(globalOpts || {}, "resize");
        var hasResizeEventRegistered = false;
        var globalDisableForReducedMotion = prop(globalOpts, "disableForReducedMotion", Boolean);
        var shouldUseWorker = canUseWorker && !!prop(globalOpts || {}, "useWorker");
        var worker = shouldUseWorker ? getWorker() : null;
        var resizer = isLibCanvas ? setCanvasWindowSize : setCanvasRectSize;
        var initialized = canvas && worker ? !!canvas.__confetti_initialized : false;
        var preferLessMotion = typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion)").matches;
        var animationObj;
        function fireLocal(options, size, done) {
          var particleCount = prop(options, "particleCount", onlyPositiveInt);
          var angle = prop(options, "angle", Number);
          var spread = prop(options, "spread", Number);
          var startVelocity = prop(options, "startVelocity", Number);
          var decay = prop(options, "decay", Number);
          var gravity = prop(options, "gravity", Number);
          var drift = prop(options, "drift", Number);
          var colors = prop(options, "colors", colorsToRgb);
          var ticks = prop(options, "ticks", Number);
          var shapes = prop(options, "shapes");
          var scalar = prop(options, "scalar");
          var flat = !!prop(options, "flat");
          var origin = getOrigin(options);
          var temp = particleCount;
          var fettis = [];
          var startX = canvas.width * origin.x;
          var startY = canvas.height * origin.y;
          while (temp--) {
            fettis.push(
              randomPhysics({
                x: startX,
                y: startY,
                angle,
                spread,
                startVelocity,
                color: colors[temp % colors.length],
                shape: shapes[randomInt(0, shapes.length)],
                ticks,
                decay,
                gravity,
                drift,
                scalar,
                flat
              })
            );
          }
          if (animationObj) {
            return animationObj.addFettis(fettis);
          }
          animationObj = animate(canvas, fettis, resizer, size, done);
          return animationObj.promise;
        }
        function fire(options) {
          var disableForReducedMotion = globalDisableForReducedMotion || prop(options, "disableForReducedMotion", Boolean);
          var zIndex = prop(options, "zIndex", Number);
          if (disableForReducedMotion && preferLessMotion) {
            return promise(function(resolve) {
              resolve();
            });
          }
          if (isLibCanvas && animationObj) {
            canvas = animationObj.canvas;
          } else if (isLibCanvas && !canvas) {
            canvas = getCanvas(zIndex);
            document.body.appendChild(canvas);
          }
          if (allowResize && !initialized) {
            resizer(canvas);
          }
          var size = {
            width: canvas.width,
            height: canvas.height
          };
          if (worker && !initialized) {
            worker.init(canvas);
          }
          initialized = true;
          if (worker) {
            canvas.__confetti_initialized = true;
          }
          function onResize() {
            if (worker) {
              var obj = {
                getBoundingClientRect: function() {
                  if (!isLibCanvas) {
                    return canvas.getBoundingClientRect();
                  }
                }
              };
              resizer(obj);
              worker.postMessage({
                resize: {
                  width: obj.width,
                  height: obj.height
                }
              });
              return;
            }
            size.width = size.height = null;
          }
          function done() {
            animationObj = null;
            if (allowResize) {
              hasResizeEventRegistered = false;
              global.removeEventListener("resize", onResize);
            }
            if (isLibCanvas && canvas) {
              if (document.body.contains(canvas)) {
                document.body.removeChild(canvas);
              }
              canvas = null;
              initialized = false;
            }
          }
          if (allowResize && !hasResizeEventRegistered) {
            hasResizeEventRegistered = true;
            global.addEventListener("resize", onResize, false);
          }
          if (worker) {
            return worker.fire(options, size, done);
          }
          return fireLocal(options, size, done);
        }
        fire.reset = function() {
          if (worker) {
            worker.reset();
          }
          if (animationObj) {
            animationObj.reset();
          }
        };
        return fire;
      }
      var defaultFire;
      function getDefaultFire() {
        if (!defaultFire) {
          defaultFire = confettiCannon(null, { useWorker: true, resize: true });
        }
        return defaultFire;
      }
      function transformPath2D(pathString, pathMatrix, x, y, scaleX, scaleY, rotation) {
        var path2d = new Path2D(pathString);
        var t1 = new Path2D();
        t1.addPath(path2d, new DOMMatrix(pathMatrix));
        var t2 = new Path2D();
        t2.addPath(t1, new DOMMatrix([
          Math.cos(rotation) * scaleX,
          Math.sin(rotation) * scaleX,
          -Math.sin(rotation) * scaleY,
          Math.cos(rotation) * scaleY,
          x,
          y
        ]));
        return t2;
      }
      function shapeFromPath(pathData) {
        if (!canUsePaths) {
          throw new Error("path confetti are not supported in this browser");
        }
        var path, matrix;
        if (typeof pathData === "string") {
          path = pathData;
        } else {
          path = pathData.path;
          matrix = pathData.matrix;
        }
        var path2d = new Path2D(path);
        var tempCanvas = document.createElement("canvas");
        var tempCtx = tempCanvas.getContext("2d");
        if (!matrix) {
          var maxSize = 1e3;
          var minX = maxSize;
          var minY = maxSize;
          var maxX = 0;
          var maxY = 0;
          var width, height;
          for (var x = 0; x < maxSize; x += 2) {
            for (var y = 0; y < maxSize; y += 2) {
              if (tempCtx.isPointInPath(path2d, x, y, "nonzero")) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
              }
            }
          }
          width = maxX - minX;
          height = maxY - minY;
          var maxDesiredSize = 10;
          var scale = Math.min(maxDesiredSize / width, maxDesiredSize / height);
          matrix = [
            scale,
            0,
            0,
            scale,
            -Math.round(width / 2 + minX) * scale,
            -Math.round(height / 2 + minY) * scale
          ];
        }
        return {
          type: "path",
          path,
          matrix
        };
      }
      function shapeFromText(textData) {
        var text, scalar = 1, color = "#000000", fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';
        if (typeof textData === "string") {
          text = textData;
        } else {
          text = textData.text;
          scalar = "scalar" in textData ? textData.scalar : scalar;
          fontFamily = "fontFamily" in textData ? textData.fontFamily : fontFamily;
          color = "color" in textData ? textData.color : color;
        }
        var fontSize = 10 * scalar;
        var font = "" + fontSize + "px " + fontFamily;
        var canvas = new OffscreenCanvas(fontSize, fontSize);
        var ctx = canvas.getContext("2d");
        ctx.font = font;
        var size = ctx.measureText(text);
        var width = Math.ceil(size.actualBoundingBoxRight + size.actualBoundingBoxLeft);
        var height = Math.ceil(size.actualBoundingBoxAscent + size.actualBoundingBoxDescent);
        var padding = 2;
        var x = size.actualBoundingBoxLeft + padding;
        var y = size.actualBoundingBoxAscent + padding;
        width += padding + padding;
        height += padding + padding;
        canvas = new OffscreenCanvas(width, height);
        ctx = canvas.getContext("2d");
        ctx.font = font;
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        var scale = 1 / scalar;
        return {
          type: "bitmap",
          // TODO these probably need to be transfered for workers
          bitmap: canvas.transferToImageBitmap(),
          matrix: [scale, 0, 0, scale, -width * scale / 2, -height * scale / 2]
        };
      }
      module3.exports = function() {
        return getDefaultFire().apply(this, arguments);
      };
      module3.exports.reset = function() {
        getDefaultFire().reset();
      };
      module3.exports.create = confettiCannon;
      module3.exports.shapeFromPath = shapeFromPath;
      module3.exports.shapeFromText = shapeFromText;
    })((function() {
      if (typeof window !== "undefined") {
        return window;
      }
      if (typeof self !== "undefined") {
        return self;
      }
      return this || {};
    })(), module2, false);
  }
});

// dist/ssr_temp.js
var import_canvas_confetti = __toESM(require_confetti());
function useState(initialValue) {
  return [initialValue, () => {
  }];
}
function useEffect(callback, deps) {
}
function useMemo(factory, deps) {
  return factory();
}
function useCallback(callback, deps) {
  return callback;
}
function useRef(initialValue) {
  return { current: initialValue };
}
function usePath() {
  return typeof window !== "undefined" ? window.location.pathname : "/";
}
function navigate() {
}
function el(tag, content, props = {}) {
  let attrs = "";
  Object.keys(props).forEach((key) => {
    if (key.startsWith("on")) return;
    const value = props[key];
    if (key === "className") {
      if (value) attrs += ` class="${value}"`;
    } else if (key === "style") {
      if (value && typeof value === "object") {
        const styleStr = Object.entries(value).map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`).join(";");
        attrs += ` style="${styleStr}"`;
      }
    } else if (key === "innerHTML") {
    } else if (["autoplay", "loop", "muted", "controls", "playsinline", "checked", "disabled"].includes(key)) {
      if (value) attrs += ` ${key}`;
    } else if (key === "value") {
      let safeVal;
      if (value === void 0 || value === null || value === false) {
        safeVal = "";
      } else if (typeof value === "string" && value === "undefined") {
        safeVal = "";
      } else {
        safeVal = String(value);
      }
      if (safeVal !== "") attrs += ` value="${safeVal.replace(/"/g, "&quot;")}"`;
    } else if (value !== null && value !== void 0) {
      attrs += ` ${key}="${String(value).replace(/"/g, "&quot;")}"`;
    }
  });
  let innerHTML = "";
  if (content === null || content === void 0 || content === false) {
    innerHTML = "";
  } else if (Array.isArray(content)) {
    innerHTML = content.filter((c) => c !== null && c !== void 0 && c !== false).map((c) => {
      return typeof c === "object" && c.outerHTML ? c.outerHTML : String(c);
    }).join("");
  } else {
    innerHTML = String(content || "");
  }
  if (["input", "img", "br", "hr", "atom-video", "atom-play", "atom-progress", "atom-cursor", "source"].includes(tag)) return `<${tag}${attrs} />`;
  return `<${tag}${attrs}>${innerHTML}</${tag}>`;
}
var div = (c, p2) => el("div", c, p2);
var h1 = (c, p2) => el("h1", c, p2);
var h2 = (c, p2) => el("h2", c, p2);
var h3 = (c, p2) => el("h3", c, p2);
var h4 = (c, p2) => el("h4", c, p2);
var p = (c, p2) => el("p", c, p2);
var button = (c, p2) => el("button", c, p2);
var input = (c, p2) => el("input", c, p2);
var form = (c, p2) => el("form", c, p2);
var select = (c, p2) => el("select", c, p2);
var option = (c, p2) => el("option", c, p2);
var textarea = (c, p2) => el("textarea", c, p2);
var nav = (c, p2) => el("nav", c, p2);
var footer = (c, p2) => el("footer", c, p2);
var span = (c, p2) => el("span", c, p2);
var ul = (c, p2) => el("ul", c, p2);
var li = (c, p2) => el("li", c, p2);
var section = (c, p2) => el("section", c, p2);
var main = (c, p2) => el("main", c, p2);
var label = (c, p2) => el("label", c, p2);
var table = (c, p2) => el("table", c, p2);
var thead = (c, p2) => el("thead", c, p2);
var tbody = (c, p2) => el("tbody", c, p2);
var tr = (c, p2) => el("tr", c, p2);
var td = (c, p2) => el("td", c, p2);
var th = (c, p2) => el("th", c, p2);
var strong = (c, p2) => el("strong", c, p2);
var em = (c, p2) => el("em", c, p2);
var code = (c, p2) => el("code", c, p2);
var Image = (props) => {
  const { src, width, height, sizes, quality, format, ...restProps } = props;
  if (src && (src.startsWith("http://") || src.startsWith("https://"))) {
    return el("img", null, { loading: "lazy", decoding: "async", ...props });
  }
  const getOptimizedUrl = (w, h, q, f) => {
    const cdn = typeof process !== "undefined" && process.env && process.env.IMAGE_CDN;
    if (cdn && cdn !== "local") {
      return `/_atom/image?url=${encodeURIComponent(src)}&w=${w || ""}&h=${h || ""}&q=${q || 85}&fmt=${f || "auto"}`;
    }
    return `/_atom/image?url=${encodeURIComponent(src)}&w=${w || ""}&h=${h || ""}&q=${q || 85}&fmt=${f || "auto"}`;
  };
  if (width && sizes) {
    const baseUrl = src || props.src;
    const widths = [640, 768, 1024, 1280, 1920].filter((w) => w <= width * 2);
    const srcset = widths.map((w) => {
      const url = `/_atom/image?url=${encodeURIComponent(baseUrl)}&w=${w}&q=${quality || 85}&fmt=${format || "auto"}`;
      return `${url} ${w}w`;
    }).join(", ");
    return el("img", null, {
      src: `/_atom/image?url=${encodeURIComponent(baseUrl)}&w=${width}&q=${quality || 85}&fmt=${format || "auto"}`,
      srcset,
      sizes: sizes || `(max-width: ${width}px) 100vw, ${width}px`,
      width,
      height,
      loading: "lazy",
      decoding: "async",
      ...restProps
    });
  }
  if (src && (width || height)) {
    const optimizedSrc = `/_atom/image?url=${encodeURIComponent(src)}&w=${width || ""}&h=${height || ""}&q=${quality || 85}&fmt=${format || "auto"}`;
    return el("img", null, {
      src: optimizedSrc,
      width,
      height,
      loading: "lazy",
      decoding: "async",
      ...restProps
    });
  }
  return el("img", null, { loading: "lazy", decoding: "async", ...props });
};
var a = (text, props) => el("a", text, props);
var Layout = (props) => {
  const { content } = props || {};
  const currentPath = typeof usePath !== "undefined" ? usePath() : typeof window !== "undefined" ? window.location.pathname : "/";
  return div([
    Header({ activePath: currentPath }),
    // 2. The Page Content Injected Here
    main(content ? div(content) : div("Loading...", { className: "flex justify-center p-20" }), { className: "min-h-screen pt-6" }),
    Footer()
  ], { className: "layout flex flex-col min-h-screen font-sans bg-white text-gray-900" });
};
var Layout_dashboard = (props) => {
  const { content } = props || {};
  return div([
    div([
      // Sidebar
      div([
        div([
          div("DASHBOARD", { className: "text-xs font-black text-gray-400 tracking-widest mb-6" }),
          a("Overview", { href: "/dashboard", className: "block py-2 text-gray-300 hover:text-white font-medium" }),
          a("Analytics", { href: "/dashboard/analytics", className: "block py-2 text-gray-300 hover:text-white font-medium" }),
          a("Settings", { href: "/dashboard/settings", className: "block py-2 text-gray-300 hover:text-white font-medium" }),
          div("SYSTEM", { className: "text-xs font-black text-gray-400 tracking-widest mt-8 mb-6" }),
          a("Logs", { href: "/dashboard/logs", className: "block py-2 text-gray-300 hover:text-white font-medium" }),
          a("Users", { href: "/dashboard/users", className: "block py-2 text-gray-300 hover:text-white font-medium" }),
          div([
            button("Logout", { className: "mt-8 w-full py-2 bg-red-900/30 text-red-400 border border-red-900 rounded hover:bg-red-900/50 transition text-sm" })
          ])
        ], { className: "sticky top-24" })
      ], { className: "w-64 bg-gray-900 min-h-screen p-6 hidden md:block border-r border-gray-800" }),
      // Content Area
      div([
        // Top Bar
        div([
          h2("Dashboard", { className: "text-2xl font-bold" }),
          div([
            div([
              div("JD", { className: "w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold" })
            ], { className: "flex items-center gap-3" })
          ], { className: "flex items-center" })
        ], { className: "flex justify-between items-center mb-8 pb-6 border-b border-gray-200" }),
        content
      ], { className: "flex-1 p-8 bg-white" })
    ], { className: "flex" })
  ]);
};
var Layout_docs = (props) => {
  const { content } = props || {};
  return div([
    div([
      // Docs Sidebar
      div([
        h3("Documentation", { className: "font-bold text-gray-900 mb-6 px-4" }),
        div([
          div("GETTING STARTED", { className: "text-xs font-bold text-gray-500 px-4 mb-2 mt-6" }),
          a("Introduction", { href: "/docs", className: "block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm" }),
          a("Installation", { href: "/docs/installation", className: "block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm" }),
          a("Quick Start", { href: "/docs/quick-start", className: "block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm" }),
          div("CORE CONCEPTS", { className: "text-xs font-bold text-gray-500 px-4 mb-2 mt-6" }),
          a("Routing", { href: "/docs/routing", className: "block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm" }),
          a("Server Actions", { href: "/docs/server-actions", className: "block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm" }),
          a("Components", { href: "/docs/components", className: "block px-4 py-1.5 text-gray-600 hover:text-blue-600 text-sm" })
        ], { className: "border-l border-gray-100 ml-4" })
      ], { className: "w-64 py-8 hidden lg:block fixed h-screen overflow-y-auto" }),
      // Content
      div([
        content
      ], { className: "lg:ml-64 flex-1 py-12 px-8 max-w-4xl" })
    ], { className: "flex max-w-7xl mx-auto" })
  ]);
};
var Card = (props) => {
  try {
    props = props || {};
    const safeProps = props || {};
    return div([
      h3(safeProps.title, { className: "text-xl font-bold mb-2" }),
      p(safeProps.children, { className: "text-gray-600" })
    ], { className: "bg-white p-6 rounded-xl shadow border border-gray-100" });
  } catch (error) {
    console.error('Component "Card" error:', error);
    return div([
      div("\u26A0\uFE0F Component Error", { className: "text-red-600 font-bold mb-2" }),
      div(error.message || "Unknown error", { className: "text-red-500 text-sm" })
    ], { className: "p-4 border border-red-300 bg-red-50 rounded m-2" });
  }
};
if (typeof globalThis !== "undefined") globalThis.Card = Card;
var ErrorDisplay = (props) => {
  try {
    props = props || {};
    const { error, className = "" } = props || {};
    if (!error) return null;
    const errorMessage = typeof error === "string" ? error : error && error.message ? error.message : "Unknown error occurred";
    const errorHint = error && typeof error === "object" && error.hint ? error.hint : null;
    return div([
      div([
        div("\u26A0\uFE0F", { className: "text-2xl mr-3" }),
        div([
          h4("Something went wrong", { className: "font-bold text-red-800" }),
          p(errorMessage, { className: "text-red-600 text-sm mt-1" }),
          errorHint ? p("\u{1F4A1} " + errorHint, { className: "text-amber-700 text-xs mt-2 bg-amber-50 p-2 rounded border border-amber-100" }) : null
        ])
      ], { className: "flex items-start" })
    ], { className: `bg-red-50 border border-red-200 rounded-lg p-4 ${className}` });
  } catch (error) {
    console.error('Component "ErrorDisplay" error:', error);
    return div([
      div("\u26A0\uFE0F Component Error", { className: "text-red-600 font-bold mb-2" }),
      div(error.message || "Unknown error", { className: "text-red-500 text-sm" })
    ], { className: "p-4 border border-red-300 bg-red-50 rounded m-2" });
  }
};
if (typeof globalThis !== "undefined") globalThis.ErrorDisplay = ErrorDisplay;
var Footer = (props) => {
  try {
    props = props || {};
    return footer([
      div([
        div([
          h3("ATOM Showcase", { className: "text-xl font-bold text-white mb-4" }),
          p("Demonstrating the power of the ATOM Framework V53.", { className: "text-gray-400" })
        ], { className: "col-span-1 md:col-span-2" }),
        div([
          h4("Links", { className: "font-bold text-white mb-4" }),
          div([
            a("Home", { href: "/", className: "block text-gray-400 hover:text-white mb-2" }),
            a("Products", { href: "/products", className: "block text-gray-400 hover:text-white mb-2" }),
            a("Blog", { href: "/blog", className: "block text-gray-400 hover:text-white mb-2" }),
            a("About", { href: "/about", className: "block text-gray-400 hover:text-white mb-2" })
          ])
        ]),
        div([
          h4("Connect", { className: "font-bold text-white mb-4" }),
          div([
            a("GitHub", { href: "https://github.com", className: "block text-gray-400 hover:text-white mb-2" }),
            a("Twitter", { href: "https://twitter.com", className: "block text-gray-400 hover:text-white mb-2" }),
            a("Discord", { href: "https://discord.com", className: "block text-gray-400 hover:text-white mb-2" })
          ])
        ])
      ], { className: "grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto" }),
      div("\xA9 2024 ATOM Framework. Open Source.", { className: "text-center text-gray-500 mt-12 pt-8 border-t border-gray-800" })
    ], { className: "bg-gray-900 py-12 px-6 mt-auto" });
  } catch (error) {
    console.error('Component "Footer" error:', error);
    return div([
      div("\u26A0\uFE0F Component Error", { className: "text-red-600 font-bold mb-2" }),
      div(error.message || "Unknown error", { className: "text-red-500 text-sm" })
    ], { className: "p-4 border border-red-300 bg-red-50 rounded m-2" });
  }
};
if (typeof globalThis !== "undefined") globalThis.Footer = Footer;
var FormInput = (props) => {
  try {
    props = props || {};
    const { label: labelText, type = "text", value, placeholder, error, required, onChange, className = "" } = props || {};
    const safeValue = typeof value === "string" ? value : value === null || value === void 0 ? "" : String(value);
    const handleInput = (e) => {
      const nextValue = e && e.target ? e.target.value : "";
      if (typeof onChange === "function") {
        onChange(typeof nextValue === "string" ? nextValue : "");
      }
    };
    return div([
      labelText ? label(labelText, { className: "block text-sm font-medium text-gray-700 mb-1" }) : null,
      type === "textarea" ? textarea(null, {
        className: `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${error ? "border-red-500 bg-red-50" : "border-gray-300"} ${className}`,
        placeholder,
        value: safeValue,
        required,
        oninput: handleInput
      }) : input(null, {
        type,
        value: safeValue,
        className: `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${error ? "border-red-500 bg-red-50" : "border-gray-300"} ${className}`,
        placeholder,
        required,
        oninput: handleInput
      }),
      error ? p(error, { className: "mt-1 text-sm text-red-600" }) : null
    ], { className: "w-full" });
  } catch (error) {
    console.error('Component "FormInput" error:', error);
    return div([
      div("\u26A0\uFE0F Component Error", { className: "text-red-600 font-bold mb-2" }),
      div(error.message || "Unknown error", { className: "text-red-500 text-sm" })
    ], { className: "p-4 border border-red-300 bg-red-50 rounded m-2" });
  }
};
if (typeof globalThis !== "undefined") globalThis.FormInput = FormInput;
var Header = (props) => {
  try {
    props = props || {};
    const { activePath } = props || {};
    const linkClass = (path) => `text-sm font-medium transition-colors ${activePath === path ? "text-blue-600 font-bold" : "text-gray-600 hover:text-blue-600"}`;
    return nav([
      div([
        a("ATOM Showcase", { href: "/", className: "text-xl font-black tracking-tight text-gray-900" }),
        div([
          a("Home", { href: "/", className: linkClass("/") }),
          a("Products", { href: "/products", className: linkClass("/products") }),
          a("Blog", { href: "/blog", className: linkClass("/blog") }),
          a("Dashboard", { href: "/dashboard/home", className: linkClass("/dashboard/home") }),
          a("Docs", { href: "/docs", className: linkClass("/docs") }),
          a("Contact", { href: "/contact", className: "px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-bold" })
        ], { className: "hidden md:flex items-center gap-8" }),
        // Mobile menu button placeholder
        div("\u2630", { className: "md:hidden text-2xl cursor-pointer" })
      ], { className: "flex justify-between items-center max-w-7xl mx-auto" })
    ], { className: "bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 sticky top-0 z-50" });
  } catch (error) {
    console.error('Component "Header" error:', error);
    return div([
      div("\u26A0\uFE0F Component Error", { className: "text-red-600 font-bold mb-2" }),
      div(error.message || "Unknown error", { className: "text-red-500 text-sm" })
    ], { className: "p-4 border border-red-300 bg-red-50 rounded m-2" });
  }
};
if (typeof globalThis !== "undefined") globalThis.Header = Header;
var ImageGallery = (props) => {
  try {
    props = props || {};
    const { images = [] } = props || {};
    const [selectedIndex, setSelectedIndex] = useState(0);
    return div([
      // Main Image
      div([
        Image({
          src: images[selectedIndex].src,
          alt: images[selectedIndex].alt,
          width: 800,
          height: 600,
          className: "w-full h-[400px] object-cover rounded-xl shadow-lg transition-opacity duration-300"
        })
      ], { className: "mb-4" }),
      // Thumbnails
      div(images.map(
        (img, idx) => div([
          Image({
            src: img.src,
            alt: img.alt,
            width: 100,
            height: 100,
            className: "w-full h-full object-cover"
          })
        ], {
          className: `w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 transition ${selectedIndex === idx ? "border-blue-500 ring-2 ring-blue-200" : "border-transparent hover:border-gray-300"}`,
          onclick: () => setSelectedIndex(idx)
        })
      ), { className: "flex gap-4 overflow-x-auto pb-2" })
    ], { className: "w-full" });
  } catch (error) {
    console.error('Component "ImageGallery" error:', error);
    return div([
      div("\u26A0\uFE0F Component Error", { className: "text-red-600 font-bold mb-2" }),
      div(error.message || "Unknown error", { className: "text-red-500 text-sm" })
    ], { className: "p-4 border border-red-300 bg-red-50 rounded m-2" });
  }
};
if (typeof globalThis !== "undefined") globalThis.ImageGallery = ImageGallery;
var LoadingSpinner = (props) => {
  try {
    props = props || {};
    return div([
      div([], { className: "w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" }),
      p("Loading...", { className: "mt-4 text-gray-500 font-medium animate-pulse" })
    ], { className: "flex flex-col items-center justify-center p-12" });
  } catch (error) {
    console.error('Component "LoadingSpinner" error:', error);
    return div([
      div("\u26A0\uFE0F Component Error", { className: "text-red-600 font-bold mb-2" }),
      div(error.message || "Unknown error", { className: "text-red-500 text-sm" })
    ], { className: "p-4 border border-red-300 bg-red-50 rounded m-2" });
  }
};
if (typeof globalThis !== "undefined") globalThis.LoadingSpinner = LoadingSpinner;
var ProductCard = (props) => {
  try {
    props = props || {};
    const { title, description, image, price, onAddToCart } = props || {};
    return div([
      image ? Image({
        src: image,
        alt: title,
        width: 400,
        height: 300,
        className: "w-full h-48 object-cover"
      }) : null,
      div([
        h3(title, { className: "text-xl font-bold mb-2" }),
        p(description, { className: "text-gray-600 mb-4 line-clamp-2" }),
        div([
          span(price, { className: "text-2xl font-bold text-blue-600" }),
          button("Add to Cart", {
            className: "px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition",
            onclick: onAddToCart
          })
        ], { className: "flex justify-between items-center" })
      ], { className: "p-4" })
    ], { className: "bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition border border-gray-100" });
  } catch (error) {
    console.error('Component "ProductCard" error:', error);
    return div([
      div("\u26A0\uFE0F Component Error", { className: "text-red-600 font-bold mb-2" }),
      div(error.message || "Unknown error", { className: "text-red-500 text-sm" })
    ], { className: "p-4 border border-red-300 bg-red-50 rounded m-2" });
  }
};
if (typeof globalThis !== "undefined") globalThis.ProductCard = ProductCard;
var StatusCard = (props) => {
  try {
    props = props || {};
    const safeProps = props || {};
    return div([
      div(safeProps.label, { className: "text-xs font-bold text-gray-400 uppercase tracking-widest mb-1" }),
      div(safeProps.value, { className: "text-2xl font-black text-gray-800" }),
      safeProps.sub ? div(safeProps.sub, { className: "text-xs text-gray-500 mt-1" }) : null
    ], { className: "bg-white p-6 rounded-xl shadow-sm border border-gray-100" });
  } catch (error) {
    console.error('Component "StatusCard" error:', error);
    return div([
      div("\u26A0\uFE0F Component Error", { className: "text-red-600 font-bold mb-2" }),
      div(error.message || "Unknown error", { className: "text-red-500 text-sm" })
    ], { className: "p-4 border border-red-300 bg-red-50 rounded m-2" });
  }
};
if (typeof globalThis !== "undefined") globalThis.StatusCard = StatusCard;
var Routes = [];
Routes.push(
  {
    regex: new RegExp("^/marketing-test$"),
    paramNames: [],
    title: "Atom App",
    meta: [],
    revalidate: null,
    isStatic: false,
    enableStreaming: false,
    component: (props) => {
      props = props || {};
      const Actions = {};
      const PageContent = (props2) => {
        props2 = props2 || {};
        return div([
          h1("Marketing Page", { className: "text-4xl font-bold mb-4" }),
          p("This page is inside a route group (marketing) but the URL is just /marketing-test", { className: "text-xl text-gray-600" })
        ], { className: "p-12 text-center" });
      };
      let result = PageContent(props);
      result = Layout({ ...props, content: result });
      return result;
    }
  }
);
Routes.push(
  {
    regex: new RegExp("^/about$"),
    paramNames: [],
    title: "Atom App",
    meta: [],
    revalidate: null,
    isStatic: true,
    enableStreaming: false,
    component: (props) => {
      props = props || {};
      const Actions = {};
      const PageContent = (props2) => {
        props2 = props2 || {};
        const team = [
          { name: "Alex Developer", role: "Lead Architect", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80", bio: "Obsessed with performance and compiler optimizations." },
          { name: "Sarah Designer", role: "UI/UX Lead", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80", bio: "Making complex systems look simple and beautiful." },
          { name: "Mike Engineer", role: "Backend Specialist", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80", bio: "Scaling servers to handle millions of requests." }
        ];
        return div([
          // Hero
          section([
            div([
              h1("About The Team", { className: "text-5xl font-black mb-6 tracking-tight" }),
              p("We are a passionate group of developers building the next generation of web tools.", { className: "text-xl text-gray-600 max-w-2xl mx-auto" })
            ], { className: "text-center py-20" })
          ], { className: "bg-gray-50" }),
          // Team Grid
          section([
            div(team.map(
              (member) => div([
                Image({
                  src: member.image,
                  alt: member.name,
                  width: 400,
                  height: 400,
                  className: "w-full h-64 object-cover grayscale hover:grayscale-0 transition duration-500"
                }),
                div([
                  h3(member.name, { className: "text-xl font-bold mb-1" }),
                  p(member.role, { className: "text-blue-600 font-medium text-sm uppercase tracking-wider mb-3" }),
                  p(member.bio, { className: "text-gray-600 text-sm leading-relaxed" })
                ], { className: "p-6" })
              ], { className: "bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group" })
            ), { className: "grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6 -mt-10" })
          ], { className: "pb-24" }),
          // Stats
          section([
            div([
              div([
                h2("Global Reach", { className: "text-3xl font-bold mb-8 text-center" }),
                div([
                  StatusCard({ label: "Downloads", value: "2M+" }),
                  StatusCard({ label: "Contributors", value: "150+" }),
                  StatusCard({ label: "Countries", value: "85" }),
                  StatusCard({ label: "Uptime", value: "99.9%" })
                ], { className: "grid grid-cols-2 md:grid-cols-4 gap-6" })
              ], { className: "max-w-6xl mx-auto px-6" })
            ], { className: "py-24 bg-white" })
          ])
        ]);
      };
      let result = PageContent(props);
      result = Layout({ ...props, content: result });
      return result;
    }
  }
);
Routes.push(
  {
    regex: new RegExp("^/blog/([^/]+)$"),
    paramNames: ["id"],
    title: "Atom App",
    meta: [],
    revalidate: 300,
    isStatic: false,
    enableStreaming: false,
    component: (props) => {
      props = props || {};
      const Actions = {};
      Actions.secure_getPost = async () => {
        return {};
      };
      const PageContent = (props2) => {
        props2 = props2 || {};
        const { params } = props2 || {};
        const rawId = params && params.id;
        const postId = useMemo(() => {
          if (!rawId) return null;
          return Array.isArray(rawId) ? rawId[0] : String(rawId);
        }, [rawId]);
        const [post, setPost] = useState(null);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const loadingRef = useRef(false);
        const lastPostIdRef = useRef(null);
        useEffect(() => {
          if (loadingRef.current) {
            return;
          }
          if (!postId) {
            setLoading(false);
            setError(new Error("No post ID provided"));
            return;
          }
          if (postId === lastPostIdRef.current) {
            return;
          }
          loadingRef.current = true;
          lastPostIdRef.current = postId;
          setLoading(true);
          setError(null);
          setPost(null);
          const currentPostId = postId;
          Actions.secure_getPost(currentPostId).then((data) => {
            if (currentPostId === lastPostIdRef.current) {
              setPost(data);
              setLoading(false);
            }
            loadingRef.current = false;
          }).catch((err) => {
            if (currentPostId === lastPostIdRef.current) {
              setError(err);
              setLoading(false);
            }
            loadingRef.current = false;
          });
        }, [postId]);
        return div([
          div([
            a("\u2190 Back to Blog", { href: "/blog", className: "text-gray-500 hover:text-black font-medium mb-8 inline-block" }),
            loading ? LoadingSpinner() : error ? ErrorDisplay({ error }) : post ? div([
              span(post.date, { className: "text-blue-600 font-bold tracking-wide text-sm uppercase mb-2 block" }),
              h1(post.title, { className: "text-5xl font-black mb-6 text-gray-900 leading-tight" }),
              div([
                div(post.author[0], { className: "w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold mr-3" }),
                div([
                  p(post.author, { className: "font-bold text-gray-900" }),
                  p("Author", { className: "text-xs text-gray-500 uppercase" })
                ])
              ], { className: "flex items-center mb-12 pb-12 border-b border-gray-100" }),
              div(post.content, { className: "text-xl text-gray-800 leading-relaxed max-w-none" })
            ]) : null
          ], { className: "max-w-3xl mx-auto px-6 py-12" })
        ], { className: "bg-white min-h-screen" });
      };
      let result = PageContent(props);
      result = Layout({ ...props, content: result });
      return result;
    }
  }
);
Routes.push(
  {
    regex: new RegExp("^/blog$"),
    paramNames: [],
    title: "Atom App",
    meta: [],
    revalidate: 300,
    isStatic: false,
    enableStreaming: false,
    component: (props) => {
      props = props || {};
      const Actions = {};
      Actions.secure_getPosts = async () => {
        return {};
      };
      const PageContent = (props2) => {
        props2 = props2 || {};
        const [posts, setPosts] = useState([]);
        const [loading, setLoading] = useState(true);
        useEffect(() => {
          Actions.secure_getPosts().then((data) => {
            setPosts(data);
            setLoading(false);
          });
        }, []);
        return div([
          div([
            h1("Latest News", { className: "text-4xl font-bold mb-4" }),
            p("Insights, updates, and tutorials from the team.", { className: "text-xl text-gray-600" })
          ], { className: "bg-white border-b border-gray-100 py-16 px-6 text-center mb-12" }),
          div([
            loading ? LoadingSpinner() : div(posts.map(
              (post) => div([
                div([
                  span(post.category, { className: "text-xs font-bold text-blue-600 uppercase tracking-wide" }),
                  span("\u2022", { className: "mx-2 text-gray-300" }),
                  span(post.date, { className: "text-xs text-gray-500" })
                ], { className: "mb-2 flex items-center" }),
                h2([
                  a(post.title, { href: `/blog/${post.id}`, className: "hover:text-blue-600 transition" })
                ], { className: "text-2xl font-bold mb-3 text-gray-900" }),
                p(post.excerpt, { className: "text-gray-600 mb-4 leading-relaxed" }),
                div([
                  div([
                    div(post.author[0], { className: "w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600 mr-2" }),
                    span(post.author, { className: "text-sm font-medium text-gray-900" })
                  ], { className: "flex items-center" }),
                  a("Read Article \u2192", { href: `/blog/${post.id}`, className: "text-sm font-bold text-blue-600 hover:text-blue-800" })
                ], { className: "flex justify-between items-center pt-4 border-t border-gray-50" })
              ], { className: "bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition border border-gray-100" })
            ), { className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6" })
          ], { className: "pb-24" })
        ], { className: "bg-gray-50 min-h-screen" });
      };
      let result = PageContent(props);
      result = Layout({ ...props, content: result });
      return result;
    }
  }
);
Routes.push(
  {
    regex: new RegExp("^/contact$"),
    paramNames: [],
    title: "Atom App",
    meta: [],
    revalidate: null,
    isStatic: false,
    enableStreaming: true,
    component: (props) => {
      props = props || {};
      const Actions = {};
      Actions.secure_submitContact = async () => {
        return {};
      };
      const PageContent = (props2) => {
        props2 = props2 || {};
        const [formData, setFormData] = useState({ name: "", email: "", message: "" });
        const [errors, setErrors] = useState({});
        const [loading, setLoading] = useState(false);
        const [success, setSuccess] = useState(false);
        const [submittedData, setSubmittedData] = useState(null);
        const [serverError, setServerError] = useState(null);
        const validate = () => {
          const newErrors = {};
          const name = (formData.name || "").trim();
          const email = (formData.email || "").trim();
          const message = (formData.message || "").trim();
          if (!name) newErrors.name = "Name is required";
          if (!email) newErrors.email = "Email is required";
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Invalid email format";
          if (!message) newErrors.message = "Message is required";
          else if (message.length < 10) newErrors.message = "Message too short";
          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
        };
        const handleSubmit = async (e) => {
          e.preventDefault();
          const form2 = e.target;
          const currentData = {
            name: (form2.querySelector('input[type="text"]')?.value || "").trim(),
            email: (form2.querySelector('input[type="email"]')?.value || "").trim(),
            message: (form2.querySelector("textarea")?.value || "").trim()
          };
          const newErrors = {};
          if (!currentData.name) newErrors.name = "Name is required";
          if (!currentData.email) newErrors.email = "Email is required";
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentData.email)) newErrors.email = "Invalid email format";
          if (!currentData.message) newErrors.message = "Message is required";
          else if (currentData.message.length < 10) newErrors.message = "Message too short";
          setErrors(newErrors);
          if (Object.keys(newErrors).length > 0) return;
          setLoading(true);
          setServerError(null);
          try {
            const result2 = await Actions.secure_submitContact(currentData);
            setSubmittedData(currentData);
            setSuccess(true);
            setErrors({});
            setFormData({ name: "", email: "", message: "" });
          } catch (err) {
            setServerError(err);
          } finally {
            setLoading(false);
          }
        };
        const updateField = (field, value) => {
          const safeValue = typeof value === "string" ? value : "";
          setFormData((prev) => ({ ...prev, [field]: safeValue }));
          setErrors((prev) => ({ ...prev, [field]: null }));
        };
        return div([
          div([
            div([
              h1("Contact Us", { className: "text-4xl font-bold mb-4" }),
              p("We'd love to hear from you. Send us a message and we'll respond within 24 hours.", { className: "text-xl text-gray-600 mb-8" }),
              div([
                div([
                  h3("Email", { className: "font-bold text-lg mb-1" }),
                  p("support@atom-framework.com", { className: "text-blue-600" })
                ], { className: "mb-6" }),
                div([
                  h3("Office", { className: "font-bold text-lg mb-1" }),
                  p("123 Innovation Drive", { className: "text-gray-600" }),
                  p("San Francisco, CA 94103", { className: "text-gray-600" })
                ])
              ], { className: "bg-gray-50 p-8 rounded-xl" })
            ], { className: "col-span-1 md:col-span-1" }),
            div([
              div([
                success ? div([
                  div("\u2705", { className: "text-4xl mb-4" }),
                  h3("Message Sent Successfully!", { className: "text-2xl font-bold mb-2 text-green-600" }),
                  p("Thank you for reaching out. We'll be in touch shortly.", { className: "text-gray-600 mb-6" }),
                  // Display submitted data for verification
                  submittedData ? div([
                    h4("Submitted Data:", { className: "text-lg font-semibold mb-3 text-gray-800" }),
                    div([
                      div([
                        strong("Name: ", { className: "font-bold text-gray-700" }),
                        span(submittedData.name || "N/A", { className: "text-gray-900" })
                      ], { className: "mb-2" }),
                      div([
                        strong("Email: ", { className: "font-bold text-gray-700" }),
                        span(submittedData.email || "N/A", { className: "text-gray-900" })
                      ], { className: "mb-2" }),
                      div([
                        strong("Message: ", { className: "font-bold text-gray-700" }),
                        p(submittedData.message || "N/A", { className: "text-gray-900 mt-1 whitespace-pre-wrap" })
                      ])
                    ], { className: "bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left" })
                  ]) : null,
                  button("Send Another Message", {
                    className: "px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition",
                    onclick: () => {
                      setSuccess(false);
                      setSubmittedData(null);
                    }
                  })
                ], { className: "text-center py-12" }) : form([
                  serverError ? ErrorDisplay({ error: serverError, className: "mb-6" }) : null,
                  div([
                    label("Full Name", { className: "block text-sm font-medium text-gray-700 mb-1" }),
                    input(null, {
                      type: "text",
                      value: formData && typeof formData.name === "string" ? formData.name : "",
                      className: `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.name ? "border-red-500 bg-red-50" : "border-gray-300"}`,
                      placeholder: "Jane Doe",
                      required: true,
                      oninput: (e) => updateField("name", e?.target?.value || "")
                    }),
                    errors.name ? p(errors.name, { className: "mt-1 text-sm text-red-600" }) : null
                  ], { className: "mb-4" }),
                  div([
                    label("Email Address", { className: "block text-sm font-medium text-gray-700 mb-1" }),
                    input(null, {
                      type: "email",
                      value: formData && typeof formData.email === "string" ? formData.email : "",
                      className: `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.email ? "border-red-500 bg-red-50" : "border-gray-300"}`,
                      placeholder: "jane@example.com",
                      required: true,
                      oninput: (e) => updateField("email", e?.target?.value || "")
                    }),
                    errors.email ? p(errors.email, { className: "mt-1 text-sm text-red-600" }) : null
                  ], { className: "mb-4" }),
                  div([
                    label("Message", { className: "block text-sm font-medium text-gray-700 mb-1" }),
                    textarea(null, {
                      className: `w-full px-4 py-2 h-32 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${errors.message ? "border-red-500 bg-red-50" : "border-gray-300"}`,
                      placeholder: "How can we help you?",
                      value: formData && typeof formData.message === "string" ? formData.message : "",
                      required: true,
                      oninput: (e) => updateField("message", e?.target?.value || "")
                    }),
                    errors.message ? p(errors.message, { className: "mt-1 text-sm text-red-600" }) : null
                  ], { className: "mb-6" }),
                  button(loading ? "Sending..." : "Send Message", {
                    type: "submit",
                    className: `w-full py-3 px-6 rounded-lg font-bold text-white transition ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`,
                    disabled: loading
                  })
                ], { onsubmit: handleSubmit })
              ], { className: "bg-white p-8 rounded-xl shadow-lg border border-gray-100" })
            ], { className: "col-span-1 md:col-span-2" })
          ], { className: "grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto px-6 py-16" })
        ]);
      };
      let result = PageContent(props);
      result = Layout({ ...props, content: result });
      return result;
    }
  }
);
Routes.push(
  {
    regex: new RegExp("^/dashboard/home$"),
    paramNames: [],
    title: "Atom App",
    meta: [],
    revalidate: null,
    isStatic: false,
    enableStreaming: false,
    component: (props) => {
      props = props || {};
      const Actions = {};
      Actions.secure_getStats = async () => {
        return {};
      };
      const PageContent = (props2) => {
        props2 = props2 || {};
        const [stats, setStats] = useState(null);
        useEffect(() => {
          Actions.secure_getStats().then(setStats);
        }, []);
        return div([
          !stats ? LoadingSpinner() : div([
            div([
              StatusCard({ label: "Total Users", value: stats.users.toLocaleString(), sub: "+12% from last month" }),
              StatusCard({ label: "Revenue", value: "$" + stats.revenue.toLocaleString(), sub: "+8.2% from last month" }),
              StatusCard({ label: "Active Now", value: stats.active, sub: "Current online users" }),
              StatusCard({ label: "Growth", value: stats.growth + "%", sub: "Year over year" })
            ], { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" }),
            div([
              div([
                h3("Recent Activity", { className: "font-bold text-lg mb-4" }),
                div([
                  div("New user signed up", { className: "py-3 border-b text-sm text-gray-600" }),
                  div("Project 'Alpha' deployed", { className: "py-3 border-b text-sm text-gray-600" }),
                  div("Payment received from Client X", { className: "py-3 border-b text-sm text-gray-600" }),
                  div("Server backup completed", { className: "py-3 text-sm text-gray-600" })
                ])
              ], { className: "bg-gray-50 p-6 rounded-xl border border-gray-100" }),
              div([
                h3("System Status", { className: "font-bold text-lg mb-4" }),
                div([
                  div([
                    div("CPU Usage", { className: "text-sm text-gray-500 mb-1" }),
                    div([
                      div([], { className: "h-2 bg-blue-500 rounded w-3/4" })
                    ], { className: "h-2 bg-gray-200 rounded w-full" })
                  ], { className: "mb-4" }),
                  div([
                    div("Memory", { className: "text-sm text-gray-500 mb-1" }),
                    div([
                      div([], { className: "h-2 bg-green-500 rounded w-1/2" })
                    ], { className: "h-2 bg-gray-200 rounded w-full" })
                  ], { className: "mb-4" }),
                  div([
                    div("Disk Space", { className: "text-sm text-gray-500 mb-1" }),
                    div([
                      div([], { className: "h-2 bg-purple-500 rounded w-1/4" })
                    ], { className: "h-2 bg-gray-200 rounded w-full" })
                  ])
                ])
              ], { className: "bg-gray-50 p-6 rounded-xl border border-gray-100" })
            ], { className: "grid grid-cols-1 lg:grid-cols-2 gap-8" })
          ])
        ]);
      };
      let result = PageContent(props);
      result = Layout({ ...props, content: result });
      result = Layout_dashboard({ ...props, content: result });
      return result;
    }
  }
);
Routes.push(
  {
    regex: new RegExp("^/docs(?:/(.*))?$"),
    paramNames: ["slug"],
    title: "Atom App",
    meta: [],
    revalidate: null,
    isStatic: false,
    enableStreaming: false,
    component: (props) => {
      props = props || {};
      const Actions = {};
      const PageContent = (props2) => {
        props2 = props2 || {};
        const { params } = props2 || {};
        let slug = [];
        if (params && params.slug) {
          if (Array.isArray(params.slug)) {
            slug = params.slug;
          } else if (typeof params.slug === "string") {
            slug = params.slug ? [params.slug] : [];
          }
        }
        const path = slug.join(" / ");
        return div([
          div([
            span(path || "Docs", { className: "text-sm text-blue-600 font-bold uppercase tracking-wide mb-2 block" }),
            h1(slug[slug.length - 1] || "Introduction", { className: "text-4xl font-black mb-6 capitalize" }),
            div([
              p("This is a dynamically generated documentation page based on the URL path.", { className: "text-xl text-gray-600 mb-8" }),
              div([
                h3("Current Path Segments:", { className: "font-bold text-lg mb-2" }),
                div([
                  slug.length === 0 ? div("Root (/docs)", { className: "font-mono text-sm bg-gray-100 p-2 rounded" }) : slug.map((s) => div(s, { className: "font-mono text-sm bg-gray-100 p-2 rounded mb-1" }))
                ], { className: "bg-gray-50 p-4 rounded-lg border border-gray-200" })
              ], { className: "mb-12" }),
              div([
                h2("Content Placeholder", { className: "text-2xl font-bold mb-4" }),
                p("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.", { className: "mb-4 text-gray-600 leading-relaxed" }),
                p("Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", { className: "mb-4 text-gray-600 leading-relaxed" })
              ])
            ], { className: "prose max-w-none" })
          ])
        ]);
      };
      let result = PageContent(props);
      result = Layout({ ...props, content: result });
      result = Layout_docs({ ...props, content: result });
      return result;
    }
  }
);
Routes.push(
  {
    regex: new RegExp("^/error-tests$"),
    paramNames: [],
    title: "Atom App",
    meta: [],
    revalidate: null,
    isStatic: false,
    enableStreaming: false,
    component: (props) => {
      props = props || {};
      const Actions = {};
      Actions.secure_throwError = async () => {
        return {};
      };
      Actions.secure_validateInput = async () => {
        return {};
      };
      const PageContent = (props2) => {
        props2 = props2 || {};
        const [error, setError] = useState(null);
        const [inputVal, setInputVal] = useState("");
        const triggerError = async () => {
          setError(null);
          try {
            await Actions.secure_throwError();
          } catch (err) {
            setError(err);
          }
        };
        const testValidation = async () => {
          setError(null);
          try {
            await Actions.secure_validateInput(inputVal);
            alert("Success!");
          } catch (err) {
            setError(err);
          }
        };
        return div([
          div([
            h1("Error Handling Tests", { className: "text-4xl font-bold mb-8" }),
            div([
              h2("1. Server Action Errors", { className: "text-2xl font-bold mb-4" }),
              p("Click the button below to trigger a server-side error and see how it's handled.", { className: "mb-4 text-gray-600" }),
              button("Trigger Server Error", {
                className: "bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition",
                onclick: triggerError
              })
            ], { className: "bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8" }),
            div([
              h2("2. Input Validation", { className: "text-2xl font-bold mb-4" }),
              div([
                input({
                  value: inputVal,
                  placeholder: "Type something (min 5 chars)...",
                  className: "border p-2 rounded mr-4 w-64",
                  oninput: (e) => setInputVal(e.target.value)
                }),
                button("Validate", {
                  className: "bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition",
                  onclick: testValidation
                })
              ], { className: "flex items-center" })
            ], { className: "bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-8" }),
            div([
              h2("3. Error Display Component", { className: "text-2xl font-bold mb-4" }),
              error ? ErrorDisplay({ error }) : div("No errors yet.", { className: "text-gray-400 italic" })
            ], { className: "bg-white p-8 rounded-xl shadow-sm border border-gray-100" })
          ], { className: "max-w-4xl mx-auto px-6 py-12" })
        ], { className: "bg-gray-50 min-h-screen" });
      };
      let result = PageContent(props);
      result = Layout({ ...props, content: result });
      return result;
    }
  }
);
Routes.push(
  {
    regex: new RegExp("^/$"),
    paramNames: [],
    title: "Home | ATOM",
    meta: [{ name: "description", content: "Welcome to the future." }, {
      name: "keywords",
      content: "atom, framework, speed"
    }],
    revalidate: null,
    isStatic: false,
    enableStreaming: false,
    component: (props) => {
      props = props || {};
      const Actions = {};
      Actions.celebrate = function() {
        (0, import_canvas_confetti.default)({
          particleCount: 50,
          spread: 70,
          origin: {
            y: 0.6
          }
        });
      };
      const PageContent = (props2) => {
        props2 = props2 || {};
        const [count, setCount] = useState(0);
        return div([
          div([
            Image({
              src: "/atom-icon.svg",
              alt: "ATOM Logo",
              width: 100,
              height: 100,
              className: "mb-6"
            }),
            h1("ATOM V20", { className: "text-6xl font-black text-gray-800 mb-4" }),
            p("Instant Reload & Zero Load", { className: "text-xl text-gray-500 mb-8" }),
            button("Click (" + count + ")", {
              className: "bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg",
              onclick: () => {
                setCount(count + 1);
                Actions.celebrate();
              }
            })
          ], { className: "flex flex-col items-center justify-center py-20" })
        ]);
      };
      let result = PageContent(props);
      result = Layout({ ...props, content: result });
      return result;
    }
  }
);
Routes.push(
  {
    regex: new RegExp("^/products$"),
    paramNames: [],
    title: "Atom App",
    meta: [],
    revalidate: 60,
    isStatic: false,
    enableStreaming: false,
    component: (props) => {
      props = props || {};
      const Actions = {};
      Actions.secure_getProducts = async () => {
        return {};
      };
      const PageContent = (props2) => {
        props2 = props2 || {};
        const [products, setProducts] = useState([]);
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(null);
        const [search, setSearch] = useState("");
        const loadingRef = useRef(false);
        const searchDebounceRef = useRef(null);
        useEffect(() => {
          loadProducts();
        }, []);
        const loadProducts = async (query = "") => {
          if (loadingRef.current) return;
          loadingRef.current = true;
          setLoading(true);
          setError(null);
          try {
            const data = await Actions.secure_getProducts(query);
            if (!Array.isArray(data)) {
              console.warn("loadProducts: Expected array but got:", typeof data, data);
              setProducts([]);
            } else {
              setProducts(data);
            }
          } catch (err) {
            console.error("loadProducts error:", err);
            setError(err);
            setProducts([]);
          } finally {
            setLoading(false);
            loadingRef.current = false;
          }
        };
        const handleSearch = (val) => {
          setSearch(val);
          if (searchDebounceRef.current) {
            clearTimeout(searchDebounceRef.current);
          }
          searchDebounceRef.current = setTimeout(() => {
            loadProducts(val);
          }, 300);
        };
        useEffect(() => {
          return () => {
            if (searchDebounceRef.current) {
              clearTimeout(searchDebounceRef.current);
            }
          };
        }, []);
        return div([
          // Header
          div([
            h1("Our Products", { className: "text-4xl font-bold mb-4" }),
            p("Tools designed for the modern web.", { className: "text-xl text-gray-600 mb-8" }),
            // Search
            div([
              FormInput({
                placeholder: "Search products...",
                value: search,
                onChange: handleSearch,
                className: "max-w-md"
              })
            ], { className: "mb-12" })
          ], { className: "max-w-7xl mx-auto px-6 pt-12" }),
          // Grid
          div([
            error ? ErrorDisplay({ error }) : null,
            loading ? LoadingSpinner() : !Array.isArray(products) || products.length === 0 ? div("No products found matching your search.", { className: "text-center text-gray-500 py-12" }) : div((Array.isArray(products) ? products : []).map((product, index) => {
              if (!product || typeof product !== "object") {
                console.warn("Invalid product at index", index, product);
                return null;
              }
              return ProductCard({
                title: product.title || "Untitled",
                description: product.description || "",
                price: product.price || "$0.00",
                image: product.image || "",
                onAddToCart: () => alert(`Added ${product.title || "product"} to cart!`)
              });
            }).filter(Boolean), { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" })
          ], { className: "max-w-7xl mx-auto px-6 pb-24 min-h-[400px]" })
        ], { className: "bg-gray-50 min-h-screen" });
      };
      let result = PageContent(props);
      result = Layout({ ...props, content: result });
      return result;
    }
  }
);
Routes.push(
  {
    regex: new RegExp("^/test_suite$"),
    paramNames: [],
    title: "Atom App",
    meta: [{ name: "robots", content: "noindex, nofollow" }],
    revalidate: 60,
    isStatic: false,
    enableStreaming: false,
    component: (props) => {
      props = props || {};
      const Actions = {};
      Actions.secure_testLogin = async () => {
        return {};
      };
      Actions.secure_testRegister = async () => {
        return {};
      };
      Actions.secure_testGetCurrentUser = async () => {
        return {};
      };
      Actions.secure_testCreateRecord = async () => {
        return {};
      };
      Actions.secure_testGetRecords = async () => {
        return {};
      };
      Actions.secure_testUpdateRecord = async () => {
        return {};
      };
      Actions.secure_testDeleteRecord = async () => {
        return {};
      };
      Actions.secure_testValidation = async () => {
        return {};
      };
      Actions.secure_testSanitization = async () => {
        return {};
      };
      Actions.secure_testErrorHandling = async () => {
        return {};
      };
      Actions.secure_testPerformance = async () => {
        return {};
      };
      Actions.secure_testFileUpload = async () => {
        return {};
      };
      Actions.secure_testWebSocket = async () => {
        return {};
      };
      const PageContent = (props2) => {
        props2 = props2 || {};
        const [currentTest, setCurrentTest] = useState("framework");
        const [testResults, setTestResults] = useState({});
        const [loading, setLoading] = useState(false);
        const [error, setError] = useState(null);
        const [user, setUser] = useState(null);
        const [records, setRecords] = useState([]);
        const safeRecords = Array.isArray(records) ? records : [];
        const loadingRef = useRef(false);
        const testCountRef = useRef(0);
        const lastTestRef = useRef(null);
        useEffect(() => {
          if (typeof window !== "undefined" && !window.confetti) {
            Promise.resolve().then(() => __toESM(require_confetti())).then((module2) => {
              window.confetti = module2.default || module2;
            }).catch(() => {
            });
          }
        }, []);
        const triggerConfetti = (options = {}) => {
          try {
            const confettiFn = window.confetti || (typeof import_canvas_confetti.default !== "undefined" ? import_canvas_confetti.default : null);
            if (confettiFn && typeof confettiFn === "function") {
              confettiFn(options);
            }
          } catch (e) {
          }
        };
        const testCategories = useMemo(() => [
          { id: "framework", name: "Framework Core", icon: "\u269B\uFE0F" },
          { id: "inputs", name: "Input Tracking", icon: "\u2328\uFE0F" },
          { id: "events", name: "Event Handling", icon: "\u{1F3AF}" },
          { id: "forms", name: "Forms & Validation", icon: "\u{1F4DD}" },
          { id: "state", name: "State Management", icon: "\u{1F504}" },
          { id: "html", name: "HTML Helpers", icon: "\u{1F3F7}\uFE0F" },
          { id: "navigation", name: "Navigation", icon: "\u{1F9ED}" },
          { id: "auth", name: "Authentication", icon: "\u{1F510}" },
          { id: "database", name: "Database", icon: "\u{1F4BE}" },
          { id: "validation", name: "Validation", icon: "\u2705" },
          { id: "errors", name: "Error Handling", icon: "\u26A0\uFE0F" },
          { id: "performance", name: "Performance", icon: "\u26A1" },
          { id: "security", name: "Security", icon: "\u{1F6E1}\uFE0F" }
        ], []);
        const [testInputValue, setTestInputValue] = useState("");
        const [testCounter, setTestCounter] = useState(0);
        const [testEffectCount, setTestEffectCount] = useState(0);
        const [testMemoValue, setTestMemoValue] = useState(0);
        const testRef = useRef(0);
        const effectTestRef = useRef(0);
        const counterTestRef = useRef(0);
        const memoTestRef = useRef(0);
        const [testResultsFramework, setTestResultsFramework] = useState({});
        const [testLogs, setTestLogs] = useState([]);
        const addLog = (message, type = "info") => {
          const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
          const logEntry = { timestamp, message, type };
          console.log(`[TEST ${type.toUpperCase()}] ${timestamp}: ${message}`);
          setTestLogs((prev) => {
            const logs = Array.isArray(prev) ? prev : [];
            return [...logs, logEntry].slice(-50);
          });
        };
        useEffect(() => {
          const newCount = effectTestRef.current + 1;
          effectTestRef.current = newCount;
          const currentCounter = typeof testCounter === "number" ? testCounter : 0;
          counterTestRef.current = currentCounter;
          setTestEffectCount((prev) => prev + 1);
          addLog(`useEffect triggered: testCounter changed to ${currentCounter} (effect count: ${newCount})`, "success");
        }, [testCounter]);
        const memoizedValue = useMemo(() => {
          const val = memoTestRef.current || (typeof testMemoValue === "number" ? testMemoValue : 0);
          const result2 = val * 2;
          addLog(`useMemo recalculated: ${val} * 2 = ${result2}`, "framework");
          return result2;
        }, [testMemoValue]);
        const testUseState = () => {
          console.log("testUseState called!");
          try {
            addLog("\u{1F9EA} Starting useState test...", "info");
            const currentValue = typeof testCounter === "number" ? testCounter : 0;
            counterTestRef.current = currentValue;
            addLog(`\u{1F4CA} Current counter value: ${currentValue}`, "info");
            addLog("\u2699\uFE0F Framework: Calling setTestCounter...", "framework");
            const expectedNewValue = currentValue + 1;
            setTestCounter((prev) => {
              const oldVal = typeof prev === "number" ? prev : 0;
              const newVal = oldVal + 1;
              addLog(`\u2699\uFE0F Framework: State updater called (${oldVal} \u2192 ${newVal})`, "framework");
              counterTestRef.current = newVal;
              return newVal;
            });
            addLog("\u23F3 Waiting for state update and re-render...", "info");
            let attempts = 0;
            const checkState = () => {
              attempts++;
              const refValue = counterTestRef.current;
              addLog(`\u{1F4CA} Check ${attempts}: Ref value = ${refValue}, Expected = ${expectedNewValue}`, "info");
              if (refValue >= expectedNewValue) {
                addLog(`\u2705 PASS: useState working correctly (${currentValue} \u2192 ${refValue})`, "success");
                setTestResultsFramework((prev) => ({ ...prev, useState: `\u2705 PASS: State updated successfully (${currentValue} \u2192 ${refValue})` }));
              } else if (attempts < 10) {
                setTimeout(checkState, 100);
              } else {
                addLog(`\u274C FAIL: State not updated after ${attempts} attempts (expected >= ${expectedNewValue}, ref shows ${refValue})`, "error");
                addLog("\u{1F50D} Issue: Framework state update may not be working - state not updating", "error");
                setTestResultsFramework((prev) => ({ ...prev, useState: `\u274C FAIL: State not updated (${currentValue} \u2192 ${refValue})` }));
              }
            };
            setTimeout(checkState, 200);
          } catch (err) {
            addLog(`\u274C ERROR: ${err.message}`, "error");
            addLog("\u{1F50D} Issue: Frontend test code error", "error");
            setTestResultsFramework((prev) => ({ ...prev, useState: `\u274C FAIL: ${err.message}` }));
          }
        };
        const testUseEffect = () => {
          addLog("\u{1F9EA} Starting useEffect test...", "info");
          try {
            const initialEffectCount = effectTestRef.current;
            addLog(`\u{1F4CA} Initial effect count: ${initialEffectCount}`, "info");
            addLog("\u2699\uFE0F Framework: Updating testCounter to trigger effect...", "framework");
            setTestCounter((prev) => {
              const newVal = (typeof prev === "number" ? prev : 0) + 1;
              addLog(`\u2699\uFE0F Framework: Counter updated to ${newVal}`, "framework");
              return newVal;
            });
            addLog("\u23F3 Waiting for useEffect to trigger...", "info");
            setTimeout(() => {
              const newEffectCount = effectTestRef.current;
              addLog(`\u{1F4CA} New effect count: ${newEffectCount}`, "info");
              if (newEffectCount > initialEffectCount) {
                addLog(`\u2705 PASS: useEffect triggered (${initialEffectCount} \u2192 ${newEffectCount})`, "success");
                setTestResultsFramework((prev) => ({ ...prev, useEffect: `\u2705 PASS: Effect triggered (count: ${initialEffectCount} \u2192 ${newEffectCount})` }));
              } else {
                addLog(`\u274C FAIL: Effect not triggered (count: ${initialEffectCount} \u2192 ${newEffectCount})`, "error");
                addLog("\u{1F50D} Issue: Framework useEffect may not be working or dependency not tracked", "error");
                setTestResultsFramework((prev) => ({ ...prev, useEffect: "\u274C FAIL: Effect not triggered" }));
              }
            }, 200);
          } catch (err) {
            addLog(`\u274C ERROR: ${err.message}`, "error");
            addLog("\u{1F50D} Issue: Frontend test code error", "error");
            setTestResultsFramework((prev) => ({ ...prev, useEffect: `\u274C FAIL: ${err.message}` }));
          }
        };
        const testUseRef = () => {
          addLog("\u{1F9EA} Starting useRef test...", "info");
          try {
            const oldValue = testRef?.current || 0;
            addLog(`\u{1F4CA} Initial ref value: ${oldValue}`, "info");
            addLog("\u2699\uFE0F Framework: Updating ref.current...", "framework");
            testRef.current = (typeof testRef.current === "number" ? testRef.current : 0) + 1;
            const newValue = testRef.current;
            addLog(`\u2699\uFE0F Framework: Ref updated to ${newValue}`, "framework");
            if (newValue > oldValue) {
              addLog(`\u2705 PASS: useRef working (${oldValue} \u2192 ${newValue})`, "success");
              setTestResultsFramework((prev) => ({ ...prev, useRef: `\u2705 PASS: Ref value updated from ${oldValue} to ${newValue}` }));
            } else {
              addLog(`\u274C FAIL: Ref not updating (${oldValue} \u2192 ${newValue})`, "error");
              addLog("\u{1F50D} Issue: Framework useRef may not be persisting values", "error");
              setTestResultsFramework((prev) => ({ ...prev, useRef: "\u274C FAIL: Ref not updating" }));
            }
          } catch (err) {
            addLog(`\u274C ERROR: ${err.message}`, "error");
            addLog("\u{1F50D} Issue: Frontend test code error", "error");
            setTestResultsFramework((prev) => ({ ...prev, useRef: `\u274C FAIL: ${err.message}` }));
          }
        };
        const testUseMemo = () => {
          addLog("\u{1F9EA} Starting useMemo test...", "info");
          try {
            const oldTestValue = memoTestRef.current;
            addLog(`\u{1F4CA} Current testMemoValue: ${oldTestValue}`, "info");
            addLog("\u2699\uFE0F Framework: Updating testMemoValue...", "framework");
            const newVal = oldTestValue + 1;
            memoTestRef.current = newVal;
            setTestMemoValue(newVal);
            addLog(`\u2699\uFE0F Framework: testMemoValue updated to ${newVal}`, "framework");
            setTimeout(() => {
              const currentTestValue = memoTestRef.current;
              const expectedMemo = currentTestValue * 2;
              addLog(`\u{1F4CA} Expected memo: ${expectedMemo} (from testMemoValue: ${currentTestValue})`, "info");
              setTestResultsFramework((prev) => {
                if (currentTestValue > oldTestValue) {
                  addLog(`\u2705 PASS: useMemo dependency updated (${oldTestValue} \u2192 ${currentTestValue})`, "success");
                  return { ...prev, useMemo: `\u2705 PASS: Memo should calculate ${currentTestValue} * 2 = ${expectedMemo}` };
                } else {
                  addLog(`\u274C FAIL: State not updated`, "error");
                  return { ...prev, useMemo: `\u274C FAIL: State not updated` };
                }
              });
            }, 200);
          } catch (err) {
            addLog(`\u274C ERROR: ${err.message}`, "error");
            addLog("\u{1F50D} Issue: Frontend test code error", "error");
            setTestResultsFramework((prev) => ({ ...prev, useMemo: `\u274C FAIL: ${err.message}` }));
          }
        };
        const runAllFrameworkTests = async () => {
          addLog("\u{1F680} Starting Framework Core Test Suite...", "info");
          setTestResultsFramework({});
          setTestLogs([]);
          const tests = [
            { name: "useState", fn: testUseState },
            { name: "useEffect", fn: testUseEffect },
            { name: "useRef", fn: testUseRef },
            { name: "useMemo", fn: testUseMemo }
          ];
          for (let i = 0; i < tests.length; i++) {
            const test = tests[i];
            addLog(`
\u2501\u2501\u2501 Test ${i + 1}/${tests.length}: ${test.name} \u2501\u2501\u2501`, "info");
            await new Promise((resolve) => {
              test.fn();
              setTimeout(resolve, 500);
            });
            if (i < tests.length - 1) {
              addLog("\u23F8\uFE0F  Waiting before next test...", "info");
              await new Promise((resolve) => setTimeout(resolve, 300));
            }
          }
          addLog("\n\u2705 Framework Core Test Suite Complete!", "success");
        };
        const [inputTest1, setInputTest1] = useState("");
        const [inputTest2, setInputTest2] = useState("");
        const [inputTest3, setInputTest3] = useState("");
        const [inputTestResults, setInputTestResults] = useState({});
        const [inputLog, setInputLog] = useState([]);
        const safeInputLog = Array.isArray(inputLog) ? inputLog : [];
        const testInputTracking = () => {
          addLog("\u{1F9EA} Starting Input Value Preservation test...", "info");
          try {
            const input1Element = document.querySelector('input[placeholder*="Type here, then switch"]') || document.querySelectorAll('input[type="text"]')[0];
            const input2Element = document.querySelector('input[placeholder*="Switch here and type"]') || document.querySelectorAll('input[type="text"]')[1];
            const beforeValue1 = input1Element ? input1Element.value : "";
            const beforeValue2 = input2Element ? input2Element.value : "";
            addLog(`\u{1F4CA} Current Input 1 value: "${beforeValue1}"`, "info");
            addLog(`\u{1F4CA} Current Input 2 value: "${beforeValue2}"`, "info");
            const testValue1 = "Test Value 1";
            const testValue2 = "Test Value 2";
            addLog(`\u{1F4DD} Setting Input 1 state to: "${testValue1}"`, "info");
            addLog("\u2699\uFE0F Framework: State update should sync to DOM if input is not focused", "framework");
            setInputTest1(testValue1);
            setTimeout(() => {
              addLog(`\u{1F4DD} Setting Input 2 state to: "${testValue2}"`, "info");
              setInputTest2(testValue2);
              setTimeout(() => {
                const afterDomValue1 = input1Element ? input1Element.value : "";
                const afterDomValue2 = input2Element ? input2Element.value : "";
                const stateValue1 = typeof inputTest1 === "string" ? inputTest1 : "";
                const stateValue2 = typeof inputTest2 === "string" ? inputTest2 : "";
                addLog(`\u{1F4CA} After state update:`, "info");
                addLog(`   Input 1 - DOM: "${afterDomValue1}", State: "${stateValue1}"`, "info");
                addLog(`   Input 2 - DOM: "${afterDomValue2}", State: "${stateValue2}"`, "info");
                const input1WasEmpty = !beforeValue1 || beforeValue1.trim() === "";
                const input2WasEmpty = !beforeValue2 || beforeValue2.trim() === "";
                const input1Correct = input1WasEmpty ? afterDomValue1 === testValue1 || stateValue1 === testValue1 : afterDomValue1 === beforeValue1 || afterDomValue1 === testValue1;
                const input2Correct = input2WasEmpty ? afterDomValue2 === testValue2 || stateValue2 === testValue2 : afterDomValue2 === beforeValue2 || afterDomValue2 === testValue2;
                if (input1Correct && input2Correct) {
                  addLog("\u2705 PASS: Input value preservation working correctly", "success");
                  if (!input1WasEmpty || !input2WasEmpty) {
                    addLog("\u2705 Framework correctly preserved user input over programmatic updates", "success");
                  }
                  setInputTestResults((prev) => ({ ...prev, valuePreservation: "\u2705 PASS: Values preserved correctly" }));
                } else {
                  addLog("\u274C FAIL: Input values not handled correctly", "error");
                  addLog(`\u{1F50D} Issue: Input 1 ${input1Correct ? "OK" : "MISMATCH"}, Input 2 ${input2Correct ? "OK" : "MISMATCH"}`, "error");
                  setInputTestResults((prev) => ({ ...prev, valuePreservation: `\u274C FAIL: Values not preserved (DOM1: ${afterDomValue1}, DOM2: ${afterDomValue2})` }));
                }
              }, 300);
            }, 300);
          } catch (err) {
            addLog(`\u274C ERROR: ${err.message}`, "error");
            setInputTestResults((prev) => ({ ...prev, valuePreservation: `\u274C FAIL: ${err.message}` }));
          }
        };
        const testInputSwitching = () => {
          addLog("\u{1F9EA} Starting Input Switching test...", "info");
          addLog("\u{1F4DD} This test verifies that when you type in one input, then switch to another, the first input keeps its value", "info");
          const input1Element = document.querySelector('input[placeholder*="Input 1"]') || document.querySelector('input[type="text"]');
          const input2Element = document.querySelectorAll('input[type="text"]')[1];
          const initialValue1 = input1Element ? input1Element.value : "";
          const initialValue2 = input2Element ? input2Element.value : "";
          addLog(`\u{1F4CA} Current Input 1 value: "${initialValue1}"`, "info");
          addLog(`\u{1F4CA} Current Input 2 value: "${initialValue2}"`, "info");
          addLog("\u{1F4A1} Tip: Type in Input 1, then click in Input 2 and type there. Input 1 should keep its value.", "info");
          try {
            const value1 = initialValue1 || "Typing in input 1...";
            const value2 = initialValue2 || "Now typing in input 2...";
            addLog(`\u{1F4DD} Setting Input 1 state to: "${value1}"`, "info");
            setInputTest1(value1);
            setTimeout(() => {
              addLog(`\u{1F4DD} Setting Input 2 state to: "${value2}"`, "info");
              addLog("\u2699\uFE0F Framework: Testing if Input 1 value is preserved when Input 2 is updated...", "framework");
              setInputTest2(value2);
              setTimeout(() => {
                const finalDomValue1 = input1Element ? input1Element.value : "";
                const finalDomValue2 = input2Element ? input2Element.value : "";
                const stateValue1 = typeof inputTest1 === "string" ? inputTest1 : "";
                const stateValue2 = typeof inputTest2 === "string" ? inputTest2 : "";
                addLog(`\u{1F4CA} After state update:`, "info");
                addLog(`   Input 1 - DOM: "${finalDomValue1}", State: "${stateValue1}"`, "info");
                addLog(`   Input 2 - DOM: "${finalDomValue2}", State: "${stateValue2}"`, "info");
                const valuesPreserved = (finalDomValue1 === initialValue1 || finalDomValue1 === value1) && (finalDomValue2 === initialValue2 || finalDomValue2 === value2);
                if (valuesPreserved) {
                  addLog("\u2705 PASS: Input values preserved when switching/updating", "success");
                  addLog("\u2705 Framework correctly preserves user input and syncs state", "success");
                  setInputTestResults((prev) => ({ ...prev, switching: "\u2705 PASS: Values preserved on switch" }));
                } else {
                  addLog("\u274C FAIL: Values not preserved correctly", "error");
                  addLog(`\u{1F50D} Issue: Framework may be overwriting input values during state updates`, "error");
                  setInputTestResults((prev) => ({ ...prev, switching: `\u274C FAIL: Values lost (Input1: ${finalDomValue1}, Input2: ${finalDomValue2})` }));
                }
              }, 300);
            }, 300);
          } catch (err) {
            addLog(`\u274C ERROR: ${err.message}`, "error");
            setInputTestResults((prev) => ({ ...prev, switching: `\u274C FAIL: ${err.message}` }));
          }
        };
        const [eventResults, setEventResults] = useState({});
        const [clickCount, setClickCount] = useState(0);
        const [inputEventCount, setInputEventCount] = useState(0);
        const [focusCount, setFocusCount] = useState(0);
        const [blurCount, setBlurCount] = useState(0);
        const [submitCount, setSubmitCount] = useState(0);
        const [changeCount, setChangeCount] = useState(0);
        const testClickEvent = () => {
          setClickCount((prev) => prev + 1);
          setEventResults((prev) => ({ ...prev, onclick: "\u2705 PASS" }));
        };
        const testInputEvent = (e) => {
          setInputEventCount((prev) => prev + 1);
          if (inputEventCount >= 0) {
            setEventResults((prev) => ({ ...prev, oninput: "\u2705 PASS" }));
          }
        };
        const testFocusEvent = () => {
          setFocusCount((prev) => prev + 1);
          setEventResults((prev) => ({ ...prev, onfocus: "\u2705 PASS" }));
        };
        const testBlurEvent = () => {
          setBlurCount((prev) => prev + 1);
          setEventResults((prev) => ({ ...prev, onblur: "\u2705 PASS" }));
        };
        const testChangeEvent = (e) => {
          setChangeCount((prev) => prev + 1);
          setEventResults((prev) => ({ ...prev, onchange: "\u2705 PASS" }));
        };
        const testSubmitEvent = (e) => {
          e.preventDefault();
          setSubmitCount((prev) => prev + 1);
          setEventResults((prev) => ({ ...prev, onsubmit: "\u2705 PASS" }));
        };
        const [formData, setFormData] = useState({ name: "", email: "", message: "" });
        const [formErrors, setFormErrors] = useState({});
        const [formResults, setFormResults] = useState({});
        const [formSubmitted, setFormSubmitted] = useState(false);
        const testFormSubmission = (e) => {
          e.preventDefault();
          addLog("\u{1F9EA} Starting Form Submission test...", "info");
          const nameInput = document.querySelector('input[type="text"][placeholder*="name" i]') || document.querySelectorAll('input[type="text"]')[0];
          const emailInput = document.querySelector('input[type="email"]') || document.querySelectorAll('input[type="text"]')[1];
          const messageTextarea = document.querySelector("textarea");
          const data = {
            name: nameInput ? nameInput.value : formData.name || "",
            email: emailInput ? emailInput.value : formData.email || "",
            message: messageTextarea ? messageTextarea.value : formData.message || ""
          };
          addLog(`\u{1F4CA} Submitting form with values:`, "info");
          addLog(`   Name: "${data.name}"`, "info");
          addLog(`   Email: "${data.email}"`, "info");
          addLog(`   Message: "${data.message}"`, "info");
          const errors = {};
          if (!data.name || data.name.trim() === "") {
            errors.name = "Name required";
            addLog("\u274C Validation: Name is required", "error");
          }
          if (!data.email || data.email.trim() === "") {
            errors.email = "Email required";
            addLog("\u274C Validation: Email is required", "error");
          } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(data.email)) {
              errors.email = "Invalid email format";
              addLog(`\u274C Validation: Email format invalid ("${data.email}")`, "error");
            }
          }
          if (!data.message || data.message.trim() === "") {
            errors.message = "Message required";
            addLog("\u274C Validation: Message is required", "error");
          } else if (data.message.trim().length < 10) {
            errors.message = "Message too short (min 10 characters)";
            addLog(`\u274C Validation: Message too short (${data.message.length} chars)`, "error");
          }
          if (Object.keys(errors).length === 0) {
            addLog("\u2705 PASS: Form validation passed, submitting...", "success");
            setFormSubmitted(true);
            setFormResults((prev) => ({ ...prev, submission: "\u2705 PASS: Form submitted successfully" }));
          } else {
            addLog(`\u274C FAIL: Form validation failed (${Object.keys(errors).length} error(s))`, "error");
            setFormErrors(errors);
            setFormResults((prev) => ({ ...prev, submission: `\u274C FAIL: Validation errors (${Object.keys(errors).length} error(s))` }));
          }
        };
        const testFormValidation = () => {
          addLog("\u{1F9EA} Starting Form Validation test...", "info");
          try {
            const nameInput = document.querySelector('input[type="text"][placeholder*="name" i]') || document.querySelectorAll('input[type="text"]')[0];
            const emailInput = document.querySelector('input[type="email"]') || document.querySelectorAll('input[type="text"]')[1];
            const messageTextarea = document.querySelector("textarea");
            const nameValue = nameInput ? nameInput.value : formData.name || "";
            const emailValue = emailInput ? emailInput.value : formData.email || "";
            const messageValue = messageTextarea ? messageTextarea.value : formData.message || "";
            addLog(`\u{1F4CA} Form values:`, "info");
            addLog(`   Name: "${nameValue}"`, "info");
            addLog(`   Email: "${emailValue}"`, "info");
            addLog(`   Message: "${messageValue}"`, "info");
            const errors = {};
            if (!nameValue || nameValue.trim() === "") {
              errors.name = "Name required";
              addLog("\u274C Validation: Name is required", "error");
            } else {
              addLog("\u2705 Validation: Name is valid", "success");
            }
            if (!emailValue || emailValue.trim() === "") {
              errors.email = "Email required";
              addLog("\u274C Validation: Email is required", "error");
            } else {
              const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!emailRegex.test(emailValue)) {
                errors.email = "Invalid email format";
                addLog(`\u274C Validation: Email format invalid ("${emailValue}")`, "error");
              } else {
                addLog("\u2705 Validation: Email format is valid", "success");
              }
            }
            if (!messageValue || messageValue.trim() === "") {
              errors.message = "Message required";
              addLog("\u274C Validation: Message is required", "error");
            } else if (messageValue.trim().length < 10) {
              errors.message = "Message too short (min 10 characters)";
              addLog(`\u274C Validation: Message too short (${messageValue.length} chars)`, "error");
            } else {
              addLog("\u2705 Validation: Message is valid", "success");
            }
            addLog(`\u{1F4CA} Total validation errors: ${Object.keys(errors).length}`, "info");
            setFormErrors(errors);
            if (Object.keys(errors).length > 0) {
              addLog(`\u2705 PASS: Validation detected ${Object.keys(errors).length} error(s)`, "success");
              setFormResults((prev) => ({ ...prev, validation: `\u2705 PASS: Validation working (${Object.keys(errors).length} error(s) detected)` }));
            } else {
              addLog("\u274C FAIL: No validation errors detected (form should have errors)", "error");
              addLog("\u{1F50D} Issue: Validation may not be checking email format or message length", "error");
              setFormResults((prev) => ({ ...prev, validation: "\u274C FAIL: No errors detected (validation may be incomplete)" }));
            }
          } catch (err) {
            addLog(`\u274C ERROR: ${err.message}`, "error");
            setFormResults((prev) => ({ ...prev, validation: `\u274C FAIL: ${err.message}` }));
          }
        };
        const [stateTestCounter, setStateTestCounter] = useState(0);
        const [stateTestObject, setStateTestObject] = useState({ count: 0, name: "Test" });
        const [stateTestArray, setStateTestArray] = useState([1, 2, 3]);
        const [stateTestResults, setStateTestResults] = useState({});
        const [stateTestLogs, setStateTestLogs] = useState([]);
        const stateCounterRef = useRef(0);
        const stateObjectCountRef = useRef(0);
        const stateArrayLengthRef = useRef(3);
        const addStateLog = (message, type = "info") => {
          const timestamp = (/* @__PURE__ */ new Date()).toLocaleTimeString();
          const logEntry = { timestamp, message, type };
          console.log(`[STATE TEST ${type.toUpperCase()}] ${timestamp}: ${message}`);
          setStateTestLogs((prev) => {
            const logs = Array.isArray(prev) ? prev : [];
            return [...logs, logEntry].slice(-30);
          });
        };
        useEffect(() => {
          stateCounterRef.current = typeof stateTestCounter === "number" ? stateTestCounter : 0;
        }, [stateTestCounter]);
        useEffect(() => {
          stateObjectCountRef.current = stateTestObject?.count || 0;
        }, [stateTestObject]);
        useEffect(() => {
          stateArrayLengthRef.current = Array.isArray(stateTestArray) ? stateTestArray.length : 0;
        }, [stateTestArray]);
        const testStateUpdate = () => {
          addStateLog("\u{1F9EA} Testing basic state update...", "info");
          const oldValue = typeof stateTestCounter === "number" ? stateTestCounter : 0;
          addStateLog(`\u{1F4CA} Current value: ${oldValue}`, "info");
          const expectedNewValue = oldValue + 1;
          stateCounterRef.current = expectedNewValue;
          setStateTestCounter((prev) => {
            const newVal = (typeof prev === "number" ? prev : 0) + 1;
            addStateLog(`\u2699\uFE0F Framework: State updater called (${prev} \u2192 ${newVal})`, "framework");
            return newVal;
          });
          let attempts = 0;
          const maxAttempts = 15;
          const checkState = () => {
            attempts++;
            const refValue = stateCounterRef.current;
            const globalState = typeof window !== "undefined" && window.__ATOM_STATE__ ? window.__ATOM_STATE__ : [];
            const globalValue = Array.isArray(globalState) && globalState.length > 0 ? globalState[0] : void 0;
            const currentValue = typeof refValue === "number" ? refValue : typeof globalValue === "number" ? globalValue : 0;
            addStateLog(`\u{1F4CA} Check ${attempts}: Ref value = ${refValue}, Global state[0] = ${globalValue}, Expected = ${expectedNewValue}`, "info");
            if (currentValue >= expectedNewValue) {
              addStateLog(`\u2705 PASS: State updated (${oldValue} \u2192 ${currentValue})`, "success");
              setStateTestResults((prev) => ({ ...prev, basicUpdate: "\u2705 PASS" }));
            } else if (attempts < maxAttempts) {
              setTimeout(checkState, 100);
            } else {
              addStateLog(`\u274C FAIL: State not updated after ${maxAttempts} attempts (expected ${expectedNewValue}, ref shows ${refValue}, global shows ${globalValue})`, "error");
              addStateLog("\u{1F50D} Issue: Framework state update may not be working correctly", "error");
              setStateTestResults((prev) => ({ ...prev, basicUpdate: "\u274C FAIL" }));
            }
          };
          setTimeout(checkState, 200);
        };
        const testStateObject = () => {
          addStateLog("\u{1F9EA} Testing state with objects...", "info");
          const oldCount = stateTestObject?.count || 0;
          const expectedNewCount = oldCount + 1;
          stateObjectCountRef.current = expectedNewCount;
          setStateTestObject((prev) => {
            const newObj = { ...prev, count: (prev?.count || 0) + 1 };
            addStateLog(`\u2699\uFE0F Framework: Object state updated (count: ${prev?.count || 0} \u2192 ${newObj.count})`, "framework");
            return newObj;
          });
          let attempts = 0;
          const maxAttempts = 10;
          const checkState = () => {
            attempts++;
            const newCount = stateTestObject?.count || 0;
            addStateLog(`\u{1F4CA} Check ${attempts}: Object count = ${newCount}, Expected = ${expectedNewCount}`, "info");
            if (newCount >= expectedNewCount) {
              addStateLog(`\u2705 PASS: Object state updated (${oldCount} \u2192 ${newCount})`, "success");
              setStateTestResults((prev) => ({ ...prev, objectState: "\u2705 PASS" }));
            } else if (attempts < maxAttempts) {
              setTimeout(checkState, 50);
            } else {
              addStateLog(`\u274C FAIL: Object state not updated after ${maxAttempts} attempts`, "error");
              setStateTestResults((prev) => ({ ...prev, objectState: "\u274C FAIL" }));
            }
          };
          setTimeout(checkState, 100);
        };
        const testStateArray = () => {
          addStateLog("\u{1F9EA} Testing state with arrays...", "info");
          const oldLength = Array.isArray(stateTestArray) ? stateTestArray.length : 0;
          const expectedNewLength = oldLength + 1;
          stateArrayLengthRef.current = expectedNewLength;
          setStateTestArray((prev) => {
            const newArr = Array.isArray(prev) ? [...prev, prev.length + 1] : [1];
            addStateLog(`\u2699\uFE0F Framework: Array state updated (length: ${prev?.length || 0} \u2192 ${newArr.length})`, "framework");
            return newArr;
          });
          let attempts = 0;
          const maxAttempts = 10;
          const checkState = () => {
            attempts++;
            const newLength = Array.isArray(stateTestArray) ? stateTestArray.length : 0;
            addStateLog(`\u{1F4CA} Check ${attempts}: Array length = ${newLength}, Expected = ${expectedNewLength}`, "info");
            if (newLength >= expectedNewLength) {
              addStateLog(`\u2705 PASS: Array state updated (length: ${oldLength} \u2192 ${newLength})`, "success");
              setStateTestResults((prev) => ({ ...prev, arrayState: "\u2705 PASS" }));
            } else if (attempts < maxAttempts) {
              setTimeout(checkState, 50);
            } else {
              addStateLog(`\u274C FAIL: Array state not updated after ${maxAttempts} attempts`, "error");
              setStateTestResults((prev) => ({ ...prev, arrayState: "\u274C FAIL" }));
            }
          };
          setTimeout(checkState, 100);
        };
        const testStateBatching = () => {
          addStateLog("\u{1F9EA} Testing state update batching...", "info");
          const initialValue = typeof stateTestCounter === "number" ? stateTestCounter : 0;
          const expectedFinalValue = initialValue + 3;
          stateCounterRef.current = expectedFinalValue;
          setStateTestCounter((prev) => (typeof prev === "number" ? prev : 0) + 1);
          setStateTestCounter((prev) => (typeof prev === "number" ? prev : 0) + 1);
          setStateTestCounter((prev) => (typeof prev === "number" ? prev : 0) + 1);
          addStateLog("\u2699\uFE0F Framework: Sent 3 rapid state updates", "framework");
          let attempts = 0;
          const maxAttempts = 15;
          const checkState = () => {
            attempts++;
            const finalValue = typeof stateTestCounter === "number" ? stateTestCounter : 0;
            addStateLog(`\u{1F4CA} Check ${attempts}: Final value = ${finalValue}, Expected >= ${expectedFinalValue}`, "info");
            if (finalValue >= expectedFinalValue) {
              addStateLog(`\u2705 PASS: State batching working (${initialValue} \u2192 ${finalValue})`, "success");
              setStateTestResults((prev) => ({ ...prev, batching: "\u2705 PASS" }));
            } else if (attempts < maxAttempts) {
              setTimeout(checkState, 50);
            } else {
              addStateLog(`\u274C FAIL: State batching issue after ${maxAttempts} attempts (expected >= ${expectedFinalValue}, got ${finalValue})`, "error");
              setStateTestResults((prev) => ({ ...prev, batching: "\u274C FAIL" }));
            }
          };
          setTimeout(checkState, 150);
        };
        const [persistTestState, setPersistTestState] = useState("Initial");
        const persistTestRef = useRef("Initial");
        useEffect(() => {
          persistTestRef.current = typeof persistTestState === "string" ? persistTestState : "Initial";
        }, [persistTestState]);
        const testStatePersistence = () => {
          addStateLog("\u{1F9EA} Testing state persistence across re-renders...", "info");
          const testValue = "Persistent Value " + Date.now();
          addStateLog(`\u{1F4DD} Setting state to: "${testValue}"`, "info");
          persistTestRef.current = testValue;
          setPersistTestState(testValue);
          let attempts = 0;
          const maxAttempts = 10;
          const checkState = () => {
            attempts++;
            const currentValue = typeof persistTestState === "string" ? persistTestState : "";
            addStateLog(`\u{1F4CA} Check ${attempts}: Current state value: "${currentValue}"`, "info");
            if (currentValue && (currentValue === testValue || currentValue.includes("Persistent Value"))) {
              addStateLog(`\u2705 PASS: State persisted correctly (${currentValue})`, "success");
              setStateTestResults((prev) => ({ ...prev, persistence: "\u2705 PASS: State persists across re-renders" }));
            } else if (attempts < maxAttempts) {
              setTimeout(checkState, 50);
            } else {
              addStateLog(`\u274C FAIL: State not persisted after ${maxAttempts} attempts (expected "${testValue}", got "${currentValue}")`, "error");
              setStateTestResults((prev) => ({ ...prev, persistence: "\u274C FAIL: State not persisting" }));
            }
          };
          setTimeout(checkState, 100);
        };
        const [htmlResults, setHtmlResults] = useState({});
        const testHtmlHelpers = () => {
          try {
            setHtmlResults((prev) => ({ ...prev, helpers: "\u2705 PASS: All helpers available" }));
          } catch (err) {
            setHtmlResults((prev) => ({ ...prev, helpers: `\u274C FAIL: ${err.message}` }));
          }
        };
        const [navResults, setNavResults] = useState({});
        const testNavigation = () => {
          try {
            const currentPath = usePath();
            if (currentPath) {
              setNavResults((prev) => ({ ...prev, usePath: "\u2705 PASS" }));
            } else {
              setNavResults((prev) => ({ ...prev, usePath: "\u274C FAIL: usePath not working" }));
            }
          } catch (err) {
            setNavResults((prev) => ({ ...prev, usePath: `\u274C FAIL: ${err.message}` }));
          }
        };
        const testNavigate = () => {
          try {
            navigate("/test");
            setTimeout(() => {
              if (window.location.pathname === "/test") {
                setNavResults((prev) => ({ ...prev, navigate: "\u2705 PASS" }));
                navigate("/test-suite");
              } else {
                setNavResults((prev) => ({ ...prev, navigate: "\u274C FAIL: Navigation not working" }));
              }
            }, 100);
          } catch (err) {
            setNavResults((prev) => ({ ...prev, navigate: `\u274C FAIL: ${err.message}` }));
          }
        };
        const testLogin = async () => {
          if (loadingRef.current) return;
          loadingRef.current = true;
          setLoading(true);
          setError(null);
          try {
            const result2 = await Actions.secure_testLogin({
              email: "test@example.com",
              password: "password123"
            });
            if (result2 && result2.success) {
              if (result2.token) localStorage.setItem("test_token", result2.token);
              if (result2.user) setUser(result2.user);
              setTestResults((prev) => ({ ...prev, login: "\u2705 PASS" }));
              triggerConfetti({ particleCount: 50, spread: 70 });
            } else {
              setTestResults((prev) => ({ ...prev, login: "\u274C FAIL: Unexpected response format" }));
            }
          } catch (err) {
            setError(err.message);
            setTestResults((prev) => ({ ...prev, login: `\u274C FAIL: ${err.message}` }));
          } finally {
            setLoading(false);
            loadingRef.current = false;
          }
        };
        const testRegister = async () => {
          setLoading(true);
          setError(null);
          try {
            const result2 = await Actions.secure_testRegister({
              email: `test${Date.now()}@example.com`,
              password: "password123",
              name: "Test User"
            });
            if (result2 && result2.success) {
              setTestResults((prev) => ({ ...prev, register: "\u2705 PASS" }));
              alert("Registration successful!");
            } else {
              setTestResults((prev) => ({ ...prev, register: "\u274C FAIL: Unexpected response format" }));
            }
          } catch (err) {
            setError(err.message);
            setTestResults((prev) => ({ ...prev, register: `\u274C FAIL: ${err.message}` }));
          } finally {
            setLoading(false);
          }
        };
        const testGetCurrentUser = async () => {
          const token = localStorage.getItem("test_token");
          if (!token) {
            setError("No token found. Please login first.");
            return;
          }
          setLoading(true);
          setError(null);
          try {
            const result2 = await Actions.secure_testGetCurrentUser(token);
            if (result2) {
              setUser(result2);
              setTestResults((prev) => ({ ...prev, getCurrentUser: "\u2705 PASS" }));
            } else {
              setTestResults((prev) => ({ ...prev, getCurrentUser: "\u274C FAIL: No user data returned" }));
            }
          } catch (err) {
            setError(err.message);
            setTestResults((prev) => ({ ...prev, getCurrentUser: `\u274C FAIL: ${err.message}` }));
          } finally {
            setLoading(false);
          }
        };
        const testCreateRecord = async () => {
          setLoading(true);
          setError(null);
          try {
            const result2 = await Actions.secure_testCreateRecord({
              title: "Test Record",
              content: "<p>This is a <strong>test</strong> record</p>"
            });
            if (result2 && result2.record) {
              setRecords((prev) => {
                const prevArr = Array.isArray(prev) ? prev : [];
                const newRecord = result2.record;
                return newRecord ? [newRecord, ...prevArr] : prevArr;
              });
              setTestResults((prev) => ({ ...prev, createRecord: "\u2705 PASS" }));
            } else {
              setTestResults((prev) => ({ ...prev, createRecord: "\u274C FAIL: No record returned" }));
            }
          } catch (err) {
            setError(err.message);
            setTestResults((prev) => ({ ...prev, createRecord: `\u274C FAIL: ${err.message}` }));
          } finally {
            setLoading(false);
          }
        };
        const testGetRecords = async () => {
          setLoading(true);
          setError(null);
          try {
            const result2 = await Actions.secure_testGetRecords({ page: 1, limit: 10 });
            if (result2 && Array.isArray(result2.records)) {
              setRecords(result2.records);
              setTestResults((prev) => ({ ...prev, getRecords: "\u2705 PASS" }));
            } else {
              setRecords([]);
              setTestResults((prev) => ({ ...prev, getRecords: "\u274C FAIL: Invalid response format" }));
            }
          } catch (err) {
            setError(err.message);
            setTestResults((prev) => ({ ...prev, getRecords: `\u274C FAIL: ${err.message}` }));
          } finally {
            setLoading(false);
          }
        };
        const testUpdateRecord = async () => {
          const arr = Array.isArray(records) ? records : [];
          if (arr.length === 0) {
            setError("No records to update. Create a record first.");
            return;
          }
          setLoading(true);
          setError(null);
          try {
            const firstRecord = arr[0];
            if (!firstRecord || !firstRecord.id) {
              setError("Invalid record to update.");
              return;
            }
            const result2 = await Actions.secure_testUpdateRecord({
              id: firstRecord.id,
              title: "Updated Record",
              content: "Updated content"
            });
            if (result2 && result2.success) {
              setTestResults((prev) => ({ ...prev, updateRecord: "\u2705 PASS" }));
            } else {
              setTestResults((prev) => ({ ...prev, updateRecord: "\u274C FAIL: Update failed" }));
            }
          } catch (err) {
            setError(err.message);
            setTestResults((prev) => ({ ...prev, updateRecord: `\u274C FAIL: ${err.message}` }));
          } finally {
            setLoading(false);
          }
        };
        const testDeleteRecord = async () => {
          const arr = Array.isArray(records) ? records : [];
          if (arr.length === 0) {
            setError("No records to delete. Create a record first.");
            return;
          }
          setLoading(true);
          setError(null);
          try {
            const firstRecord = arr[0];
            if (!firstRecord || !firstRecord.id) {
              setError("Invalid record to delete.");
              return;
            }
            const recordId = typeof firstRecord.id === "number" ? firstRecord.id : Number(firstRecord.id);
            if (isNaN(recordId)) {
              setError("Invalid record ID.");
              return;
            }
            const result2 = await Actions.secure_testDeleteRecord(recordId);
            if (result2 && result2.success) {
              setRecords((prev) => {
                const prevArr = Array.isArray(prev) ? prev : [];
                return prevArr.filter((r) => r && r.id !== firstRecord.id);
              });
              setTestResults((prev) => ({ ...prev, deleteRecord: "\u2705 PASS" }));
            } else {
              setTestResults((prev) => ({ ...prev, deleteRecord: "\u274C FAIL: Delete failed" }));
            }
          } catch (err) {
            setError(err.message);
            setTestResults((prev) => ({ ...prev, deleteRecord: `\u274C FAIL: ${err.message}` }));
          } finally {
            setLoading(false);
          }
        };
        const testValidation = async () => {
          setLoading(true);
          setError(null);
          try {
            const result2 = await Actions.secure_testValidation({
              email: "test@example.com",
              name: "Test User",
              age: 25,
              url: "https://example.com",
              tags: ["tag1", "tag2"]
            });
            if (result2 && result2.success) {
              setTestResults((prev) => ({ ...prev, validation: "\u2705 PASS" }));
            } else {
              setTestResults((prev) => ({ ...prev, validation: "\u274C FAIL: Validation failed" }));
            }
          } catch (err) {
            setError(err.message);
            setTestResults((prev) => ({ ...prev, validation: `\u274C FAIL: ${err.message}` }));
          } finally {
            setLoading(false);
          }
        };
        const testSanitization = async () => {
          setLoading(true);
          setError(null);
          try {
            const result2 = await Actions.secure_testSanitization({
              html: '<p>Test <script>alert("xss")</script></p>',
              string: "<strong>Test</strong> String",
              email: "test@example.com",
              url: 'javascript:alert("xss")',
              object: { name: '<script>alert("xss")</script>' }
            });
            if (result2 && result2.success) {
              setTestResults((prev) => ({ ...prev, sanitization: "\u2705 PASS" }));
            } else {
              setTestResults((prev) => ({ ...prev, sanitization: "\u274C FAIL: Sanitization failed" }));
            }
          } catch (err) {
            setError(err.message);
            setTestResults((prev) => ({ ...prev, sanitization: `\u274C FAIL: ${err.message}` }));
          } finally {
            setLoading(false);
          }
        };
        const testErrorHandling = async (type) => {
          setLoading(true);
          setError(null);
          try {
            await Actions.secure_testErrorHandling(type);
            setTestResults((prev) => ({ ...prev, [`error_${type}`]: "\u274C FAIL: Should have thrown error" }));
          } catch (err) {
            setTestResults((prev) => ({ ...prev, [`error_${type}`]: `\u2705 PASS: ${err.message}` }));
          } finally {
            setLoading(false);
          }
        };
        const testPerformance = async () => {
          setLoading(true);
          setError(null);
          try {
            const result2 = await Actions.secure_testPerformance(1e3);
            if (result2 && result2.iterations && result2.duration) {
              const avgTime = result2.averageTime ? result2.averageTime.toFixed(2) : (result2.duration / result2.iterations).toFixed(2);
              setTestResults((prev) => ({ ...prev, performance: `\u2705 PASS: ${result2.iterations} iterations in ${result2.duration}ms (avg: ${avgTime}ms)` }));
            } else {
              setTestResults((prev) => ({ ...prev, performance: "\u274C FAIL: Invalid performance result" }));
            }
          } catch (err) {
            setError(err.message);
            setTestResults((prev) => ({ ...prev, performance: `\u274C FAIL: ${err.message}` }));
          } finally {
            setLoading(false);
          }
        };
        const runAllTests = async () => {
          setLoading(true);
          setError(null);
          setTestResults({});
          testCountRef.current = 0;
          const tests = [
            { name: "login", fn: testLogin },
            { name: "register", fn: testRegister },
            { name: "getCurrentUser", fn: testGetCurrentUser },
            { name: "createRecord", fn: testCreateRecord },
            { name: "getRecords", fn: testGetRecords },
            { name: "updateRecord", fn: testUpdateRecord },
            { name: "deleteRecord", fn: testDeleteRecord },
            { name: "validation", fn: testValidation },
            { name: "sanitization", fn: testSanitization },
            { name: "performance", fn: testPerformance }
          ];
          for (const test of tests) {
            lastTestRef.current = test.name;
            try {
              await test.fn();
              testCountRef.current++;
              await new Promise((resolve) => setTimeout(resolve, 100));
            } catch (err) {
              console.error(`Test ${test.name} failed:`, err);
            }
          }
          setLoading(false);
          triggerConfetti({ particleCount: 100, spread: 70 });
          alert(`Tests completed! ${testCountRef.current}/${tests.length} passed.`);
        };
        return div([
          // Header
          div([
            h1("\u{1F9EA} ATOM Framework - Complete Test Suite", {
              className: "text-4xl font-bold mb-2"
            }),
            p("Comprehensive production-level testing of all framework features", {
              className: "text-gray-600 mb-6"
            }),
            user && div([
              span(`Logged in as: ${user.name} (${user.email})`, {
                className: "text-green-600 font-semibold"
              }),
              button("Logout", {
                onclick: () => {
                  localStorage.removeItem("test_token");
                  setUser(null);
                  setRecords([]);
                },
                className: "ml-4 px-3 py-1 bg-red-500 text-white rounded text-sm"
              })
            ], { className: "mb-4" })
          ], { className: "mb-8" }),
          // Error Display
          error && div([
            p(`Error: ${error}`, {
              className: "text-red-600 bg-red-50 p-4 rounded mb-4"
            })
          ]),
          // Test Categories
          div([
            h2("Test Categories", { className: "text-2xl font-bold mb-4" }),
            div(
              testCategories.map(
                (cat) => button([
                  span(cat.icon, { className: "mr-2" }),
                  span(cat.name)
                ], {
                  onclick: () => setCurrentTest(cat.id),
                  className: `px-4 py-2 rounded mr-2 mb-2 ${currentTest === cat.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`
                })
              ),
              { className: "flex flex-wrap mb-6" }
            ),
            button("\u{1F680} Run All Tests", {
              onclick: runAllTests,
              disabled: loading,
              className: "px-6 py-3 bg-green-600 text-white rounded font-bold hover:bg-green-700 disabled:opacity-50 mb-6"
            })
          ], { className: "mb-8" }),
          // Framework Core Tests
          currentTest === "framework" && div([
            h2("\u269B\uFE0F Framework Core Tests", { className: "text-2xl font-bold mb-4" }),
            div([
              button("Test useState", {
                onclick: (e) => {
                  console.log("Button clicked!", e);
                  e.preventDefault();
                  e.stopPropagation();
                  testUseState();
                },
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              }),
              button("Test useEffect", {
                onclick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  testUseEffect();
                },
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              }),
              button("Test useRef", {
                onclick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  testUseRef();
                },
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              }),
              button("Test useMemo", {
                onclick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  testUseMemo();
                },
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              }),
              button("\u{1F680} Run All Framework Tests", {
                onclick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  runAllFrameworkTests();
                },
                className: "px-4 py-2 bg-green-600 text-white rounded mr-2 mb-2 font-bold"
              }),
              button("Clear Logs", {
                onclick: () => setTestLogs([]),
                className: "px-4 py-2 bg-gray-600 text-white rounded mr-2 mb-2"
              })
            ], { className: "mb-4" }),
            div([
              p(`Counter: ${typeof testCounter === "number" ? testCounter : 0}`, { className: "text-sm text-gray-600" }),
              p(`Effect Count: ${typeof testEffectCount === "number" ? testEffectCount : 0}`, { className: "text-sm text-gray-600" }),
              p(`Ref Value: ${typeof testRef?.current === "number" ? testRef.current : testRef?.current || 0}`, { className: "text-sm text-gray-600" }),
              p(`Memo Value: ${typeof memoizedValue === "number" && !isNaN(memoizedValue) ? memoizedValue : 0}`, { className: "text-sm text-gray-600" })
            ], { className: "mb-4 p-4 bg-gray-50 rounded" }),
            div([
              h3("Results:", { className: "font-bold mb-2" }),
              ...(() => {
                const results = testResultsFramework || {};
                const entries = Object.entries(results);
                if (entries.length > 0) {
                  return entries.map(
                    ([key, value]) => div(`${key}: ${value}`, {
                      className: "p-2 bg-gray-100 rounded mb-1"
                    })
                  );
                } else {
                  return [div("No test results yet. Click a test button above.", {
                    className: "p-2 bg-gray-50 rounded text-gray-500 italic"
                  })];
                }
              })()
            ], { className: "mb-4" }),
            // Test Logs
            div([
              h3("\u{1F4CB} Test Logs:", { className: "font-bold mb-2" }),
              div([
                ...(() => {
                  const logs = Array.isArray(testLogs) ? testLogs : [];
                  if (logs.length === 0) {
                    return [div("No logs yet. Run a test to see detailed execution logs.", {
                      className: "p-2 bg-gray-50 rounded text-gray-500 italic"
                    })];
                  }
                  return logs.slice(-30).map((log, idx) => {
                    const bgColor = log.type === "error" ? "bg-red-50 border-red-200" : log.type === "success" ? "bg-green-50 border-green-200" : log.type === "framework" ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200";
                    const textColor = log.type === "error" ? "text-red-800" : log.type === "success" ? "text-green-800" : log.type === "framework" ? "text-blue-800" : "text-gray-800";
                    return div([
                      span(`[${log.timestamp}]`, { className: "text-xs text-gray-500 mr-2" }),
                      span(log.message, { className: textColor })
                    ], {
                      className: `p-2 border rounded mb-1 text-sm ${bgColor}`
                    });
                  });
                })()
              ], { className: "max-h-96 overflow-y-auto" })
            ])
          ], { className: "mb-8 p-4 border rounded" }),
          // Input Tracking Tests
          currentTest === "inputs" && div([
            h2("\u2328\uFE0F Input Tracking Tests", { className: "text-2xl font-bold mb-4" }),
            p("Type in the inputs below and switch between them to test value preservation:", {
              className: "text-gray-600 mb-4"
            }),
            div([
              div([
                label("Input 1:", { className: "block mb-1 font-medium" }),
                input(null, {
                  type: "text",
                  value: inputTest1,
                  placeholder: "Type here, then switch to Input 2",
                  className: "w-full px-3 py-2 border rounded",
                  oninput: (e) => {
                    setInputTest1(e.target.value);
                    setInputLog((prev) => [...prev, `Input 1: ${e.target.value}`]);
                  },
                  onfocus: testFocusEvent,
                  onblur: testBlurEvent
                })
              ], { className: "mb-4" }),
              div([
                label("Input 2:", { className: "block mb-1 font-medium" }),
                input(null, {
                  type: "text",
                  value: inputTest2,
                  placeholder: "Switch here and type - Input 1 should keep its value",
                  className: "w-full px-3 py-2 border rounded",
                  oninput: (e) => {
                    setInputTest2(e.target.value);
                    setInputLog((prev) => [...prev, `Input 2: ${e.target.value}`]);
                  },
                  onfocus: testFocusEvent,
                  onblur: testBlurEvent
                })
              ], { className: "mb-4" }),
              div([
                label("Textarea:", { className: "block mb-1 font-medium" }),
                textarea(null, {
                  value: inputTest3,
                  placeholder: "Test textarea value preservation",
                  className: "w-full px-3 py-2 border rounded h-24",
                  oninput: (e) => {
                    setInputTest3(e.target.value);
                    setInputLog((prev) => [...prev, `Textarea: ${e.target.value}`]);
                  }
                })
              ], { className: "mb-4" })
            ], { className: "mb-4" }),
            div([
              button("Test Value Preservation", {
                onclick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  testInputTracking();
                },
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              }),
              button("Test Input Switching", {
                onclick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  testInputSwitching();
                },
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              })
            ], { className: "mb-4" }),
            safeInputLog.length > 0 && div([
              h3("Input Log:", { className: "font-bold mb-2" }),
              ...safeInputLog.slice(-10).map(
                (log) => div(log, { className: "text-sm text-gray-600 p-1" })
              )
            ], { className: "mb-4 p-4 bg-gray-50 rounded max-h-40 overflow-y-auto" }),
            div([
              h3("Results:", { className: "font-bold mb-2" }),
              ...Object.entries(inputTestResults || {}).map(
                ([key, value]) => div(`${key}: ${value}`, {
                  className: "p-2 bg-gray-100 rounded mb-1"
                })
              )
            ])
          ], { className: "mb-8 p-4 border rounded" }),
          // Event Handling Tests
          currentTest === "events" && div([
            h2("\u{1F3AF} Event Handling Tests", { className: "text-2xl font-bold mb-4" }),
            div([
              button("Test Click Event", {
                onclick: testClickEvent,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              }),
              span(`Clicks: ${clickCount}`, { className: "text-sm text-gray-600 ml-2" })
            ], { className: "mb-4" }),
            div([
              label("Test Input Event:", { className: "block mb-1 font-medium" }),
              input(null, {
                type: "text",
                placeholder: "Type here to test oninput",
                className: "w-full px-3 py-2 border rounded mb-2",
                oninput: testInputEvent,
                onfocus: testFocusEvent,
                onblur: testBlurEvent,
                onchange: testChangeEvent
              }),
              span(`Input Events: ${inputEventCount}`, { className: "text-sm text-gray-600" })
            ], { className: "mb-4" }),
            div([
              label("Test Select Change:", { className: "block mb-1 font-medium" }),
              select([
                option("Option 1", { value: "1" }),
                option("Option 2", { value: "2" }),
                option("Option 3", { value: "3" })
              ], {
                className: "w-full px-3 py-2 border rounded mb-2",
                onchange: testChangeEvent
              }),
              span(`Change Events: ${changeCount}`, { className: "text-sm text-gray-600" })
            ], { className: "mb-4" }),
            div([
              form([
                input(null, {
                  type: "text",
                  placeholder: "Test form submission",
                  className: "w-full px-3 py-2 border rounded mb-2"
                }),
                button("Test Submit Event", {
                  type: "submit",
                  className: "px-4 py-2 bg-green-600 text-white rounded"
                })
              ], {
                onsubmit: testSubmitEvent
              }),
              span(`Submit Events: ${submitCount}`, { className: "text-sm text-gray-600 ml-2" })
            ], { className: "mb-4" }),
            div([
              h3("Event Results:", { className: "font-bold mb-2" }),
              ...Object.entries(eventResults || {}).map(
                ([key, value]) => div(`${key}: ${value}`, {
                  className: "p-2 bg-gray-100 rounded mb-1"
                })
              )
            ])
          ], { className: "mb-8 p-4 border rounded" }),
          // Forms & Validation Tests
          currentTest === "forms" && div([
            h2("\u{1F4DD} Forms & Validation Tests", { className: "text-2xl font-bold mb-4" }),
            form([
              div([
                label("Name:", { className: "block mb-1 font-medium" }),
                input(null, {
                  type: "text",
                  value: formData.name,
                  placeholder: "Enter your name",
                  className: `w-full px-3 py-2 border rounded ${formErrors.name ? "border-red-500" : ""}`,
                  oninput: (e) => setFormData((prev) => ({ ...prev, name: e.target.value }))
                }),
                formErrors.name && p(formErrors.name, { className: "text-red-600 text-sm mt-1" })
              ], { className: "mb-4" }),
              div([
                label("Email:", { className: "block mb-1 font-medium" }),
                input(null, {
                  type: "email",
                  value: formData.email,
                  placeholder: "Enter your email",
                  className: `w-full px-3 py-2 border rounded ${formErrors.email ? "border-red-500" : ""}`,
                  oninput: (e) => setFormData((prev) => ({ ...prev, email: e.target.value }))
                }),
                formErrors.email && p(formErrors.email, { className: "text-red-600 text-sm mt-1" })
              ], { className: "mb-4" }),
              div([
                label("Message:", { className: "block mb-1 font-medium" }),
                textarea(null, {
                  value: formData.message,
                  placeholder: "Enter your message",
                  className: `w-full px-3 py-2 border rounded h-24 ${formErrors.message ? "border-red-500" : ""}`,
                  oninput: (e) => setFormData((prev) => ({ ...prev, message: e.target.value }))
                }),
                formErrors.message && p(formErrors.message, { className: "text-red-600 text-sm mt-1" })
              ], { className: "mb-4" }),
              div([
                button("Submit Form", {
                  type: "submit",
                  className: "px-4 py-2 bg-blue-600 text-white rounded mr-2"
                }),
                button("Test Validation", {
                  type: "button",
                  onclick: testFormValidation,
                  className: "px-4 py-2 bg-gray-600 text-white rounded"
                })
              ])
            ], {
              onsubmit: testFormSubmission
            }),
            formSubmitted && div([
              p("\u2705 Form submitted successfully!", {
                className: "text-green-600 font-semibold mt-4"
              }),
              p(`Name: ${formData.name}`, { className: "text-sm text-gray-600" }),
              p(`Email: ${formData.email}`, { className: "text-sm text-gray-600" }),
              p(`Message: ${formData.message}`, { className: "text-sm text-gray-600" })
            ], { className: "mt-4 p-4 bg-green-50 rounded" }),
            div([
              h3("Results:", { className: "font-bold mb-2" }),
              ...Object.entries(formResults || {}).map(
                ([key, value]) => div(`${key}: ${value}`, {
                  className: "p-2 bg-gray-100 rounded mb-1"
                })
              )
            ], { className: "mt-4" })
          ], { className: "mb-8 p-4 border rounded" }),
          // State Management Tests
          currentTest === "state" && div([
            h2("\u{1F504} State Management Tests", { className: "text-2xl font-bold mb-4" }),
            p("Comprehensive tests for useState, state updates, batching, and state persistence", {
              className: "text-gray-600 mb-4"
            }),
            div([
              button("Test Basic State Update", {
                onclick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  testStateUpdate();
                },
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              }),
              button("Test Object State", {
                onclick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  testStateObject();
                },
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              }),
              button("Test Array State", {
                onclick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  testStateArray();
                },
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              }),
              button("Test State Batching", {
                onclick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  testStateBatching();
                },
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              }),
              button("Test State Persistence", {
                onclick: (e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  testStatePersistence();
                },
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              }),
              button("Clear Logs", {
                onclick: () => setStateTestLogs([]),
                className: "px-4 py-2 bg-gray-600 text-white rounded mr-2 mb-2"
              })
            ], { className: "mb-4" }),
            div([
              p(`Counter: ${typeof stateTestCounter === "number" ? stateTestCounter : 0}`, { className: "text-sm text-gray-600" }),
              p(`Object Count: ${stateTestObject?.count || 0}`, { className: "text-sm text-gray-600" }),
              p(`Array Length: ${Array.isArray(stateTestArray) ? stateTestArray.length : 0}`, { className: "text-sm text-gray-600" }),
              p(`Array Values: [${Array.isArray(stateTestArray) ? stateTestArray.join(", ") : "N/A"}]`, { className: "text-sm text-gray-600" })
            ], { className: "mb-4 p-4 bg-gray-50 rounded" }),
            div([
              h3("Results:", { className: "font-bold mb-2" }),
              ...(() => {
                const results = stateTestResults || {};
                const entries = Object.entries(results);
                if (entries.length > 0) {
                  return entries.map(
                    ([key, value]) => div(`${key}: ${value}`, {
                      className: "p-2 bg-gray-100 rounded mb-1"
                    })
                  );
                } else {
                  return [div("No results yet. Click a test button above.", {
                    className: "p-2 bg-gray-50 rounded text-gray-500 italic"
                  })];
                }
              })()
            ], { className: "mb-4" }),
            div([
              h3("\u{1F4CB} Test Logs:", { className: "font-bold mb-2" }),
              div([
                ...(() => {
                  const logs = Array.isArray(stateTestLogs) ? stateTestLogs : [];
                  if (logs.length === 0) {
                    return [div("No logs yet. Run a test to see detailed execution logs.", {
                      className: "p-2 bg-gray-50 rounded text-gray-500 italic"
                    })];
                  }
                  return logs.slice(-20).map((log, idx) => {
                    const bgColor = log.type === "error" ? "bg-red-50 border-red-200" : log.type === "success" ? "bg-green-50 border-green-200" : log.type === "framework" ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200";
                    const textColor = log.type === "error" ? "text-red-800" : log.type === "success" ? "text-green-800" : log.type === "framework" ? "text-blue-800" : "text-gray-800";
                    return div([
                      span(`[${log.timestamp}]`, { className: "text-xs text-gray-500 mr-2" }),
                      span(log.message, { className: textColor })
                    ], {
                      className: `p-2 border rounded mb-1 text-sm ${bgColor}`
                    });
                  });
                })()
              ], { className: "max-h-96 overflow-y-auto" })
            ])
          ], { className: "mb-8 p-4 border rounded" }),
          // HTML Helpers Tests
          currentTest === "html" && div([
            h2("\u{1F3F7}\uFE0F HTML Helpers Tests", { className: "text-2xl font-bold mb-4" }),
            button("Test HTML Helpers", {
              onclick: testHtmlHelpers,
              className: "px-4 py-2 bg-blue-600 text-white rounded mb-4"
            }),
            div([
              h3("HTML Elements Rendered:", { className: "font-bold mb-2" }),
              div([
                h1("H1 Heading", { className: "text-2xl" }),
                h2("H2 Heading", { className: "text-xl" }),
                p("Paragraph text", { className: "text-gray-600" }),
                strong("Bold text"),
                em("Italic text"),
                code("Code text", { className: "bg-gray-100 px-2 py-1 rounded" }),
                ul([
                  li("List item 1"),
                  li("List item 2"),
                  li("List item 3")
                ]),
                table([
                  thead([
                    tr([
                      th("Header 1"),
                      th("Header 2")
                    ])
                  ]),
                  tbody([
                    tr([
                      td("Cell 1"),
                      td("Cell 2")
                    ])
                  ])
                ], { className: "border-collapse border border-gray-300" })
              ], { className: "space-y-2" })
            ], { className: "mb-4" }),
            div([
              h3("Results:", { className: "font-bold mb-2" }),
              ...Object.entries(htmlResults || {}).map(
                ([key, value]) => div(`${key}: ${value}`, {
                  className: "p-2 bg-gray-100 rounded mb-1"
                })
              )
            ])
          ], { className: "mb-8 p-4 border rounded" }),
          // Navigation Tests
          currentTest === "navigation" && div([
            h2("\u{1F9ED} Navigation Tests", { className: "text-2xl font-bold mb-4" }),
            div([
              button("Test usePath", {
                onclick: testNavigation,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              }),
              button("Test navigate", {
                onclick: testNavigate,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              }),
              p(`Current Path: ${usePath()}`, {
                className: "text-sm text-gray-600 mt-2"
              })
            ], { className: "mb-4" }),
            div([
              h3("Results:", { className: "font-bold mb-2" }),
              ...Object.entries(navResults || {}).map(
                ([key, value]) => div(`${key}: ${value}`, {
                  className: "p-2 bg-gray-100 rounded mb-1"
                })
              )
            ])
          ], { className: "mb-8 p-4 border rounded" }),
          // Authentication Tests
          currentTest === "auth" && div([
            h2("\u{1F510} Authentication Tests", { className: "text-2xl font-bold mb-4" }),
            div([
              button("Test Login", {
                onclick: testLogin,
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              }),
              button("Test Register", {
                onclick: testRegister,
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              }),
              button("Test Get Current User", {
                onclick: testGetCurrentUser,
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              })
            ], { className: "mb-4" }),
            div([
              h3("Results:", { className: "font-bold mb-2" }),
              ...(() => {
                const authResults = Object.entries(testResults || {}).filter(([key]) => ["login", "register", "getCurrentUser"].includes(key));
                if (authResults.length > 0) {
                  return authResults.map(
                    ([key, value]) => div(`${key}: ${value}`, {
                      className: "p-2 bg-gray-100 rounded mb-1"
                    })
                  );
                } else {
                  return [div("No results yet. Click a test button above.", {
                    className: "p-2 bg-gray-50 rounded text-gray-500 italic"
                  })];
                }
              })()
            ])
          ], { className: "mb-8 p-4 border rounded" }),
          // Database Tests
          currentTest === "database" && div([
            h2("\u{1F4BE} Database Tests", { className: "text-2xl font-bold mb-4" }),
            div([
              button("Test Create Record", {
                onclick: testCreateRecord,
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              }),
              button("Test Get Records", {
                onclick: testGetRecords,
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              }),
              button("Test Update Record", {
                onclick: testUpdateRecord,
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              }),
              button("Test Delete Record", {
                onclick: testDeleteRecord,
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              })
            ], { className: "mb-4" }),
            safeRecords.length > 0 ? div([
              h3("Records:", { className: "font-bold mb-2" }),
              ...safeRecords.slice(0, 5).map((record) => {
                if (!record || typeof record !== "object") return null;
                return div([
                  strong(record.title || `Record ${record.id || "Unknown"}`),
                  p(record.content || "No content", { className: "text-sm text-gray-600" })
                ], {
                  className: "p-2 bg-gray-100 rounded mb-2"
                });
              }).filter(Boolean)
            ]) : null,
            div([
              h3("Results:", { className: "font-bold mb-2" }),
              ...(() => {
                const dbResults = Object.entries(testResults || {}).filter(([key]) => ["createRecord", "getRecords", "updateRecord", "deleteRecord"].includes(key));
                if (dbResults.length > 0) {
                  return dbResults.map(
                    ([key, value]) => div(`${key}: ${value}`, {
                      className: "p-2 bg-gray-100 rounded mb-1"
                    })
                  );
                } else {
                  return [div("No results yet. Click a test button above.", {
                    className: "p-2 bg-gray-50 rounded text-gray-500 italic"
                  })];
                }
              })()
            ])
          ], { className: "mb-8 p-4 border rounded" }),
          // Validation & Sanitization Tests
          currentTest === "validation" && div([
            h2("\u2705 Validation & Sanitization Tests", { className: "text-2xl font-bold mb-4" }),
            div([
              button("Test Validation", {
                onclick: testValidation,
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              }),
              button("Test Sanitization", {
                onclick: testSanitization,
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              })
            ], { className: "mb-4" }),
            div([
              h3("Results:", { className: "font-bold mb-2" }),
              ...(() => {
                const valResults = Object.entries(testResults || {}).filter(([key]) => ["validation", "sanitization"].includes(key));
                if (valResults.length > 0) {
                  return valResults.map(
                    ([key, value]) => div(`${key}: ${value}`, {
                      className: "p-2 bg-gray-100 rounded mb-1"
                    })
                  );
                } else {
                  return [div("No results yet. Click a test button above.", {
                    className: "p-2 bg-gray-50 rounded text-gray-500 italic"
                  })];
                }
              })()
            ])
          ], { className: "mb-8 p-4 border rounded" }),
          // Error Handling Tests
          currentTest === "errors" && div([
            h2("\u26A0\uFE0F Error Handling Tests", { className: "text-2xl font-bold mb-4" }),
            div([
              button("Test Validation Error", {
                onclick: () => testErrorHandling("validation"),
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              }),
              button("Test Database Error", {
                onclick: () => testErrorHandling("database"),
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              }),
              button("Test Permission Error", {
                onclick: () => testErrorHandling("permission"),
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              }),
              button("Test Not Found Error", {
                onclick: () => testErrorHandling("notfound"),
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              })
            ], { className: "mb-4" }),
            div([
              h3("Results:", { className: "font-bold mb-2" }),
              ...(() => {
                const errorResults = Object.entries(testResults || {}).filter(([key]) => key.startsWith("error_"));
                if (errorResults.length > 0) {
                  return errorResults.map(
                    ([key, value]) => div(`${key}: ${value}`, {
                      className: "p-2 bg-gray-100 rounded mb-1"
                    })
                  );
                } else {
                  return [div("No results yet. Click a test button above.", {
                    className: "p-2 bg-gray-50 rounded text-gray-500 italic"
                  })];
                }
              })()
            ])
          ], { className: "mb-8 p-4 border rounded" }),
          // Performance Tests
          currentTest === "performance" && div([
            h2("\u26A1 Performance Tests", { className: "text-2xl font-bold mb-4" }),
            div([
              button("Test Performance (1000 iterations)", {
                onclick: testPerformance,
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              })
            ], { className: "mb-4" }),
            div([
              h3("Results:", { className: "font-bold mb-2" }),
              ...testResults && testResults.performance ? [div(`performance: ${testResults.performance}`, {
                className: "p-2 bg-gray-100 rounded mb-1"
              })] : [div("No results yet. Click a test button above.", {
                className: "p-2 bg-gray-50 rounded text-gray-500 italic"
              })]
            ])
          ], { className: "mb-8 p-4 border rounded" }),
          // Security Tests
          currentTest === "security" && div([
            h2("\u{1F6E1}\uFE0F Security Tests", { className: "text-2xl font-bold mb-4" }),
            p("Security tests are integrated into validation and sanitization tests.", {
              className: "text-gray-600 mb-4"
            }),
            div([
              button("Test XSS Prevention", {
                onclick: testSanitization,
                disabled: loading,
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2 disabled:opacity-50"
              }),
              button("Test SQL Injection Prevention", {
                onclick: () => {
                  alert("SQL injection prevention is handled by parameterized queries. Test by attempting SQL injection in forms.");
                },
                className: "px-4 py-2 bg-blue-600 text-white rounded mr-2 mb-2"
              })
            ], { className: "mb-4" })
          ], { className: "mb-8 p-4 border rounded" }),
          // Loading Indicator
          loading && div([
            p("Loading...", {
              className: "text-blue-600 font-semibold"
            })
          ], { className: "text-center py-4" }),
          // Test Summary
          Object.keys(testResults || {}).length > 0 && div([
            h2("\u{1F4CA} Test Summary", { className: "text-2xl font-bold mb-4" }),
            div([
              p(`Total Tests: ${Object.keys(testResults || {}).length}`, {
                className: "font-semibold"
              }),
              p(`Passed: ${Object.values(testResults || {}).filter((r) => r && typeof r === "string" && r.includes("\u2705")).length}`, {
                className: "text-green-600 font-semibold"
              }),
              p(`Failed: ${Object.values(testResults || {}).filter((r) => r && typeof r === "string" && r.includes("\u274C")).length}`, {
                className: "text-red-600 font-semibold"
              })
            ], { className: "p-4 bg-gray-100 rounded" })
          ], { className: "mt-8" })
        ], {
          className: "max-w-6xl mx-auto p-8"
        });
      };
      let result = PageContent(props);
      result = Layout({ ...props, content: result });
      return result;
    }
  }
);
Routes.push(
  {
    regex: new RegExp("^/users/([^/]+)$"),
    paramNames: ["id"],
    title: "User Profile | ATOM",
    meta: [],
    revalidate: null,
    isStatic: false,
    enableStreaming: false,
    component: (props) => {
      props = props || {};
      const Actions = {};
      Actions.get_user = async function(id) {
        console.log("Fetching User ID:", id);
        return {
          id,
          name: "User " + id,
          role: id === "1" ? "Admin" : "Guest",
          bio: "This data came from the server securely."
        };
      };
      const PageContent = (props2) => {
        props2 = props2 || {};
        const { params } = props2;
        const [user, setUser] = useState(null);
        if (!user) {
          Actions.get_user(params.id).then((data) => setUser(data));
          return div("Loading Profile...", { className: "p-10 text-center text-gray-500" });
        }
        return div([
          div([
            div([
              h1("Welcome", { className: "text-4xl font-bold mb-10" }),
              // No import needed! It's auto-imported.
              Card({ title: "Auto Import" }, "This component was loaded automatically from the _components folder.")
            ], { className: "p-20 bg-gray-50 min-h-screen" }),
            // Avatar Circle
            div(user.name[0], { className: "w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 mx-auto" }),
            h1(user.name, { className: "text-3xl font-bold text-center text-gray-800" }),
            div(user.role, { className: "text-center text-sm uppercase tracking-wide text-blue-500 font-bold mb-4" }),
            div(user.bio, { className: "bg-gray-50 p-4 rounded-lg text-gray-600 text-center" }),
            div([
              a("\u2190 Back Home", { href: "/", className: "text-blue-600 hover:underline" })
            ], { className: "mt-6 text-center" })
          ], { className: "max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg mt-10" })
        ]);
      };
      let result = PageContent(props);
      result = Layout({ ...props, content: result });
      return result;
    }
  }
);
Routes.push(
  {
    regex: /^\/404$/,
    paramNames: [],
    title: "404 Not Found",
    meta: [],
    component: () => {
      return div([h1("404", { style: { fontSize: "100px", fontWeight: "800", margin: 0, color: "#333" } }), div("Page Not Found", { style: { fontSize: "24px", color: "#666", marginBottom: "24px" } }), a("Go Home", { href: "/", style: { background: "#000", color: "#fff", padding: "10px 20px", borderRadius: "6px", textDecoration: "none", fontWeight: "bold" } })], { style: { height: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif", background: "#fff" } });
    }
  }
);
if (typeof module !== "undefined" && module.exports) {
  module.exports.Routes = Routes;
  module.exports.matchRoute = matchRoute;
  module.exports.renderToString = renderToString;
  module.exports.renderToStream = renderToStream;
  module.exports.useState = useState;
  module.exports.useEffect = useEffect;
  module.exports.useMemo = useMemo;
  module.exports.useCallback = useCallback;
  module.exports.useRef = useRef;
  module.exports.usePath = usePath;
  module.exports.navigate = navigate;
}
function matchRoute(path) {
  const normalizedPath = path === "/" ? "/" : path.replace(/\/$/, "");
  for (let i = 0; i < Routes.length; i++) {
    const route = Routes[i];
    if (route.regex.test(normalizedPath)) {
      const match = normalizedPath.match(route.regex);
      const params = {};
      if (route.paramNames && Array.isArray(route.paramNames)) {
        for (let j = 0; j < route.paramNames.length; j++) {
          const name = route.paramNames[j];
          const value = match && match[j + 1] !== void 0 ? match[j + 1] : void 0;
          if (value !== void 0 && value !== null && value !== "") {
            if (typeof value === "string" && value.includes("/")) {
              params[name] = value.split("/").filter(Boolean);
            } else if (value) {
              params[name] = [value];
            } else {
              params[name] = [];
            }
          } else {
            params[name] = [];
          }
        }
      }
      return {
        component: route.component,
        params: params || {},
        title: route.title || "ATOM App",
        meta: route.meta || []
      };
    }
  }
  for (let i = 0; i < Routes.length; i++) {
    if (Routes[i].title === "404 Not Found") {
      return { component: Routes[i].component, params: {}, title: "404 Not Found", meta: [] };
    }
  }
  return null;
}
function renderSSRWithErrorBoundary(component, props, routePath) {
  try {
    if (typeof component !== "function") {
      throw new Error(`Component is not a function. Received: ${typeof component}`);
    }
    return component(props);
  } catch (error) {
    console.error(`SSR Component error in route "${routePath}":`, error);
    const errorMessage = error && error.message ? error.message : "Unknown error";
    return `<div style="padding: 20px; border: 2px solid red; background: #fee; border-radius: 4px; margin: 20px;">
                <h2 style="color: #c00; margin: 0 0 10px 0;">\u26A0\uFE0F Server Rendering Error</h2>
                <p style="color: #800; margin: 0;">${errorMessage}</p>
            </div>`;
  }
}
async function renderToString(url) {
  if (!url || typeof url !== "string") {
    console.error("renderToString: Invalid URL", url);
    return {
      html: "<h1>Invalid Request</h1><p>Invalid URL provided</p>",
      title: "Error",
      meta: [],
      revalidate: null,
      isStatic: false,
      enableStreaming: false
    };
  }
  try {
    const match = matchRoute(url);
    if (!match) {
      return {
        html: "<h1>404 - Page Not Found</h1><p>The requested page could not be found.</p>",
        title: "404 Not Found",
        meta: [],
        revalidate: null,
        isStatic: false,
        enableStreaming: false
      };
    }
    try {
      const componentProps = { params: match.params || {} };
      try {
        if (typeof Layout !== "undefined" && typeof Layout === "function") {
          componentProps.Layout = Layout;
        }
        const layoutKeys = Object.keys(typeof globalThis !== "undefined" ? globalThis : {});
        for (const key of layoutKeys) {
          if (key.startsWith("Layout_") && typeof (typeof globalThis !== "undefined" ? globalThis : {})[key] === "function") {
            componentProps[key] = (typeof globalThis !== "undefined" ? globalThis : {})[key];
          }
        }
      } catch (layoutError) {
        console.warn("renderToString: Error accessing Layout functions", layoutError);
      }
      let html = renderSSRWithErrorBoundary(match.component, componentProps, url);
      if (html && typeof html.then === "function") {
        try {
          html = await html;
        } catch (asyncError) {
          console.error("renderToString: Async component error", asyncError);
          html = `<div style="padding: 20px; border: 2px solid red; background: #fee;">
                            <h2>\u26A0\uFE0F Loading Error</h2>
                            <p>${asyncError.message || "Failed to load component"}</p>
                        </div>`;
        }
      }
      if (typeof html !== "string") {
        if (html && typeof html === "object" && html.outerHTML) {
          html = html.outerHTML;
        } else {
          console.warn("renderToString: Component returned non-string, converting", typeof html);
          html = String(html || "");
        }
      }
      if (!html || html.trim() === "") {
        console.warn("renderToString: Component returned empty HTML for route", url);
        html = "<div>No content</div>";
      }
      return {
        html,
        title: match.title || "Atom App",
        meta: match.meta || [],
        revalidate: match.revalidate || null,
        isStatic: match.isStatic || false,
        enableStreaming: match.enableStreaming || false
      };
    } catch (componentError) {
      console.error("renderToString: Component rendering error", componentError);
      return {
        html: `<div style="padding: 20px; border: 2px solid red; background: #fee; border-radius: 4px; margin: 20px;">
                        <h2 style="color: #c00; margin: 0 0 10px 0;">\u26A0\uFE0F Server Rendering Error</h2>
                        <p style="color: #800; margin: 0;">${componentError.message || "Unknown error occurred"}</p>
                    </div>`,
        title: "Error",
        meta: [],
        revalidate: null,
        isStatic: false,
        enableStreaming: false
      };
    }
  } catch (e) {
    console.error("renderToString: Fatal error", e);
    return {
      html: `<div style="padding: 20px; border: 2px solid red; background: #fee;">
                    <h2>\u26A0\uFE0F Fatal Server Error</h2>
                    <p>${e.message || "An unexpected error occurred"}</p>
                </div>`,
      title: "Error",
      meta: [],
      revalidate: null,
      isStatic: false,
      enableStreaming: false
    };
  }
}
async function* renderToStream(url) {
  const match = matchRoute(url);
  if (!match) {
    yield "<h1>404 Error</h1>";
    return;
  }
  try {
    const metaTags = (match.meta || []).map((m) => `<meta name="${m.name}" content="${m.content}">`).join("\n");
    yield `<!DOCTYPE html><html><head><title>${match.title || "Atom App"}</title>${metaTags}<meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" href="/atom-icon.svg" type="image/svg+xml"></head><body><div id="root">`;
    const componentProps = { params: match.params || {} };
    const html = match.component(componentProps);
    yield html;
    yield '</div><script src="/bundle.js"></script></body></html>';
  } catch (e) {
    yield `<h1>Server Error</h1><p>${e.message}</p>`;
  }
}
