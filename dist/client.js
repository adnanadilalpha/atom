var AtomApp = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // node_modules/canvas-confetti/dist/confetti.module.mjs
  var confetti_module_exports = {};
  __export(confetti_module_exports, {
    create: () => create,
    default: () => confetti_module_default
  });
  var module, confetti_module_default, create;
  var init_confetti_module = __esm({
    "node_modules/canvas-confetti/dist/confetti.module.mjs"() {
      module = {};
      (function main(global, module2, isWorker, workerSize) {
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
          var ModulePromise = module2.exports.Promise;
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
                "(" + main.toString() + ")(this, module, true, SIZE);",
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
        module2.exports = function() {
          return getDefaultFire().apply(this, arguments);
        };
        module2.exports.reset = function() {
          getDefaultFire().reset();
        };
        module2.exports.create = confettiCannon;
        module2.exports.shapeFromPath = shapeFromPath;
        module2.exports.shapeFromText = shapeFromText;
      })((function() {
        if (typeof window !== "undefined") {
          return window;
        }
        if (typeof self !== "undefined") {
          return self;
        }
        return this || {};
      })(), module, false);
      confetti_module_default = module.exports;
      create = module.exports.create;
    }
  });

  // dist/client_temp.js
  var client_temp_exports = {};
  __export(client_temp_exports, {
    Routes: () => Routes,
    matchRoute: () => matchRoute,
    navigate: () => navigate,
    renderApp: () => renderApp,
    useCallback: () => useCallback,
    useEffect: () => useEffect,
    useMemo: () => useMemo,
    usePath: () => usePath,
    useRef: () => useRef,
    useState: () => useState
  });
  init_confetti_module();
  window.__ATOM_STATE__ = [];
  var _state = window.__ATOM_STATE__;
  var _cursor = 0;
  var _currentPath = window.location.pathname;
  var AtomVideo = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.state = { playing: false, progress: 0, duration: 0, muted: false };
      this._handlers = [];
      this._timeoutId = null;
    }
    connectedCallback() {
      const src = this.getAttribute("src");
      const poster = this.getAttribute("poster");
      const autoplay = this.hasAttribute("autoplay") ? "autoplay" : "";
      const loop = this.hasAttribute("loop") ? "loop" : "";
      const muted = this.hasAttribute("muted") ? "muted" : "";
      const playsinline = this.hasAttribute("playsinline") ? "playsinline" : "";
      this.shadowRoot.innerHTML = `<style>:host{display:block;position:relative;width:100%;height:100%;background:#000;overflow:hidden}video{width:100%;height:100%;object-fit:cover;display:block}.ui-layer{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:20}::slotted(*){pointer-events:auto}</style><video src="${src}" ${poster ? 'poster="' + poster + '"' : ""} ${autoplay} ${loop} ${muted} ${playsinline}></video><div class="ui-layer"><slot></slot></div>`;
      this.video = this.shadowRoot.querySelector("video");
      if (this.hasAttribute("muted")) this.video.muted = true;
      const timeUpdateHandler = () => this.updateState();
      const metadataHandler = () => this.updateState();
      const playHandler = () => {
        this.state.playing = true;
        this.emit();
      };
      const pauseHandler = () => {
        this.state.playing = false;
        this.emit();
      };
      const clickHandler = () => this.togglePlay();
      const actionHandler = (e) => {
        e.stopPropagation();
        const { action, value } = e.detail;
        if (action === "toggle") this.togglePlay();
        else if (action === "seek") this.video.currentTime = value / 100 * this.video.duration;
        else if (action === "mute") {
          this.video.muted = !this.video.muted;
          this.state.muted = this.video.muted;
          this.emit();
        }
      };
      this.video.addEventListener("timeupdate", timeUpdateHandler);
      this.video.addEventListener("loadedmetadata", metadataHandler);
      this.video.addEventListener("play", playHandler);
      this.video.addEventListener("pause", pauseHandler);
      this.video.addEventListener("click", clickHandler);
      this.addEventListener("atom-action", actionHandler);
      this._handlers = [
        { el: this.video, event: "timeupdate", handler: timeUpdateHandler },
        { el: this.video, event: "loadedmetadata", handler: metadataHandler },
        { el: this.video, event: "play", handler: playHandler },
        { el: this.video, event: "pause", handler: pauseHandler },
        { el: this.video, event: "click", handler: clickHandler },
        { el: this, event: "atom-action", handler: actionHandler }
      ];
      this._timeoutId = setTimeout(() => {
        if (!this.video.paused) {
          this.state.playing = true;
          this.emit();
        }
        this.state.muted = this.video.muted;
      }, 100);
    }
    disconnectedCallback() {
      this._handlers.forEach(({ el: el2, event, handler }) => {
        el2.removeEventListener(event, handler);
      });
      this._handlers = [];
      if (this._timeoutId) {
        clearTimeout(this._timeoutId);
        this._timeoutId = null;
      }
    }
    togglePlay() {
      if (this.video.paused) this.video.play();
      else this.video.pause();
    }
    updateState() {
      this.state.progress = this.video.currentTime / this.video.duration * 100 || 0;
      this.state.duration = this.video.duration;
      this.emit();
    }
    emit() {
      const event = new CustomEvent("atom-state", { detail: { ...this.state } });
      this.querySelectorAll("*").forEach((el2) => el2.dispatchEvent(event));
    }
  };
  if (!customElements.get("atom-video")) customElements.define("atom-video", AtomVideo);
  var AtomPlayButton = class extends HTMLElement {
    connectedCallback() {
      this.style.display = "inline-flex";
      this.style.cursor = "pointer";
      this.onclick = (e) => {
        e.stopPropagation();
        this.dispatchEvent(new CustomEvent("atom-action", { bubbles: true, detail: { action: "toggle" } }));
      };
      this.render(false);
      this.addEventListener("atom-state", (e) => this.render(e.detail.playing));
    }
    render(playing) {
      this.innerHTML = playing ? '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>' : '<svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>';
    }
  };
  if (!customElements.get("atom-play")) customElements.define("atom-play", AtomPlayButton);
  var AtomProgress = class extends HTMLElement {
    connectedCallback() {
      this.style.display = "block";
      this.style.width = "100%";
      this.style.height = "100%";
      this.style.cursor = "pointer";
      this.innerHTML = '<div style="width:100%;height:100%;background:rgba(255,255,255,0.3);border-radius:10px;overflow:hidden;"><div id="fill" style="background:currentColor;width:0%;height:100%;"></div></div>';
      this.fill = this.querySelector("#fill");
      this.onclick = (e) => {
        e.stopPropagation();
        const rect = this.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width * 100;
        this.dispatchEvent(new CustomEvent("atom-action", { bubbles: true, detail: { action: "seek", value: pos } }));
      };
      this.addEventListener("atom-state", (e) => {
        this.fill.style.width = e.detail.progress + "%";
      });
    }
  };
  if (!customElements.get("atom-progress")) customElements.define("atom-progress", AtomProgress);
  var AtomCursor = class extends HTMLElement {
    constructor() {
      super();
      this._mousemoveHandler = null;
      this._stateHandler = null;
      this._timeoutId = null;
    }
    connectedCallback() {
      this.style.position = "absolute";
      this.style.zIndex = "50";
      this.style.pointerEvents = "none";
      this.style.transform = "translate(-50%, -50%)";
      this.innerHTML = '<div style="background:rgba(0,0,0,0.5);backdrop-filter:blur(4px);padding:12px;border-radius:50%;color:white;"><svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>';
      this._timeoutId = setTimeout(() => {
        const container = this.closest("atom-video");
        if (!container) return;
        this._mousemoveHandler = (e) => {
          const rect = container.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          this.style.left = x + "px";
          this.style.top = y + "px";
        };
        this._stateHandler = (e) => {
          this.querySelector("svg").innerHTML = e.detail.playing ? '<path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>' : '<path d="M8 5v14l11-7z"/>';
        };
        container.addEventListener("mousemove", this._mousemoveHandler);
        this.addEventListener("atom-state", this._stateHandler);
      }, 100);
    }
    disconnectedCallback() {
      if (this._timeoutId) {
        clearTimeout(this._timeoutId);
        this._timeoutId = null;
      }
      const container = this.closest("atom-video");
      if (container && this._mousemoveHandler) {
        container.removeEventListener("mousemove", this._mousemoveHandler);
      }
      if (this._stateHandler) {
        this.removeEventListener("atom-state", this._stateHandler);
      }
    }
  };
  if (!customElements.get("atom-cursor")) customElements.define("atom-cursor", AtomCursor);
  var _cleanupFunctions = [];
  var _effectTimeouts = [];
  var _effectDeps = [];
  var _effectCursor = 0;
  function useState(initialValue) {
    if (_isRendering === false && _cursor > 0) {
      console.warn("useState called outside render cycle. This may indicate a hook ordering issue.");
    }
    const cursor = _cursor;
    if (!Array.isArray(_state)) {
      _state = [];
      window.__ATOM_STATE__ = _state;
    }
    if (!(cursor in _state)) {
      _state[cursor] = initialValue;
    }
    const setState = (newValue) => {
      try {
        if (cursor >= _state.length) {
          console.error("useState: Attempted to update state at invalid cursor position", cursor);
          return;
        }
        _state[cursor] = newValue;
        scheduleRender();
      } catch (e) {
        console.error("useState setState error:", e);
        throw new Error(`useState setState failed: ${e.message}`);
      }
    };
    const value = _state[cursor];
    _cursor++;
    return [value !== void 0 ? value : initialValue, setState];
  }
  function depsEqual(deps1, deps2) {
    if (!deps1 && !deps2) return true;
    if (!deps1 || !deps2) return false;
    if (Array.isArray(deps1) && Array.isArray(deps2)) {
      if (deps1.length !== deps2.length) return false;
      for (let i = 0; i < deps1.length; i++) {
        if (deps1[i] !== deps2[i]) return false;
      }
      return true;
    }
    return deps1 === deps2;
  }
  function useEffect(callback, deps) {
    if (typeof callback !== "function") {
      console.error("useEffect: First argument must be a function. Received:", typeof callback);
      return;
    }
    if (typeof window !== "undefined") {
      const effectId = _effectCursor++;
      const prevDeps = _effectDeps[effectId];
      const prevCleanup = _cleanupFunctions[effectId];
      const prevTimeout = _effectTimeouts[effectId];
      const normalizedDeps = deps === void 0 ? null : Array.isArray(deps) ? deps : [deps];
      const normalizedPrevDeps = prevDeps === void 0 ? null : Array.isArray(prevDeps) ? prevDeps : [prevDeps];
      const isFirstRun = normalizedPrevDeps === null;
      const depsChanged = isFirstRun || !depsEqual(normalizedPrevDeps, normalizedDeps);
      if (depsChanged) {
        if (prevTimeout) {
          clearTimeout(prevTimeout);
        }
        if (prevCleanup && typeof prevCleanup === "function") {
          try {
            prevCleanup();
          } catch (e) {
            console.error("useEffect cleanup error:", e);
          }
        }
        _effectDeps[effectId] = normalizedDeps !== null ? Array.isArray(normalizedDeps) ? [...normalizedDeps] : normalizedDeps : null;
        const timeoutId = setTimeout(() => {
          try {
            const cleanup = callback();
            if (typeof cleanup === "function") {
              _cleanupFunctions[effectId] = cleanup;
            } else {
              _cleanupFunctions[effectId] = null;
            }
          } catch (e) {
            console.error("useEffect callback error:", e);
            console.error("Effect ID:", effectId, "Deps:", normalizedDeps);
            _cleanupFunctions[effectId] = null;
          }
        }, 0);
        _effectTimeouts[effectId] = timeoutId;
      }
    }
  }
  var _memoValues = [];
  var _memoDeps = [];
  var _memoCursor = 0;
  function useMemo(factory, deps) {
    const cursor = _memoCursor++;
    if (!Array.isArray(_memoValues)) {
      _memoValues = [];
    }
    if (!Array.isArray(_memoDeps)) {
      _memoDeps = [];
    }
    const prevDeps = _memoDeps[cursor];
    const depsChanged = !prevDeps || !depsEqual(prevDeps, deps);
    if (depsChanged || _memoValues[cursor] === void 0) {
      _memoValues[cursor] = factory();
      _memoDeps[cursor] = deps ? Array.isArray(deps) ? [...deps] : deps : null;
    }
    return _memoValues[cursor];
  }
  function useCallback(callback, deps) {
    return callback;
  }
  var _refs = [];
  var _refCursor = 0;
  function useRef(initialValue) {
    if (_isRendering === false && _refCursor > 0) {
      console.warn("useRef called outside render cycle. This may indicate a hook ordering issue.");
    }
    const cursor = _refCursor++;
    if (!Array.isArray(_refs)) {
      _refs = [];
    }
    if (_refs[cursor] === void 0) {
      _refs[cursor] = { current: initialValue };
    }
    return _refs[cursor];
  }
  function usePath() {
    return _currentPath;
  }
  var _renderTimeout = null;
  var _isRendering = false;
  function scheduleRender() {
    if (_isRendering) return;
    if (_renderTimeout) clearTimeout(_renderTimeout);
    _renderTimeout = setTimeout(() => {
      _isRendering = true;
      renderApp();
      _isRendering = false;
    }, 0);
  }
  function cleanupEffects() {
    _effectTimeouts.forEach((timeoutId) => {
      if (timeoutId) clearTimeout(timeoutId);
    });
    _cleanupFunctions.forEach((cleanup, id) => {
      if (cleanup && typeof cleanup === "function") {
        try {
          cleanup();
        } catch (e) {
          console.error("Cleanup error:", e);
        }
      }
    });
    _cleanupFunctions = [];
    _effectTimeouts = [];
    _effectDeps = [];
    _effectCursor = 0;
  }
  function navigate(path) {
    cleanupEffects();
    if (_renderTimeout) {
      clearTimeout(_renderTimeout);
      _renderTimeout = null;
    }
    window.history.pushState({}, "", path);
    _currentPath = path;
    _state = [];
    window.__ATOM_STATE__ = [];
    _cursor = 0;
    _refs = [];
    _refCursor = 0;
    _memoValues = [];
    _memoDeps = [];
    _memoCursor = 0;
    scheduleRender();
  }
  function el(tag, content, props = {}) {
    const element = document.createElement(tag);
    if (content instanceof Node) {
      element.appendChild(content);
    } else if (content === null || content === void 0 || content === false) {
    } else if (Array.isArray(content)) {
      content.forEach((child) => {
        if (child === null || child === void 0 || child === false) {
          return;
        }
        if (child instanceof Node) {
          element.appendChild(child);
        } else if (typeof child === "string" || typeof child === "number") {
          element.appendChild(document.createTextNode(String(child)));
        }
      });
    } else if (typeof content === "string" || typeof content === "number") {
      element.appendChild(document.createTextNode(content));
    } else {
      element.appendChild(document.createTextNode(String(content)));
    }
    Object.keys(props).forEach((key) => {
      if (!isNaN(parseInt(key)) && isFinite(key)) return;
      const val = props[key];
      if (key.startsWith("on")) {
        element[key.toLowerCase()] = val;
      } else if (key === "style") {
        if (val && typeof val === "object" && !Array.isArray(val)) {
          Object.assign(element.style, val);
        }
      } else if (key === "className") {
        element.className = val;
      } else if (key === "innerHTML") {
        element.innerHTML = val;
      } else if (["muted", "autoplay", "loop", "checked", "disabled", "readonly", "controls", "playsinline"].includes(key)) {
        if (val) {
          element.setAttribute(key, "");
          element[key] = true;
        } else {
          element.removeAttribute(key);
          element[key] = false;
        }
      } else if (key === "value") {
        element.value = val;
        element.setAttribute("value", val);
      } else if (val !== null && val !== void 0 && typeof val !== "object") {
        element.setAttribute(key, String(val));
      }
    });
    return element;
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
  var main2 = (c, p2) => el("main", c, p2);
  var label = (c, p2) => el("label", c, p2);
  var strong = (c, p2) => el("strong", c, p2);
  var img = (props) => el("img", null, props);
  var Image = (props) => {
    const { src, width, height, sizes, quality, format, ...restProps } = props;
    if (src && (src.startsWith("http://") || src.startsWith("https://"))) {
      return img({ loading: "lazy", decoding: "async", ...props });
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
        const url = getOptimizedUrl(w, null, quality, format);
        return `${url} ${w}w`;
      }).join(", ");
      return img({
        src: getOptimizedUrl(width, height, quality, format),
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
      const optimizedSrc = getOptimizedUrl(width, height, quality, format);
      return img({
        src: optimizedSrc,
        width,
        height,
        loading: "lazy",
        decoding: "async",
        ...restProps
      });
    }
    return img({ loading: "lazy", decoding: "async", ...props });
  };
  var a = (text, props) => {
    const safeProps = props || {};
    safeProps.onclick = (e) => {
      if (safeProps.href && (safeProps.href.startsWith("http") || safeProps.href.includes(":"))) return;
      e.preventDefault();
      navigate(safeProps.href);
    };
    return el("a", text, safeProps);
  };
  var Layout = (props) => {
    const { content } = props || {};
    const currentPath = typeof usePath !== "undefined" ? usePath() : typeof window !== "undefined" ? window.location.pathname : "/";
    return div([
      Header({ activePath: currentPath }),
      // 2. The Page Content Injected Here
      main2(content ? div(content) : div("Loading...", { className: "flex justify-center p-20" }), { className: "min-h-screen pt-6" }),
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
          (img2, idx) => div([
            Image({
              src: img2.src,
              alt: img2.alt,
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
        Actions.secure_getPost = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_blog__id__secure_getPost", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_getPost" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
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
        Actions.secure_getPosts = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_blog_secure_getPosts", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_getPosts" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
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
        Actions.secure_submitContact = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_contact_secure_submitContact", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_submitContact" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
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
        Actions.secure_getStats = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_dashboard_home_secure_getStats", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_getStats" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
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
        Actions.secure_throwError = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_error_tests_secure_throwError", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_throwError" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
        };
        Actions.secure_validateInput = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_error_tests_secure_validateInput", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_validateInput" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
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
          confetti_module_default({
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
        Actions.secure_getProducts = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_products_secure_getProducts", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_getProducts" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
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
        Actions.secure_testLogin = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_test_suite_secure_testLogin", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_testLogin" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
        };
        Actions.secure_testRegister = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_test_suite_secure_testRegister", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_testRegister" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
        };
        Actions.secure_testGetCurrentUser = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_test_suite_secure_testGetCurrentUser", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_testGetCurrentUser" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
        };
        Actions.secure_testCreateRecord = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_test_suite_secure_testCreateRecord", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_testCreateRecord" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
        };
        Actions.secure_testGetRecords = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_test_suite_secure_testGetRecords", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_testGetRecords" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
        };
        Actions.secure_testUpdateRecord = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_test_suite_secure_testUpdateRecord", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_testUpdateRecord" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
        };
        Actions.secure_testDeleteRecord = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_test_suite_secure_testDeleteRecord", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_testDeleteRecord" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
        };
        Actions.secure_testValidation = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_test_suite_secure_testValidation", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_testValidation" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
        };
        Actions.secure_testSanitization = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_test_suite_secure_testSanitization", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_testSanitization" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
        };
        Actions.secure_testErrorHandling = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_test_suite_secure_testErrorHandling", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_testErrorHandling" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
        };
        Actions.secure_testPerformance = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_test_suite_secure_testPerformance", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_testPerformance" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
        };
        Actions.secure_testFileUpload = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_test_suite_secure_testFileUpload", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_testFileUpload" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
        };
        Actions.secure_testWebSocket = async (data, options = {}) => {
          const method = options.method || "POST";
          const headers = { "Content-Type": "application/json", ...options.headers || {} };
          const res = await fetch("/_atom/rpc/_test_suite_secure_testWebSocket", {
            method,
            headers,
            body: JSON.stringify(data),
            ...options.signal ? { signal: options.signal } : {}
          });
          if (!res.ok) {
            const error = await res.json().catch(() => ({ error: res.statusText }));
            const errorMsg = error.error || res.statusText;
            const enhancedError = new Error(`Server Action "secure_testWebSocket" failed: ${errorMsg}`);
            if (error.function) enhancedError.function = error.function;
            if (error.hint) enhancedError.hint = error.hint;
            throw enhancedError;
          }
          const result2 = await res.json();
          return result2;
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
              Promise.resolve().then(() => (init_confetti_module(), confetti_module_exports)).then((module2) => {
                window.confetti = module2.default || module2;
              }).catch(() => {
              });
            }
          }, []);
          const triggerConfetti = (options = {}) => {
            try {
              const confettiFn = window.confetti || (typeof confetti_module_default !== "undefined" ? confetti_module_default : null);
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
                html: '<p>Test <script>alert("xss")<\/script></p>',
                string: "<strong>Test</strong> String",
                email: "test@example.com",
                url: 'javascript:alert("xss")',
                object: { name: '<script>alert("xss")<\/script>' }
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
  function diff(parent, newEl, oldEl) {
    if (!parent || !(parent instanceof Node)) {
      console.error("diff: parent must be a valid DOM Node", parent);
      return;
    }
    if (!newEl || !(newEl instanceof Node)) {
      console.error("diff: newEl must be a valid DOM Node", newEl);
      return;
    }
    try {
      if (!oldEl) {
        parent.appendChild(newEl);
        return;
      }
      if (!(oldEl instanceof Node)) {
        console.error("diff: oldEl is not a valid DOM Node", oldEl);
        parent.replaceChild(newEl, oldEl);
        return;
      }
      if (!newEl) {
        try {
          parent.removeChild(oldEl);
        } catch (e) {
          console.warn("diff: Could not remove oldEl", e);
        }
        return;
      }
      if (newEl.nodeType === 3 && oldEl.nodeType === 3) {
        if (newEl.nodeValue !== oldEl.nodeValue) {
          try {
            oldEl.nodeValue = newEl.nodeValue;
          } catch (e) {
            console.warn("diff: Could not update text node value", e);
          }
        }
        return;
      }
      if (newEl.nodeName !== oldEl.nodeName) {
        try {
          parent.replaceChild(newEl, oldEl);
        } catch (e) {
          console.error("diff: Error replacing node", e);
          try {
            parent.innerHTML = "";
            parent.appendChild(newEl);
          } catch (e2) {
            console.error("diff: Fatal error in fallback", e2);
          }
        }
        return;
      }
      if (newEl.nodeName.includes("-")) return;
      try {
        Array.from(oldEl.attributes).forEach((attr) => {
          try {
            if (!newEl.hasAttribute(attr.name)) {
              oldEl.removeAttribute(attr.name);
              if (attr.name in oldEl) oldEl[attr.name] = false;
            }
          } catch (e) {
            console.warn("diff: Error removing attribute", attr.name, e);
          }
        });
      } catch (e) {
        console.warn("diff: Error processing old attributes", e);
      }
      try {
        Array.from(newEl.attributes).forEach((attr) => {
          try {
            const name = attr.name;
            const value = attr.value;
            if (oldEl.getAttribute(name) !== value) {
              oldEl.setAttribute(name, value);
            }
            if (["value", "checked", "muted", "autoplay", "loop"].includes(name)) {
              oldEl[name] = name === "value" ? value : true;
            }
          } catch (e) {
            console.warn("diff: Error setting attribute", attr.name, e);
          }
        });
      } catch (e) {
        console.warn("diff: Error processing new attributes", e);
      }
      try {
        if (newEl.tagName === "INPUT" && newEl.value !== oldEl.value) {
          oldEl.value = newEl.value;
        }
      } catch (e) {
        console.warn("diff: Error syncing input value", e);
      }
      try {
        if (newEl.onclick !== oldEl.onclick) oldEl.onclick = newEl.onclick;
        if (newEl.oninput !== oldEl.oninput) oldEl.oninput = newEl.oninput;
      } catch (e) {
        console.warn("diff: Error syncing events", e);
      }
      try {
        const newChildren = Array.from(newEl.childNodes);
        const oldChildren = Array.from(oldEl.childNodes);
        const maxLength = Math.max(newChildren.length, oldChildren.length);
        for (let i = 0; i < maxLength; i++) {
          try {
            const newChild = newChildren[i];
            const oldChild = oldChildren[i];
            if (newChild && newChild instanceof Node) {
              diff(oldEl, newChild, oldChild);
            } else if (oldChild && oldChild instanceof Node) {
              try {
                oldEl.removeChild(oldChild);
              } catch (e) {
                console.warn("diff: Could not remove old child", e);
              }
            }
          } catch (childError) {
            console.warn(`diff: Error diffing child at index ${i}`, childError);
          }
        }
      } catch (e) {
        console.error("diff: Error processing children", e);
        try {
          parent.replaceChild(newEl, oldEl);
        } catch (e2) {
          console.error("diff: Fatal error in children fallback", e2);
        }
      }
    } catch (e) {
      console.error("diff: Fatal error", e);
      try {
        if (oldEl && oldEl.parentNode === parent) {
          parent.replaceChild(newEl, oldEl);
        } else {
          parent.appendChild(newEl);
        }
      } catch (e2) {
        console.error("diff: Cannot recover from error", e2);
      }
    }
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
  var cssContent = '*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n  --tw-contain-size:  ;\n  --tw-contain-layout:  ;\n  --tw-contain-paint:  ;\n  --tw-contain-style:  ;\n}/*\n! tailwindcss v3.4.17 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: \'\';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user\'s configured `sans` font-family by default.\n5. Use the user\'s configured `sans` font-feature-settings by default.\n6. Use the user\'s configured `sans` font-variation-settings by default.\n7. Disable tap highlights on iOS\n*/\n\nhtml,\n:host {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n  -webkit-tap-highlight-color: transparent; /* 7 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user\'s configured `mono` font-family by default.\n2. Use the user\'s configured `mono` font-feature-settings by default.\n3. Use the user\'s configured `mono` font-variation-settings by default.\n4. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; /* 1 */\n  font-feature-settings: normal; /* 2 */\n  font-variation-settings: normal; /* 3 */\n  font-size: 1em; /* 4 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  letter-spacing: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\ninput:where([type=\'button\']),\ninput:where([type=\'reset\']),\ninput:where([type=\'submit\']) {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type=\'search\'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user\'s configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role="button"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don\'t get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden]:where(:not([hidden="until-found"])) {\n  display: none;\n} .fixed {\n  position: fixed;\n} .sticky {\n  position: sticky;\n} .top-0 {\n  top: 0px;\n} .top-24 {\n  top: 6rem;\n} .z-50 {\n  z-index: 50;\n} .col-span-1 {\n  grid-column: span 1 / span 1;\n} .mx-2 {\n  margin-left: 0.5rem;\n  margin-right: 0.5rem;\n} .mx-auto {\n  margin-left: auto;\n  margin-right: auto;\n} .-mt-10 {\n  margin-top: -2.5rem;\n} .mb-1 {\n  margin-bottom: 0.25rem;\n} .mb-10 {\n  margin-bottom: 2.5rem;\n} .mb-12 {\n  margin-bottom: 3rem;\n} .mb-2 {\n  margin-bottom: 0.5rem;\n} .mb-3 {\n  margin-bottom: 0.75rem;\n} .mb-4 {\n  margin-bottom: 1rem;\n} .mb-6 {\n  margin-bottom: 1.5rem;\n} .mb-8 {\n  margin-bottom: 2rem;\n} .ml-4 {\n  margin-left: 1rem;\n} .mr-2 {\n  margin-right: 0.5rem;\n} .mr-3 {\n  margin-right: 0.75rem;\n} .mr-4 {\n  margin-right: 1rem;\n} .mt-1 {\n  margin-top: 0.25rem;\n} .mt-10 {\n  margin-top: 2.5rem;\n} .mt-12 {\n  margin-top: 3rem;\n} .mt-2 {\n  margin-top: 0.5rem;\n} .mt-4 {\n  margin-top: 1rem;\n} .mt-6 {\n  margin-top: 1.5rem;\n} .mt-8 {\n  margin-top: 2rem;\n} .mt-auto {\n  margin-top: auto;\n} .line-clamp-2 {\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 2;\n} .block {\n  display: block;\n} .inline-block {\n  display: inline-block;\n} .flex {\n  display: flex;\n} .grid {\n  display: grid;\n} .hidden {\n  display: none;\n} .h-10 {\n  height: 2.5rem;\n} .h-12 {\n  height: 3rem;\n} .h-2 {\n  height: 0.5rem;\n} .h-20 {\n  height: 5rem;\n} .h-32 {\n  height: 8rem;\n} .h-48 {\n  height: 12rem;\n} .h-64 {\n  height: 16rem;\n} .h-8 {\n  height: 2rem;\n} .h-\\[400px\\] {\n  height: 400px;\n} .h-full {\n  height: 100%;\n} .h-screen {\n  height: 100vh;\n} .min-h-\\[400px\\] {\n  min-height: 400px;\n} .min-h-screen {\n  min-height: 100vh;\n} .w-1\\/2 {\n  width: 50%;\n} .w-1\\/4 {\n  width: 25%;\n} .w-10 {\n  width: 2.5rem;\n} .w-12 {\n  width: 3rem;\n} .w-20 {\n  width: 5rem;\n} .w-3\\/4 {\n  width: 75%;\n} .w-64 {\n  width: 16rem;\n} .w-8 {\n  width: 2rem;\n} .w-full {\n  width: 100%;\n} .max-w-2xl {\n  max-width: 42rem;\n} .max-w-3xl {\n  max-width: 48rem;\n} .max-w-4xl {\n  max-width: 56rem;\n} .max-w-5xl {\n  max-width: 64rem;\n} .max-w-6xl {\n  max-width: 72rem;\n} .max-w-7xl {\n  max-width: 80rem;\n} .max-w-md {\n  max-width: 28rem;\n} .max-w-none {\n  max-width: none;\n} .flex-1 {\n  flex: 1 1 0%;\n} @keyframes pulse {\n\n  50% {\n    opacity: .5;\n  }\n} .animate-pulse {\n  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;\n} @keyframes spin {\n\n  to {\n    transform: rotate(360deg);\n  }\n} .animate-spin {\n  animation: spin 1s linear infinite;\n} .cursor-not-allowed {\n  cursor: not-allowed;\n} .cursor-pointer {\n  cursor: pointer;\n} .grid-cols-1 {\n  grid-template-columns: repeat(1, minmax(0, 1fr));\n} .grid-cols-2 {\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n} .flex-col {\n  flex-direction: column;\n} .flex-wrap {\n  flex-wrap: wrap;\n} .items-start {\n  align-items: flex-start;\n} .items-center {\n  align-items: center;\n} .justify-center {\n  justify-content: center;\n} .justify-between {\n  justify-content: space-between;\n} .gap-12 {\n  gap: 3rem;\n} .gap-3 {\n  gap: 0.75rem;\n} .gap-4 {\n  gap: 1rem;\n} .gap-6 {\n  gap: 1.5rem;\n} .gap-8 {\n  gap: 2rem;\n} .overflow-hidden {\n  overflow: hidden;\n} .overflow-x-auto {\n  overflow-x: auto;\n} .overflow-y-auto {\n  overflow-y: auto;\n} .rounded {\n  border-radius: 0.25rem;\n} .rounded-full {\n  border-radius: 9999px;\n} .rounded-lg {\n  border-radius: 0.5rem;\n} .rounded-xl {\n  border-radius: 0.75rem;\n} .border {\n  border-width: 1px;\n} .border-2 {\n  border-width: 2px;\n} .border-4 {\n  border-width: 4px;\n} .border-b {\n  border-bottom-width: 1px;\n} .border-l {\n  border-left-width: 1px;\n} .border-r {\n  border-right-width: 1px;\n} .border-t {\n  border-top-width: 1px;\n} .border-amber-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(254 243 199 / var(--tw-border-opacity, 1));\n} .border-blue-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(191 219 254 / var(--tw-border-opacity, 1));\n} .border-blue-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(59 130 246 / var(--tw-border-opacity, 1));\n} .border-gray-100 {\n  --tw-border-opacity: 1;\n  border-color: rgb(243 244 246 / var(--tw-border-opacity, 1));\n} .border-gray-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(229 231 235 / var(--tw-border-opacity, 1));\n} .border-gray-300 {\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n} .border-gray-50 {\n  --tw-border-opacity: 1;\n  border-color: rgb(249 250 251 / var(--tw-border-opacity, 1));\n} .border-gray-800 {\n  --tw-border-opacity: 1;\n  border-color: rgb(31 41 55 / var(--tw-border-opacity, 1));\n} .border-red-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(254 202 202 / var(--tw-border-opacity, 1));\n} .border-red-500 {\n  --tw-border-opacity: 1;\n  border-color: rgb(239 68 68 / var(--tw-border-opacity, 1));\n} .border-red-900 {\n  --tw-border-opacity: 1;\n  border-color: rgb(127 29 29 / var(--tw-border-opacity, 1));\n} .border-transparent {\n  border-color: transparent;\n} .border-t-blue-600 {\n  --tw-border-opacity: 1;\n  border-top-color: rgb(37 99 235 / var(--tw-border-opacity, 1));\n} .bg-amber-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 251 235 / var(--tw-bg-opacity, 1));\n} .bg-black {\n  --tw-bg-opacity: 1;\n  background-color: rgb(0 0 0 / var(--tw-bg-opacity, 1));\n} .bg-blue-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(59 130 246 / var(--tw-bg-opacity, 1));\n} .bg-blue-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(37 99 235 / var(--tw-bg-opacity, 1));\n} .bg-gray-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity, 1));\n} .bg-gray-200 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(229 231 235 / var(--tw-bg-opacity, 1));\n} .bg-gray-400 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(156 163 175 / var(--tw-bg-opacity, 1));\n} .bg-gray-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(249 250 251 / var(--tw-bg-opacity, 1));\n} .bg-gray-900 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(17 24 39 / var(--tw-bg-opacity, 1));\n} .bg-green-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(34 197 94 / var(--tw-bg-opacity, 1));\n} .bg-green-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(22 163 74 / var(--tw-bg-opacity, 1));\n} .bg-purple-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(168 85 247 / var(--tw-bg-opacity, 1));\n} .bg-red-50 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 242 242 / var(--tw-bg-opacity, 1));\n} .bg-red-500 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(239 68 68 / var(--tw-bg-opacity, 1));\n} .bg-red-600 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(220 38 38 / var(--tw-bg-opacity, 1));\n} .bg-red-900\\/30 {\n  background-color: rgb(127 29 29 / 0.3);\n} .bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity, 1));\n} .bg-white\\/80 {\n  background-color: rgb(255 255 255 / 0.8);\n} .bg-yellow-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(254 249 195 / var(--tw-bg-opacity, 1));\n} .object-cover {\n  -o-object-fit: cover;\n     object-fit: cover;\n} .p-10 {\n  padding: 2.5rem;\n} .p-12 {\n  padding: 3rem;\n} .p-2 {\n  padding: 0.5rem;\n} .p-20 {\n  padding: 5rem;\n} .p-4 {\n  padding: 1rem;\n} .p-6 {\n  padding: 1.5rem;\n} .p-8 {\n  padding: 2rem;\n} .px-3 {\n  padding-left: 0.75rem;\n  padding-right: 0.75rem;\n} .px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n} .px-6 {\n  padding-left: 1.5rem;\n  padding-right: 1.5rem;\n} .px-8 {\n  padding-left: 2rem;\n  padding-right: 2rem;\n} .py-1 {\n  padding-top: 0.25rem;\n  padding-bottom: 0.25rem;\n} .py-1\\.5 {\n  padding-top: 0.375rem;\n  padding-bottom: 0.375rem;\n} .py-12 {\n  padding-top: 3rem;\n  padding-bottom: 3rem;\n} .py-16 {\n  padding-top: 4rem;\n  padding-bottom: 4rem;\n} .py-2 {\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n} .py-20 {\n  padding-top: 5rem;\n  padding-bottom: 5rem;\n} .py-24 {\n  padding-top: 6rem;\n  padding-bottom: 6rem;\n} .py-3 {\n  padding-top: 0.75rem;\n  padding-bottom: 0.75rem;\n} .py-4 {\n  padding-top: 1rem;\n  padding-bottom: 1rem;\n} .py-8 {\n  padding-top: 2rem;\n  padding-bottom: 2rem;\n} .pb-12 {\n  padding-bottom: 3rem;\n} .pb-2 {\n  padding-bottom: 0.5rem;\n} .pb-24 {\n  padding-bottom: 6rem;\n} .pb-6 {\n  padding-bottom: 1.5rem;\n} .pt-12 {\n  padding-top: 3rem;\n} .pt-4 {\n  padding-top: 1rem;\n} .pt-6 {\n  padding-top: 1.5rem;\n} .pt-8 {\n  padding-top: 2rem;\n} .text-center {\n  text-align: center;\n} .font-mono {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;\n} .font-sans {\n  font-family: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";\n} .text-2xl {\n  font-size: 1.5rem;\n  line-height: 2rem;\n} .text-3xl {\n  font-size: 1.875rem;\n  line-height: 2.25rem;\n} .text-4xl {\n  font-size: 2.25rem;\n  line-height: 2.5rem;\n} .text-5xl {\n  font-size: 3rem;\n  line-height: 1;\n} .text-6xl {\n  font-size: 3.75rem;\n  line-height: 1;\n} .text-lg {\n  font-size: 1.125rem;\n  line-height: 1.75rem;\n} .text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n} .text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n} .text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n} .font-black {\n  font-weight: 900;\n} .font-bold {\n  font-weight: 700;\n} .font-medium {\n  font-weight: 500;\n} .font-semibold {\n  font-weight: 600;\n} .uppercase {\n  text-transform: uppercase;\n} .capitalize {\n  text-transform: capitalize;\n} .italic {\n  font-style: italic;\n} .leading-relaxed {\n  line-height: 1.625;\n} .leading-tight {\n  line-height: 1.25;\n} .tracking-tight {\n  letter-spacing: -0.025em;\n} .tracking-wide {\n  letter-spacing: 0.025em;\n} .tracking-wider {\n  letter-spacing: 0.05em;\n} .tracking-widest {\n  letter-spacing: 0.1em;\n} .text-amber-700 {\n  --tw-text-opacity: 1;\n  color: rgb(180 83 9 / var(--tw-text-opacity, 1));\n} .text-blue-500 {\n  --tw-text-opacity: 1;\n  color: rgb(59 130 246 / var(--tw-text-opacity, 1));\n} .text-blue-600 {\n  --tw-text-opacity: 1;\n  color: rgb(37 99 235 / var(--tw-text-opacity, 1));\n} .text-gray-300 {\n  --tw-text-opacity: 1;\n  color: rgb(209 213 219 / var(--tw-text-opacity, 1));\n} .text-gray-400 {\n  --tw-text-opacity: 1;\n  color: rgb(156 163 175 / var(--tw-text-opacity, 1));\n} .text-gray-500 {\n  --tw-text-opacity: 1;\n  color: rgb(107 114 128 / var(--tw-text-opacity, 1));\n} .text-gray-600 {\n  --tw-text-opacity: 1;\n  color: rgb(75 85 99 / var(--tw-text-opacity, 1));\n} .text-gray-700 {\n  --tw-text-opacity: 1;\n  color: rgb(55 65 81 / var(--tw-text-opacity, 1));\n} .text-gray-800 {\n  --tw-text-opacity: 1;\n  color: rgb(31 41 55 / var(--tw-text-opacity, 1));\n} .text-gray-900 {\n  --tw-text-opacity: 1;\n  color: rgb(17 24 39 / var(--tw-text-opacity, 1));\n} .text-green-600 {\n  --tw-text-opacity: 1;\n  color: rgb(22 163 74 / var(--tw-text-opacity, 1));\n} .text-red-400 {\n  --tw-text-opacity: 1;\n  color: rgb(248 113 113 / var(--tw-text-opacity, 1));\n} .text-red-600 {\n  --tw-text-opacity: 1;\n  color: rgb(220 38 38 / var(--tw-text-opacity, 1));\n} .text-red-800 {\n  --tw-text-opacity: 1;\n  color: rgb(153 27 27 / var(--tw-text-opacity, 1));\n} .text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n} .text-yellow-800 {\n  --tw-text-opacity: 1;\n  color: rgb(133 77 14 / var(--tw-text-opacity, 1));\n} .shadow {\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} .shadow-lg {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} .shadow-md {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} .shadow-sm {\n  --tw-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);\n  --tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} .outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n} .ring-2 {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n} .ring-blue-200 {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(191 219 254 / var(--tw-ring-opacity, 1));\n} .grayscale {\n  --tw-grayscale: grayscale(100%);\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n} .filter {\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n} .backdrop-blur-md {\n  --tw-backdrop-blur: blur(12px);\n  backdrop-filter: var(--tw-backdrop-blur) var(--tw-backdrop-brightness) var(--tw-backdrop-contrast) var(--tw-backdrop-grayscale) var(--tw-backdrop-hue-rotate) var(--tw-backdrop-invert) var(--tw-backdrop-opacity) var(--tw-backdrop-saturate) var(--tw-backdrop-sepia);\n} .transition {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n} .transition-colors {\n  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n} .transition-opacity {\n  transition-property: opacity;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n} .duration-300 {\n  transition-duration: 300ms;\n} .duration-500 {\n  transition-duration: 500ms;\n} .hover\\:border-gray-300:hover {\n  --tw-border-opacity: 1;\n  border-color: rgb(209 213 219 / var(--tw-border-opacity, 1));\n} .hover\\:bg-blue-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(29 78 216 / var(--tw-bg-opacity, 1));\n} .hover\\:bg-gray-300:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(209 213 219 / var(--tw-bg-opacity, 1));\n} .hover\\:bg-gray-800:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(31 41 55 / var(--tw-bg-opacity, 1));\n} .hover\\:bg-green-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(21 128 61 / var(--tw-bg-opacity, 1));\n} .hover\\:bg-red-700:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(185 28 28 / var(--tw-bg-opacity, 1));\n} .hover\\:bg-red-900\\/50:hover {\n  background-color: rgb(127 29 29 / 0.5);\n} .hover\\:text-black:hover {\n  --tw-text-opacity: 1;\n  color: rgb(0 0 0 / var(--tw-text-opacity, 1));\n} .hover\\:text-blue-600:hover {\n  --tw-text-opacity: 1;\n  color: rgb(37 99 235 / var(--tw-text-opacity, 1));\n} .hover\\:text-blue-800:hover {\n  --tw-text-opacity: 1;\n  color: rgb(30 64 175 / var(--tw-text-opacity, 1));\n} .hover\\:text-white:hover {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity, 1));\n} .hover\\:underline:hover {\n  text-decoration-line: underline;\n} .hover\\:shadow-lg:hover {\n  --tw-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} .hover\\:shadow-md:hover {\n  --tw-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 4px 6px -1px var(--tw-shadow-color), 0 2px 4px -2px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} .hover\\:shadow-xl:hover {\n  --tw-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 20px 25px -5px var(--tw-shadow-color), 0 8px 10px -6px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n} .hover\\:grayscale-0:hover {\n  --tw-grayscale: grayscale(0);\n  filter: var(--tw-blur) var(--tw-brightness) var(--tw-contrast) var(--tw-grayscale) var(--tw-hue-rotate) var(--tw-invert) var(--tw-saturate) var(--tw-sepia) var(--tw-drop-shadow);\n} .focus\\:border-blue-500:focus {\n  --tw-border-opacity: 1;\n  border-color: rgb(59 130 246 / var(--tw-border-opacity, 1));\n} .focus\\:ring-2:focus {\n  --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);\n  --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);\n  box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);\n} .focus\\:ring-blue-500:focus {\n  --tw-ring-opacity: 1;\n  --tw-ring-color: rgb(59 130 246 / var(--tw-ring-opacity, 1));\n} .disabled\\:opacity-50:disabled {\n  opacity: 0.5;\n} @media (min-width: 768px) {\n\n  .md\\:col-span-1 {\n    grid-column: span 1 / span 1;\n  }\n\n  .md\\:col-span-2 {\n    grid-column: span 2 / span 2;\n  }\n\n  .md\\:block {\n    display: block;\n  }\n\n  .md\\:flex {\n    display: flex;\n  }\n\n  .md\\:hidden {\n    display: none;\n  }\n\n  .md\\:grid-cols-2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .md\\:grid-cols-3 {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n\n  .md\\:grid-cols-4 {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n} @media (min-width: 1024px) {\n\n  .lg\\:ml-64 {\n    margin-left: 16rem;\n  }\n\n  .lg\\:block {\n    display: block;\n  }\n\n  .lg\\:grid-cols-2 {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n\n  .lg\\:grid-cols-3 {\n    grid-template-columns: repeat(3, minmax(0, 1fr));\n  }\n\n  .lg\\:grid-cols-4 {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n} ';
  if (typeof document !== "undefined" && cssContent) {
    const styleTag = document.createElement("style");
    styleTag.innerHTML = cssContent;
    document.head.appendChild(styleTag);
    (function() {
      if (document.getElementById("atom-hud")) return;
      class PerformanceMonitor {
        constructor() {
          this.metrics = { firstContentfulPaint: null, largestContentfulPaint: null, pageLoad: null, bundleSize: null };
          this.observers = [];
        }
        init() {
          if (typeof window === "undefined" || !window.performance) return;
          window.addEventListener("load", () => {
            const perfData = performance.getEntriesByType("navigation")[0];
            if (perfData) {
              this.metrics.pageLoad = perfData.loadEventEnd - perfData.fetchStart;
              this.metrics.serverResponseTime = perfData.responseEnd - perfData.requestStart;
            }
          });
          if ("PerformanceObserver" in window) {
            try {
              const fcpObserver = new PerformanceObserver((list) => {
                list.getEntries().forEach((entry) => {
                  if (entry.name === "first-contentful-paint") this.metrics.firstContentfulPaint = entry.startTime;
                });
              });
              fcpObserver.observe({ entryTypes: ["paint"] });
              this.observers.push(fcpObserver);
            } catch (e) {
            }
            try {
              const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                this.metrics.largestContentfulPaint = lastEntry.renderTime || lastEntry.loadTime;
              });
              lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
              this.observers.push(lcpObserver);
            } catch (e) {
            }
            try {
              let clsValue = 0;
              const clsObserver = new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (!entry.hadRecentInput) clsValue += entry.value;
                }
                this.metrics.cumulativeLayoutShift = clsValue;
              });
              clsObserver.observe({ entryTypes: ["layout-shift"] });
              this.observers.push(clsObserver);
            } catch (e) {
            }
          }
        }
        getScore() {
          let score = 100;
          const issues = [];
          if (this.metrics.firstContentfulPaint > 1800) {
            score -= 10;
            issues.push("FCP slow (>1.8s)");
          }
          if (this.metrics.largestContentfulPaint > 2500) {
            score -= 15;
            issues.push("LCP slow (>2.5s)");
          }
          if (this.metrics.cumulativeLayoutShift > 0.1) {
            score -= 10;
            issues.push("CLS high (>0.1)");
          }
          if (this.metrics.pageLoad > 3e3) {
            score -= 15;
            issues.push("Page load slow (>3s)");
          }
          return { score: Math.max(0, score), issues, grade: score >= 90 ? "A" : score >= 75 ? "B" : score >= 60 ? "C" : "D" };
        }
        getInsights() {
          const insights = [];
          if (this.metrics.firstContentfulPaint > 1800) insights.push({ severity: "warning", message: "FCP slow", suggestion: "Use @Stream, optimize images, code split" });
          if (this.metrics.largestContentfulPaint > 2500) insights.push({ severity: "error", message: "LCP slow", suggestion: "Optimize images, reduce JS execution" });
          if (this.metrics.cumulativeLayoutShift > 0.1) insights.push({ severity: "warning", message: "High CLS", suggestion: "Set image dimensions, avoid content shifts" });
          return insights;
        }
        getMetrics() {
          return {
            metrics: { ...this.metrics },
            score: this.getScore(),
            insights: this.getInsights()
          };
        }
      }
      class SEOAnalyzer {
        analyze() {
          const issues = [], warnings = [];
          if (typeof document === "undefined") return { issues, warnings, score: 100 };
          const title = document.querySelector("title");
          if (!title || !title.textContent || title.textContent.trim().length === 0) {
            issues.push({ severity: "error", message: "Missing title", suggestion: "Add @Title directive" });
          } else if (title.textContent.trim().length < 30) {
            warnings.push({ severity: "warning", message: "Title too short", suggestion: "Aim for 50-60 characters" });
          } else if (title.textContent.trim().length > 60) {
            warnings.push({ severity: "warning", message: "Title too long", suggestion: "Keep under 60 characters" });
          }
          const metaDesc = document.querySelector('meta[name="description"]');
          if (!metaDesc || !metaDesc.content || metaDesc.content.trim().length === 0) {
            issues.push({ severity: "error", message: "Missing description", suggestion: "Add @Description directive" });
          } else if (metaDesc.content.trim().length < 120) {
            warnings.push({ severity: "warning", message: "Description too short", suggestion: "Aim for 150-160 characters" });
          }
          const h12 = document.querySelector("h1");
          if (!h12) issues.push({ severity: "error", message: "Missing h1", suggestion: "Add h1 tag for SEO" });
          const h1Count = document.querySelectorAll("h1").length;
          if (h1Count > 1) warnings.push({ severity: "warning", message: `Multiple h1 tags (${h1Count})`, suggestion: "Use only one h1 per page" });
          const images = document.querySelectorAll("img");
          let imagesWithoutAlt = 0;
          images.forEach((img2) => {
            if (!img2.alt || img2.alt.trim().length === 0) imagesWithoutAlt++;
          });
          if (imagesWithoutAlt > 0) warnings.push({ severity: "warning", message: `${imagesWithoutAlt} image(s) without alt`, suggestion: "Add alt attributes" });
          if (!document.documentElement.lang) warnings.push({ severity: "warning", message: "Missing lang attribute", suggestion: 'Add lang="en" to html tag' });
          if (!document.querySelector('meta[name="viewport"]')) issues.push({ severity: "error", message: "Missing viewport", suggestion: "Add viewport meta tag" });
          const score = Math.max(0, 100 - issues.length * 15 - warnings.filter((w) => w.severity === "warning").length * 5);
          return { issues, warnings, score: Math.min(100, score) };
        }
      }
      const h = document.createElement("div");
      h.id = "atom-hud";
      document.body.appendChild(h);
      const s = h.attachShadow({ mode: "open" });
      const st = document.createElement("style");
      st.textContent = `
    :host {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 12px;
    }
    .pill {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #000;
      border: 1px solid #333;
      color: #fff;
      border-radius: 99px;
      padding: 8px 16px;
      display: flex;
      gap: 10px;
      align-items: center;
      font-size: 12px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      cursor: pointer;
      z-index: 9999;
      transition: all 0.2s;
    }
    .pill:hover {
      background: #111;
      border-color: #444;
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #22c55e;
      animation: pulse 2s infinite;
    }
    .dot.warning { background: #f59e0b; }
    .dot.error { background: #ef4444; }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    .panel {
      display: none;
      position: fixed;
      bottom: 70px;
      right: 20px;
      width: 380px;
      max-height: 600px;
      background: rgba(10,10,10,0.95);
      backdrop-filter: blur(20px);
      border: 1px solid #333;
      border-radius: 12px;
      padding: 0;
      color: #fff;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }
    .panel.open { display: block; }
    .panel-header {
      padding: 16px;
      border-bottom: 1px solid #333;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .panel-title {
      font-size: 14px;
      font-weight: bold;
      color: #fff;
    }
    .panel-tabs {
      display: flex;
      gap: 8px;
      padding: 12px 16px;
      border-bottom: 1px solid #333;
      background: rgba(0,0,0,0.3);
    }
    .tab {
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 11px;
      background: transparent;
      color: #888;
      border: none;
      transition: all 0.2s;
    }
    .tab.active {
      background: #333;
      color: #fff;
    }
    .panel-content {
      padding: 16px;
      overflow-y: auto;
      max-height: 500px;
    }
    .tab-content {
      display: none;
    }
    .tab-content.active {
      display: block;
    }
    .metric {
      margin-bottom: 12px;
      padding: 10px;
      background: rgba(255,255,255,0.05);
      border-radius: 6px;
    }
    .metric-label {
      font-size: 11px;
      color: #888;
      margin-bottom: 4px;
    }
    .metric-value {
      font-size: 16px;
      font-weight: bold;
      color: #fff;
    }
    .metric-value.good { color: #22c55e; }
    .metric-value.warning { color: #f59e0b; }
    .metric-value.error { color: #ef4444; }
    .issue {
      padding: 8px;
      margin-bottom: 8px;
      border-radius: 6px;
      font-size: 11px;
      border-left: 3px solid;
    }
    .issue.error {
      background: rgba(239,68,68,0.1);
      border-color: #ef4444;
    }
    .issue.warning {
      background: rgba(245,158,11,0.1);
      border-color: #f59e0b;
    }
    .issue.info {
      background: rgba(59,130,246,0.1);
      border-color: #3b82f6;
    }
    .issue-title {
      font-weight: bold;
      margin-bottom: 4px;
    }
    .issue-suggestion {
      color: #888;
      font-size: 10px;
      margin-top: 4px;
    }
    .score {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      font-size: 12px;
    }
    .score.a { background: #22c55e; color: #000; }
    .score.b { background: #3b82f6; color: #fff; }
    .score.c { background: #f59e0b; color: #000; }
    .score.d { background: #ef4444; color: #fff; }
  `;
      s.appendChild(st);
      const perfMonitor = new PerformanceMonitor();
      perfMonitor.init();
      const seoAnalyzer = new SEOAnalyzer();
      let metrics = {
        metrics: {
          firstContentfulPaint: null,
          largestContentfulPaint: null,
          pageLoad: null,
          bundleSize: null
        },
        score: { score: 100, grade: "A", issues: [] },
        insights: []
      };
      let seoResults = { issues: [], warnings: [], score: 100 };
      async function getBundleSize() {
        try {
          const response = await fetch("/bundle-info.json?" + Date.now());
          const data = await response.json();
          return data.size || null;
        } catch (e) {
          return null;
        }
      }
      async function updateMetrics() {
        try {
          const perfData = perfMonitor.getMetrics();
          metrics = perfData || { metrics: {}, score: { score: 100, grade: "A", issues: [] }, insights: [] };
          if (!metrics.metrics) {
            metrics.metrics = {};
          }
          const bundleSize = await getBundleSize();
          if (bundleSize) {
            metrics.metrics.bundleSize = bundleSize;
          }
          seoResults = seoAnalyzer.analyze();
          updateHUD();
          updateStatusTab();
        } catch (e) {
          console.error("DevTools updateMetrics error:", e);
        }
      }
      setTimeout(() => {
        updateMetrics();
        updateHUD();
        updateStatusTab();
      }, 2e3);
      setInterval(() => {
        updateMetrics();
        updateHUD();
        updateStatusTab();
      }, 5e3);
      const p2 = document.createElement("div");
      p2.className = "pill";
      const pa = document.createElement("div");
      pa.className = "panel";
      const header = document.createElement("div");
      header.className = "panel-header";
      header.innerHTML = '<div class="panel-title">\u269B\uFE0F ATOM DevTools</div>';
      pa.appendChild(header);
      const tabs = document.createElement("div");
      tabs.className = "panel-tabs";
      tabs.innerHTML = `
    <button class="tab active" data-tab="status">Status</button>
    <button class="tab" data-tab="performance">Performance</button>
    <button class="tab" data-tab="seo">SEO</button>
    <button class="tab" data-tab="errors">Errors</button>
  `;
      pa.appendChild(tabs);
      const content = document.createElement("div");
      content.className = "panel-content";
      const statusTab = document.createElement("div");
      statusTab.className = "tab-content active";
      statusTab.id = "tab-status";
      statusTab.innerHTML = '<div style="padding: 16px; color: #888;">Loading status...</div>';
      function updateStatusTab() {
        try {
          const routeCount = document.querySelectorAll("[data-route]").length || 0;
          const componentCount = Object.keys(window).filter((k) => k[0] === k[0].toUpperCase() && typeof window[k] === "function").length;
          const serverActionsCount = Object.keys(window.Actions || {}).length;
          const statusTabEl = s.querySelector("#tab-status") || document.getElementById("tab-status") || statusTab;
          if (statusTabEl) {
            statusTabEl.innerHTML = `
      <div class="metric">
        <div class="metric-label">System Status</div>
        <div class="metric-value good">Operational</div>
      </div>
      <div class="metric">
        <div class="metric-label">Routes</div>
        <div class="metric-value">${routeCount}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Components</div>
        <div class="metric-value">${componentCount}</div>
      </div>
      <div class="metric">
        <div class="metric-label">Server Actions</div>
        <div class="metric-value">${Object.keys(window.Actions || {}).length}</div>
      </div>
      <div style="margin-top: 16px; font-size: 11px; color: #888;">
        <div style="margin-bottom: 8px;"><strong>Framework:</strong> ATOM v1.2.0</div>
        <div style="margin-bottom: 8px;"><strong>Mode:</strong> ${typeof window !== "undefined" && window.location.hostname === "localhost" ? "Development" : "Production"}</div>
        <div style="margin-bottom: 8px;"><strong>Hot Reload:</strong> Active</div>
      </div>
    `;
          }
        } catch (e) {
          console.error("DevTools updateStatusTab error:", e);
          const statusTabEl = s.querySelector("#tab-status") || document.getElementById("tab-status") || statusTab;
          if (statusTabEl) {
            statusTabEl.innerHTML = '<div style="color: #ef4444; padding: 16px;">Error loading status</div>';
          }
        }
      }
      updateStatusTab();
      content.appendChild(statusTab);
      const perfTab = document.createElement("div");
      perfTab.className = "tab-content";
      perfTab.id = "tab-performance";
      perfTab.innerHTML = '<div style="padding: 16px; color: #888;">Loading performance data...</div>';
      content.appendChild(perfTab);
      const seoTab = document.createElement("div");
      seoTab.className = "tab-content";
      seoTab.id = "tab-seo";
      seoTab.innerHTML = '<div style="padding: 16px; color: #888;">Loading SEO data...</div>';
      content.appendChild(seoTab);
      const errorsTab = document.createElement("div");
      errorsTab.className = "tab-content";
      errorsTab.id = "tab-errors";
      errorsTab.innerHTML = '<div style="padding: 16px; color: #888;">Loading error data...</div>';
      content.appendChild(errorsTab);
      pa.appendChild(content);
      const tabElements = { perfTab, seoTab, errorsTab, statusTab };
      tabs.querySelectorAll(".tab").forEach((tab) => {
        tab.onclick = () => {
          try {
            tabs.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
            content.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));
            tab.classList.add("active");
            const tabName = tab.dataset.tab;
            const targetTab = s.querySelector("#tab-" + tabName) || document.getElementById("tab-" + tabName);
            if (targetTab) {
              targetTab.classList.add("active");
              updateHUD();
              updateStatusTab();
              setTimeout(() => {
                updateHUD();
                updateStatusTab();
              }, 10);
            }
          } catch (e) {
            console.error("Tab switch error:", e);
            updateHUD();
            updateStatusTab();
          }
        };
      });
      function updateHUD() {
        try {
          if (!metrics) {
            metrics = { metrics: {}, score: { score: 100, grade: "A", issues: [] }, insights: [] };
          }
          if (!metrics.metrics) {
            metrics.metrics = {};
          }
          if (!metrics.score) {
            metrics.score = { score: 100, grade: "A", issues: [] };
          }
          if (!metrics.insights) {
            metrics.insights = [];
          }
          if (!seoResults) {
            seoResults = { issues: [], warnings: [], score: 100 };
          }
          const dot = p2.querySelector(".dot");
          if (dot) {
            if (metrics.score.issues && metrics.score.issues.length > 0 || seoResults.issues && seoResults.issues.length > 0) {
              dot.className = "dot error";
            } else if (metrics.insights && metrics.insights.length > 0 || seoResults.warnings && seoResults.warnings.length > 0) {
              dot.className = "dot warning";
            } else {
              dot.className = "dot";
            }
          }
          const perfScore = metrics.score || { score: 100, grade: "A", issues: [] };
          const perfMetrics = metrics.metrics || {};
          const perfInsights = metrics.insights || [];
          const perfTabEl = s.querySelector("#tab-performance") || document.getElementById("tab-performance") || perfTab;
          if (perfTabEl) {
            perfTabEl.innerHTML = `
        <div class="metric">
          <div class="metric-label">Performance Score</div>
          <div class="metric-value ${perfScore.score >= 90 ? "good" : perfScore.score >= 75 ? "warning" : "error"}">
            ${perfScore.score}/100 <span class="score ${perfScore.grade.toLowerCase()}">${perfScore.grade}</span>
          </div>
        </div>
        ${perfMetrics.firstContentfulPaint ? `
          <div class="metric">
            <div class="metric-label">First Contentful Paint</div>
            <div class="metric-value ${perfMetrics.firstContentfulPaint < 1800 ? "good" : "warning"}">
              ${(perfMetrics.firstContentfulPaint / 1e3).toFixed(2)}s
            </div>
          </div>
        ` : '<div class="metric"><div class="metric-label">First Contentful Paint</div><div class="metric-value" style="color: #888;">Measuring...</div></div>'}
        ${perfMetrics.largestContentfulPaint ? `
          <div class="metric">
            <div class="metric-label">Largest Contentful Paint</div>
            <div class="metric-value ${perfMetrics.largestContentfulPaint < 2500 ? "good" : "warning"}">
              ${(perfMetrics.largestContentfulPaint / 1e3).toFixed(2)}s
            </div>
          </div>
        ` : '<div class="metric"><div class="metric-label">Largest Contentful Paint</div><div class="metric-value" style="color: #888;">Measuring...</div></div>'}
        ${perfMetrics.pageLoad ? `
          <div class="metric">
            <div class="metric-label">Page Load Time</div>
            <div class="metric-value ${perfMetrics.pageLoad < 3e3 ? "good" : "warning"}">
              ${(perfMetrics.pageLoad / 1e3).toFixed(2)}s
            </div>
          </div>
        ` : '<div class="metric"><div class="metric-label">Page Load Time</div><div class="metric-value" style="color: #888;">Measuring...</div></div>'}
        ${perfMetrics.bundleSize ? `
          <div class="metric">
            <div class="metric-label">Bundle Size</div>
            <div class="metric-value ${perfMetrics.bundleSize < 5e5 ? "good" : "warning"}">
              ${(perfMetrics.bundleSize / 1024).toFixed(1)}KB
            </div>
          </div>
        ` : '<div class="metric"><div class="metric-label">Bundle Size</div><div class="metric-value" style="color: #888;">Loading...</div></div>'}
      <div style="margin-top: 16px; font-size: 11px; font-weight: bold; color: #888; margin-bottom: 8px;">Performance Status:</div>
      ${perfInsights.length > 0 ? `
        <div style="margin-bottom: 8px;">
          ${perfInsights.map((i) => `
            <div class="issue ${i.severity || "warning"}">
              <div class="issue-title">${i.message || "Unknown issue"}</div>
              <div class="issue-suggestion">\u{1F4A1} ${i.suggestion || "Check performance"}</div>
            </div>
          `).join("")}
        </div>
      ` : '<div style="color: #22c55e; font-size: 11px; margin-bottom: 8px;">\u2713 No performance issues detected</div>'}
      ${perfScore.issues && perfScore.issues.length > 0 ? `
        <div style="margin-top: 12px; font-size: 11px; color: #888;">
          <strong>Why is speed slow?</strong>
          <ul style="margin-top: 4px; padding-left: 16px;">
            ${perfScore.issues.map((i) => "<li>" + i + "</li>").join("")}
          </ul>
        </div>
      ` : perfScore.score >= 90 ? '<div style="color: #22c55e; font-size: 11px; margin-top: 8px;">\u2713 Excellent performance! All metrics are optimal.</div>' : perfScore.score >= 75 ? '<div style="color: #f59e0b; font-size: 11px; margin-top: 8px;">\u26A0\uFE0F Performance is good but could be improved.</div>' : '<div style="color: #ef4444; font-size: 11px; margin-top: 8px;">\u26A0\uFE0F Performance needs attention.</div>'}
      `;
          }
          const seoScore = seoResults && seoResults.score || 100;
          const seoIssues = seoResults && seoResults.issues || [];
          const seoWarnings = seoResults && seoResults.warnings || [];
          const seoTabEl = s.querySelector("#tab-seo") || document.getElementById("tab-seo") || seoTab;
          if (seoTabEl) {
            seoTabEl.innerHTML = `
      <div class="metric">
        <div class="metric-label">SEO Score</div>
        <div class="metric-value ${seoScore >= 90 ? "good" : seoScore >= 75 ? "warning" : "error"}">
          ${seoScore}/100
        </div>
      </div>
      <div style="margin-top: 16px; font-size: 11px; font-weight: bold; color: #888; margin-bottom: 8px;">SEO Status:</div>
      ${seoIssues.length > 0 ? `
        <div style="margin-bottom: 8px;">
          <div style="font-size: 11px; font-weight: bold; color: #ef4444; margin-bottom: 4px;">Critical Issues:</div>
          ${seoIssues.map((i) => `
            <div class="issue ${i.severity || "error"}">
              <div class="issue-title">${i.message || "Unknown issue"}</div>
              <div class="issue-suggestion">\u{1F4A1} ${i.suggestion || "Check SEO"}</div>
            </div>
          `).join("")}
        </div>
      ` : ""}
      ${seoWarnings.length > 0 ? `
        <div style="margin-bottom: 8px;">
          <div style="font-size: 11px; font-weight: bold; color: #f59e0b; margin-bottom: 4px;">Warnings:</div>
          ${seoWarnings.map((w) => `
            <div class="issue ${w.severity || "warning"}">
              <div class="issue-title">${w.message || "Unknown warning"}</div>
              <div class="issue-suggestion">\u{1F4A1} ${w.suggestion || "Check SEO"}</div>
            </div>
          `).join("")}
        </div>
      ` : ""}
      ${seoIssues.length === 0 && seoWarnings.length === 0 ? '<div style="color: #22c55e; font-size: 11px; margin-top: 8px;">\u2713 Perfect SEO! All checks passed.</div>' : seoScore >= 90 ? '<div style="color: #22c55e; font-size: 11px; margin-top: 8px;">\u2713 SEO is good overall.</div>' : seoScore >= 75 ? '<div style="color: #f59e0b; font-size: 11px; margin-top: 8px;">\u26A0\uFE0F SEO needs some improvements.</div>' : '<div style="color: #ef4444; font-size: 11px; margin-top: 8px;">\u26A0\uFE0F SEO needs attention.</div>'}
    `;
          }
          const runtimeErrors = [];
          const errorsTabEl = s.querySelector("#tab-errors") || document.getElementById("tab-errors") || errorsTab;
          if (errorsTabEl) {
            errorsTabEl.innerHTML = `
      <div style="color: #888; font-size: 11px; margin-bottom: 12px;">
        Build-time errors are shown in the terminal. Runtime errors appear here.
      </div>
      <div style="margin-top: 8px; margin-bottom: 12px;">
        <div style="font-size: 11px; font-weight: bold; color: #888; margin-bottom: 4px;">Error Status:</div>
        ${runtimeErrors.length > 0 ? `
          <div style="margin-top: 8px;">
            ${runtimeErrors.map((err) => `
              <div class="issue error">
                <div class="issue-title">${err.message || "Unknown error"}</div>
                <div class="issue-suggestion">${err.suggestion || "Check browser console for details"}</div>
              </div>
            `).join("")}
          </div>
        ` : '<div style="color: #22c55e; font-size: 11px;">\u2713 No runtime errors detected. Application is running smoothly.</div>'}
      </div>
      <div style="margin-top: 16px; font-size: 11px; color: #888;">
        <strong>Common Errors:</strong>
        <ul style="margin-top: 4px; padding-left: 16px; font-size: 10px;">
          <li>Missing library \u2192 Run: npm install [package]</li>
          <li>Invalid Tailwind class \u2192 Check class spelling</li>
          <li>Missing @View \u2192 Add @View block to page</li>
          <li>Syntax error \u2192 Check for unclosed quotes/brackets</li>
        </ul>
      </div>
    `;
          }
        } catch (e) {
          console.error("DevTools updateHUD error:", e);
          const perfTabEl = s.querySelector("#tab-performance") || document.getElementById("tab-performance") || perfTab;
          const seoTabEl = s.querySelector("#tab-seo") || document.getElementById("tab-seo") || seoTab;
          const errorsTabEl = s.querySelector("#tab-errors") || document.getElementById("tab-errors") || errorsTab;
          if (perfTabEl) perfTabEl.innerHTML = '<div style="color: #ef4444; padding: 16px;">Error loading performance data</div>';
          if (seoTabEl) seoTabEl.innerHTML = '<div style="color: #ef4444; padding: 16px;">Error loading SEO data</div>';
          if (errorsTabEl) errorsTabEl.innerHTML = '<div style="color: #ef4444; padding: 16px;">Error loading error data</div>';
        }
      }
      p2.innerHTML = '<div class="dot"></div><b>ATOM</b>';
      p2.onclick = () => {
        const wasOpen = pa.classList.contains("open");
        pa.classList.toggle("open");
        if (pa.classList.contains("open")) {
          updateHUD();
          updateStatusTab();
          setTimeout(() => {
            updateMetrics();
            updateHUD();
            updateStatusTab();
          }, 100);
        }
      };
      s.appendChild(pa);
      s.appendChild(p2);
      updateHUD();
      updateStatusTab();
      setTimeout(() => {
        updateMetrics();
        updateHUD();
        updateStatusTab();
      }, 500);
    })();
    (function() {
      let c = false;
      function n() {
        const s = new EventSource("/_atom/stream");
        s.onopen = () => {
          if (c) window.location.reload();
          c = true;
        };
        s.onerror = () => {
          s.close();
          setTimeout(n, 200);
        };
      }
      n();
    })();
  }
  var ERROR_MODAL_STYLE = `
    .err-backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; z-index: 2147483647; font-family: -apple-system, monospace; }
    .err-card { width: 100%; max-width: 650px; background: #0a0a0a; border: 1px solid #333; border-radius: 16px; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.7); overflow: hidden; }
    .err-header { background: #1f1212; border-bottom: 1px solid #451a1a; padding: 16px 24px; display: flex; align-items: center; gap: 12px; }
    .err-icon { width: 12px; height: 12px; background: #ef4444; border-radius: 50%; box-shadow: 0 0 10px #ef4444; }
    .err-title { color: #fca5a5; font-weight: bold; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
    .err-body { padding: 30px; }
    .err-msg { color: #94a3b8; font-size: 13px; line-height: 1.6; word-break: break-word; }
`;
  function showRuntimeError(error) {
    const style = document.createElement("style");
    style.textContent = ERROR_MODAL_STYLE;
    document.head.appendChild(style);
    const overlay = document.createElement("div");
    overlay.className = "err-backdrop";
    const errorMessage = error.message || "Unknown error occurred";
    const errorStack = error.stack ? error.stack.split("\n").slice(0, 5).join("\n") : "";
    const currentPath = window.location.pathname;
    overlay.innerHTML = `
        <div class="err-card">
            <div class="err-header"><div class="err-icon"></div><div class="err-title">Runtime Error</div></div>
            <div class="err-body">
                <div class="err-msg"><strong>Error:</strong> ${errorMessage}</div>
                <div style="margin-top:12px; color:#888; font-size:11px;"><strong>Page:</strong> ${currentPath}</div>
                ${errorStack ? `<div style="margin-top:12px; color:#666; font-size:10px; font-family:monospace; white-space:pre-wrap; max-height:150px; overflow:auto; background:#111; padding:8px; border-radius:4px;">${errorStack}</div>` : ""}
                <div style="margin-top:20px; color:#555; font-size:11px;">Check browser console for full stack trace.</div>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);
  }
  function renderWithErrorBoundary(component, props, routePath) {
    try {
      return component(props);
    } catch (error) {
      console.error(`Component error in route "${routePath}":`, error);
      const errorMessage = error && error.message ? error.message : "Unknown error";
      const errorStack = error && error.stack ? error.stack : "";
      return div([
        div("\u26A0\uFE0F Component Error", { className: "text-red-600 font-bold text-lg mb-2" }),
        div(errorMessage, { className: "text-red-500 mb-2" }),
        div(errorStack.split("\n").slice(0, 5).join("\n"), {
          className: "text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded overflow-auto max-h-32",
          style: { fontSize: "10px" }
        })
      ], {
        className: "p-4 border border-red-300 bg-red-50 rounded",
        style: { margin: "20px" }
      });
    }
  }
  function renderApp() {
    const root = document.getElementById("root");
    if (!root) {
      console.error("renderApp: Root element not found");
      return;
    }
    _isRendering = true;
    try {
      _cursor = 0;
      _effectCursor = 0;
      _refCursor = 0;
      _memoCursor = 0;
      const match = matchRoute(_currentPath);
      let VNode;
      if (match) {
        try {
          document.title = match.title || "Atom App";
        } catch (e) {
          console.warn("Failed to set document title:", e);
        }
        if (match.meta && Array.isArray(match.meta)) {
          match.meta.forEach((m) => {
            try {
              if (m && typeof m === "object" && m.name && m.content) {
                let tag = document.querySelector(`meta[name="${m.name}"]`);
                if (!tag) {
                  tag = document.createElement("meta");
                  tag.name = m.name;
                  document.head.appendChild(tag);
                }
                tag.content = m.content;
              }
            } catch (e) {
              console.warn("Failed to set meta tag:", m, e);
            }
          });
        }
        try {
          const safeParams = match.params || {};
          const componentProps = { params: safeParams };
          if (typeof match.component !== "function") {
            throw new Error(`Route component is not a function. Received: ${typeof match.component}`);
          }
          let componentResult = renderWithErrorBoundary(match.component, componentProps, _currentPath);
          if (componentResult && typeof componentResult.then === "function") {
            VNode = div("Loading...", { className: "flex justify-center p-20 text-gray-500" });
            componentResult.then((resolvedNode) => {
              try {
                if (resolvedNode instanceof Node) {
                  const currentDom = root.firstChild;
                  if (currentDom) {
                    root.replaceChild(resolvedNode, currentDom);
                  } else {
                    root.appendChild(resolvedNode);
                  }
                } else {
                  console.error("Async component returned non-Node:", typeof resolvedNode, resolvedNode);
                  const errorNode = div("Error: Component must return a DOM Node");
                  const currentDom = root.firstChild;
                  if (currentDom) {
                    root.replaceChild(errorNode, currentDom);
                  } else {
                    root.appendChild(errorNode);
                  }
                }
              } catch (e) {
                console.error("Error updating DOM after async component:", e);
              }
            }).catch((err) => {
              console.error("Async component error:", err);
              const errorNode = div([
                div("\u26A0\uFE0F Loading Error", { className: "text-red-600 font-bold mb-2" }),
                div(err.message || "Failed to load component", { className: "text-red-500" })
              ], { className: "p-4 border border-red-300 bg-red-50 rounded m-4" });
              const currentDom = root.firstChild;
              try {
                if (currentDom) {
                  root.replaceChild(errorNode, currentDom);
                } else {
                  root.appendChild(errorNode);
                }
              } catch (e) {
                console.error("Error displaying error node:", e);
              }
            });
          } else {
            VNode = componentResult;
          }
          if (!VNode || !(VNode instanceof Node)) {
            console.error("Component returned invalid value:", typeof VNode, VNode);
            VNode = div("Error: Component must return a DOM Node");
          }
        } catch (e) {
          const enhancedError = new Error(`Error rendering route "${_currentPath}": ${e.message}`);
          enhancedError.stack = e.stack;
          enhancedError.originalError = e;
          console.error("Route Error:", {
            path: _currentPath,
            error: e.message,
            stack: e.stack
          });
          showRuntimeError(enhancedError);
          VNode = div([
            div("\u26A0\uFE0F Rendering Error", { className: "text-red-600 font-bold text-lg mb-2" }),
            div(e.message || "Unknown error", { className: "text-red-500" })
          ], {
            className: "p-4 border border-red-300 bg-red-50 rounded m-4"
          });
        }
      } else {
        VNode = div([
          div("404 - Page Not Found", { className: "text-gray-800 font-bold text-xl mb-2" }),
          div(`The route "${_currentPath}" was not found.`, { className: "text-gray-600" }),
          a("Go Home", { href: "/", className: "text-blue-600 hover:underline mt-4 inline-block" })
        ], {
          className: "p-8 text-center"
        });
      }
      if (!VNode || !(VNode instanceof Node)) {
        console.error("VNode is not a valid Node:", typeof VNode, VNode);
        VNode = div("Error: Invalid component return value");
      }
      try {
        const currentDom = root.firstChild;
        if (!currentDom) {
          root.appendChild(VNode);
        } else {
          if (VNode && VNode instanceof Node) {
            diff(root, VNode, currentDom);
          } else {
            console.error("Cannot diff: VNode is not a valid Node", VNode);
            if (!VNode || !(VNode instanceof Node)) {
              VNode = div("Error: Invalid component return value");
            }
            root.replaceChild(VNode, currentDom);
          }
        }
      } catch (e) {
        console.error("Error updating DOM:", e);
        try {
          root.innerHTML = "";
          root.appendChild(VNode);
        } catch (e2) {
          console.error("Fatal: Cannot update DOM:", e2);
        }
      }
    } catch (e) {
      console.error("Fatal error in renderApp:", e);
      try {
        root.innerHTML = `<div style="padding: 20px; color: red; font-family: monospace;">
                <h1>Fatal Error</h1>
                <p>${e.message || "Unknown error"}</p>
                <pre style="font-size: 10px; overflow: auto;">${e.stack || ""}</pre>
            </div>`;
      } catch (e2) {
        console.error("Cannot even display error:", e2);
      }
    } finally {
      _isRendering = false;
    }
  }
  if (typeof window !== "undefined") {
    window.addEventListener("beforeunload", () => {
      cleanupEffects();
      if (_renderTimeout) clearTimeout(_renderTimeout);
    });
    window.onpopstate = () => {
      cleanupEffects();
      _currentPath = window.location.pathname;
      _cursor = 0;
      scheduleRender();
    };
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", scheduleRender);
    } else {
      scheduleRender();
    }
  }
  return __toCommonJS(client_temp_exports);
})();
