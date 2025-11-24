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
            var code = [
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
              worker = new Worker(URL.createObjectURL(new Blob([code])));
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
    if (key === "className") attrs += ` class="${props[key]}"`;
    else if (key === "style") {
      const styleStr = Object.entries(props[key]).map(([k, v]) => `${k.replace(/([A-Z])/g, "-$1").toLowerCase()}:${v}`).join(";");
      attrs += ` style="${styleStr}"`;
    } else if (key === "innerHTML") {
    } else if (["autoplay", "loop", "muted", "controls", "playsinline", "checked", "disabled"].includes(key)) {
      if (props[key]) attrs += ` ${key}`;
    } else attrs += ` ${key}="${props[key]}"`;
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
var textarea = (c, p2) => el("textarea", c, p2);
var nav = (c, p2) => el("nav", c, p2);
var footer = (c, p2) => el("footer", c, p2);
var span = (c, p2) => el("span", c, p2);
var section = (c, p2) => el("section", c, p2);
var main = (c, p2) => el("main", c, p2);
var label = (c, p2) => el("label", c, p2);
var strong = (c, p2) => el("strong", c, p2);
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
    return div([
      labelText ? label(labelText, { className: "block text-sm font-medium text-gray-700 mb-1" }) : null,
      type === "textarea" ? textarea(null, {
        className: `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${error ? "border-red-500 bg-red-50" : "border-gray-300"} ${className}`,
        placeholder,
        value,
        required,
        oninput: (e) => onChange(e.target.value)
      }) : input(null, {
        type,
        value,
        className: `w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${error ? "border-red-500 bg-red-50" : "border-gray-300"} ${className}`,
        placeholder,
        required,
        oninput: (e) => onChange(e.target.value)
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
        const [serverError, setServerError] = useState(null);
        const validate = () => {
          const newErrors = {};
          if (!formData.name.trim()) newErrors.name = "Name is required";
          if (!formData.email.trim()) newErrors.email = "Email is required";
          else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email format";
          if (!formData.message.trim()) newErrors.message = "Message is required";
          else if (formData.message.length < 10) newErrors.message = "Message too short";
          setErrors(newErrors);
          return Object.keys(newErrors).length === 0;
        };
        const handleSubmit = async (e) => {
          e.preventDefault();
          if (!validate()) return;
          setLoading(true);
          setServerError(null);
          try {
            const result2 = await Actions.secure_submitContact(formData);
            setSuccess(true);
            setFormData({ name: "", email: "", message: "" });
          } catch (err) {
            setServerError(err);
          } finally {
            setLoading(false);
          }
        };
        const updateField = (field, value) => {
          setFormData({ ...formData, [field]: value });
          if (errors[field]) setErrors({ ...errors, [field]: null });
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
                  h3("Message Sent!", { className: "text-2xl font-bold mb-2" }),
                  p("Thank you for reaching out. We'll be in touch shortly.", { className: "text-gray-600 mb-6" }),
                  button("Send Another", {
                    className: "px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition",
                    onclick: () => setSuccess(false)
                  })
                ], { className: "text-center py-12" }) : form([
                  serverError ? ErrorDisplay({ error: serverError, className: "mb-6" }) : null,
                  div([
                    FormInput({
                      label: "Full Name",
                      value: formData.name,
                      placeholder: "Jane Doe",
                      error: errors.name,
                      onChange: (val) => updateField("name", val)
                    })
                  ], { className: "mb-4" }),
                  div([
                    FormInput({
                      label: "Email Address",
                      type: "email",
                      value: formData.email,
                      placeholder: "jane@example.com",
                      error: errors.email,
                      onChange: (val) => updateField("email", val)
                    })
                  ], { className: "mb-4" }),
                  div([
                    FormInput({
                      label: "Message",
                      type: "textarea",
                      value: formData.message,
                      placeholder: "How can we help you?",
                      error: errors.message,
                      onChange: (val) => updateField("message", val),
                      className: "h-32"
                    })
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
        const [currentTest, setCurrentTest] = useState("auth");
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
          { id: "auth", name: "Authentication", icon: "\u{1F510}" },
          { id: "database", name: "Database", icon: "\u{1F4BE}" },
          { id: "validation", name: "Validation", icon: "\u2705" },
          { id: "errors", name: "Error Handling", icon: "\u26A0\uFE0F" },
          { id: "performance", name: "Performance", icon: "\u26A1" },
          { id: "security", name: "Security", icon: "\u{1F6E1}\uFE0F" }
        ], []);
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
    yield `<!DOCTYPE html><html><head><title>${match.title || "Atom App"}</title>${metaTags}<meta name="viewport" content="width=device-width, initial-scale=1.0"><link rel="icon" href="/favicon.ico"></head><body><div id="root">`;
    const componentProps = { params: match.params || {} };
    const html = match.component(componentProps);
    yield html;
    yield '</div><script src="/bundle.js"></script></body></html>';
  } catch (e) {
    yield `<h1>Server Error</h1><p>${e.message}</p>`;
  }
}
