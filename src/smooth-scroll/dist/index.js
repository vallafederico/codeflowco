(() => {
  // node_modules/.pnpm/@studio-freight+lenis@1.0.27/node_modules/@studio-freight/lenis/dist/lenis.modern.mjs
  function t() {
    return t = Object.assign ? Object.assign.bind() : function(t2) {
      for (var i2 = 1; i2 < arguments.length; i2++) {
        var e2 = arguments[i2];
        for (var s2 in e2)
          Object.prototype.hasOwnProperty.call(e2, s2) && (t2[s2] = e2[s2]);
      }
      return t2;
    }, t.apply(this, arguments);
  }
  function i(t2, i2, e2) {
    return Math.max(t2, Math.min(i2, e2));
  }
  var e = class {
    advance(t2) {
      var e2;
      if (!this.isRunning)
        return;
      let s2 = false;
      if (this.lerp)
        this.value = (o2 = this.value, n2 = this.to, (1 - (r2 = 1 - Math.exp(-60 * this.lerp * t2))) * o2 + r2 * n2), Math.round(this.value) === this.to && (this.value = this.to, s2 = true);
      else {
        this.currentTime += t2;
        const e3 = i(0, this.currentTime / this.duration, 1);
        s2 = e3 >= 1;
        const o3 = s2 ? 1 : this.easing(e3);
        this.value = this.from + (this.to - this.from) * o3;
      }
      var o2, n2, r2;
      null == (e2 = this.onUpdate) || e2.call(this, this.value, s2), s2 && this.stop();
    }
    stop() {
      this.isRunning = false;
    }
    fromTo(t2, i2, { lerp: e2 = 0.1, duration: s2 = 1, easing: o2 = (t3) => t3, onStart: n2, onUpdate: r2 }) {
      this.from = this.value = t2, this.to = i2, this.lerp = e2, this.duration = s2, this.easing = o2, this.currentTime = 0, this.isRunning = true, null == n2 || n2(), this.onUpdate = r2;
    }
  };
  var s = class {
    constructor({ wrapper: t2, content: i2, autoResize: e2 = true } = {}) {
      if (this.resize = () => {
        this.onWrapperResize(), this.onContentResize();
      }, this.onWrapperResize = () => {
        this.wrapper === window ? (this.width = window.innerWidth, this.height = window.innerHeight) : (this.width = this.wrapper.clientWidth, this.height = this.wrapper.clientHeight);
      }, this.onContentResize = () => {
        this.scrollHeight = this.content.scrollHeight, this.scrollWidth = this.content.scrollWidth;
      }, this.wrapper = t2, this.content = i2, e2) {
        const t3 = function(t4, i3) {
          let e3;
          return function() {
            let i4 = arguments, s2 = this;
            clearTimeout(e3), e3 = setTimeout(function() {
              t4.apply(s2, i4);
            }, 250);
          };
        }(this.resize);
        this.wrapper !== window && (this.wrapperResizeObserver = new ResizeObserver(t3), this.wrapperResizeObserver.observe(this.wrapper)), this.contentResizeObserver = new ResizeObserver(t3), this.contentResizeObserver.observe(this.content);
      }
      this.resize();
    }
    destroy() {
      var t2, i2;
      null == (t2 = this.wrapperResizeObserver) || t2.disconnect(), null == (i2 = this.contentResizeObserver) || i2.disconnect();
    }
    get limit() {
      return { x: this.scrollWidth - this.width, y: this.scrollHeight - this.height };
    }
  };
  var o = class {
    constructor() {
      this.events = {};
    }
    emit(t2, ...i2) {
      let e2 = this.events[t2] || [];
      for (let t3 = 0, s2 = e2.length; t3 < s2; t3++)
        e2[t3](...i2);
    }
    on(t2, i2) {
      var e2;
      return (null == (e2 = this.events[t2]) ? void 0 : e2.push(i2)) || (this.events[t2] = [i2]), () => {
        var e3;
        this.events[t2] = null == (e3 = this.events[t2]) ? void 0 : e3.filter((t3) => i2 !== t3);
      };
    }
    off(t2, i2) {
      var e2;
      this.events[t2] = null == (e2 = this.events[t2]) ? void 0 : e2.filter((t3) => i2 !== t3);
    }
    destroy() {
      this.events = {};
    }
  };
  var n = class {
    constructor(t2, { wheelMultiplier: e2 = 1, touchMultiplier: s2 = 2, normalizeWheel: n2 = false }) {
      this.onTouchStart = (t3) => {
        const { clientX: i2, clientY: e3 } = t3.targetTouches ? t3.targetTouches[0] : t3;
        this.touchStart.x = i2, this.touchStart.y = e3, this.lastDelta = { x: 0, y: 0 };
      }, this.onTouchMove = (t3) => {
        const { clientX: i2, clientY: e3 } = t3.targetTouches ? t3.targetTouches[0] : t3, s3 = -(i2 - this.touchStart.x) * this.touchMultiplier, o2 = -(e3 - this.touchStart.y) * this.touchMultiplier;
        this.touchStart.x = i2, this.touchStart.y = e3, this.lastDelta = { x: s3, y: o2 }, this.emitter.emit("scroll", { deltaX: s3, deltaY: o2, event: t3 });
      }, this.onTouchEnd = (t3) => {
        this.emitter.emit("scroll", { deltaX: this.lastDelta.x, deltaY: this.lastDelta.y, event: t3 });
      }, this.onWheel = (t3) => {
        let { deltaX: e3, deltaY: s3 } = t3;
        this.normalizeWheel && (e3 = i(-100, e3, 100), s3 = i(-100, s3, 100)), e3 *= this.wheelMultiplier, s3 *= this.wheelMultiplier, this.emitter.emit("scroll", { deltaX: e3, deltaY: s3, event: t3 });
      }, this.element = t2, this.wheelMultiplier = e2, this.touchMultiplier = s2, this.normalizeWheel = n2, this.touchStart = { x: null, y: null }, this.emitter = new o(), this.element.addEventListener("wheel", this.onWheel, { passive: false }), this.element.addEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.addEventListener("touchmove", this.onTouchMove, { passive: false }), this.element.addEventListener("touchend", this.onTouchEnd, { passive: false });
    }
    on(t2, i2) {
      return this.emitter.on(t2, i2);
    }
    destroy() {
      this.emitter.destroy(), this.element.removeEventListener("wheel", this.onWheel, { passive: false }), this.element.removeEventListener("touchstart", this.onTouchStart, { passive: false }), this.element.removeEventListener("touchmove", this.onTouchMove, { passive: false }), this.element.removeEventListener("touchend", this.onTouchEnd, { passive: false });
    }
  };
  var r = class {
    constructor({ wrapper: i2 = window, content: r2 = document.documentElement, wheelEventsTarget: l = i2, eventsTarget: h = l, smoothWheel: a = true, smoothTouch: c = false, syncTouch: u = false, syncTouchLerp: p = 0.1, __iosNoInertiaSyncTouchLerp: d = 0.4, touchInertiaMultiplier: m = 35, duration: g, easing: v = (t2) => Math.min(1, 1.001 - Math.pow(2, -10 * t2)), lerp: S = !g && 0.1, infinite: w = false, orientation: f = "vertical", gestureOrientation: y = "vertical", touchMultiplier: T = 1, wheelMultiplier: z = 1, normalizeWheel: M = false, autoResize: L = true } = {}) {
      this.onVirtualScroll = ({ deltaX: i3, deltaY: e2, event: s2 }) => {
        if (s2.ctrlKey)
          return;
        const o2 = s2.type.includes("touch"), n2 = s2.type.includes("wheel");
        if ("both" === this.options.gestureOrientation && 0 === i3 && 0 === e2 || "vertical" === this.options.gestureOrientation && 0 === e2 || "horizontal" === this.options.gestureOrientation && 0 === i3 || o2 && "vertical" === this.options.gestureOrientation && 0 === this.scroll && !this.options.infinite && e2 <= 0)
          return;
        let r3 = s2.composedPath();
        if (r3 = r3.slice(0, r3.indexOf(this.rootElement)), r3.find((t2) => {
          var i4;
          return (null == t2.hasAttribute ? void 0 : t2.hasAttribute("data-lenis-prevent")) || o2 && (null == t2.hasAttribute ? void 0 : t2.hasAttribute("data-lenis-prevent-touch")) || n2 && (null == t2.hasAttribute ? void 0 : t2.hasAttribute("data-lenis-prevent-wheel")) || (null == (i4 = t2.classList) ? void 0 : i4.contains("lenis"));
        }))
          return;
        if (this.isStopped || this.isLocked)
          return void s2.preventDefault();
        if (this.isSmooth = (this.options.smoothTouch || this.options.syncTouch) && o2 || this.options.smoothWheel && n2, !this.isSmooth)
          return this.isScrolling = false, void this.animate.stop();
        s2.preventDefault();
        let l2 = e2;
        "both" === this.options.gestureOrientation ? l2 = Math.abs(e2) > Math.abs(i3) ? e2 : i3 : "horizontal" === this.options.gestureOrientation && (l2 = i3);
        const h2 = o2 && this.options.syncTouch, a2 = o2 && "touchend" === s2.type && Math.abs(l2) > 1;
        a2 && (l2 = this.velocity * this.options.touchInertiaMultiplier), this.scrollTo(this.targetScroll + l2, t({ programmatic: false }, h2 && { lerp: a2 ? this.syncTouchLerp : this.options.__iosNoInertiaSyncTouchLerp }));
      }, this.onScroll = () => {
        if (!this.isScrolling) {
          const t2 = this.animatedScroll;
          this.animatedScroll = this.targetScroll = this.actualScroll, this.velocity = 0, this.direction = Math.sign(this.animatedScroll - t2), this.emit();
        }
      }, window.lenisVersion = "1.0.27", i2 !== document.documentElement && i2 !== document.body || (i2 = window), this.options = { wrapper: i2, content: r2, wheelEventsTarget: l, eventsTarget: h, smoothWheel: a, smoothTouch: c, syncTouch: u, syncTouchLerp: p, __iosNoInertiaSyncTouchLerp: d, touchInertiaMultiplier: m, duration: g, easing: v, lerp: S, infinite: w, gestureOrientation: y, orientation: f, touchMultiplier: T, wheelMultiplier: z, normalizeWheel: M, autoResize: L }, this.animate = new e(), this.emitter = new o(), this.dimensions = new s({ wrapper: i2, content: r2, autoResize: L }), this.toggleClass("lenis", true), this.velocity = 0, this.isLocked = false, this.isStopped = false, this.isSmooth = u || a || c, this.isScrolling = false, this.targetScroll = this.animatedScroll = this.actualScroll, this.options.wrapper.addEventListener("scroll", this.onScroll, { passive: false }), this.virtualScroll = new n(h, { touchMultiplier: T, wheelMultiplier: z, normalizeWheel: M }), this.virtualScroll.on("scroll", this.onVirtualScroll);
    }
    destroy() {
      this.emitter.destroy(), this.options.wrapper.removeEventListener("scroll", this.onScroll, { passive: false }), this.virtualScroll.destroy(), this.dimensions.destroy(), this.toggleClass("lenis", false), this.toggleClass("lenis-smooth", false), this.toggleClass("lenis-scrolling", false), this.toggleClass("lenis-stopped", false), this.toggleClass("lenis-locked", false);
    }
    on(t2, i2) {
      return this.emitter.on(t2, i2);
    }
    off(t2, i2) {
      return this.emitter.off(t2, i2);
    }
    setScroll(t2) {
      this.isHorizontal ? this.rootElement.scrollLeft = t2 : this.rootElement.scrollTop = t2;
    }
    resize() {
      this.dimensions.resize();
    }
    emit() {
      this.emitter.emit("scroll", this);
    }
    reset() {
      this.isLocked = false, this.isScrolling = false, this.velocity = 0, this.animate.stop();
    }
    start() {
      this.isStopped = false, this.reset();
    }
    stop() {
      this.isStopped = true, this.animate.stop(), this.reset();
    }
    raf(t2) {
      const i2 = t2 - (this.time || t2);
      this.time = t2, this.animate.advance(1e-3 * i2);
    }
    scrollTo(t2, { offset: e2 = 0, immediate: s2 = false, lock: o2 = false, duration: n2 = this.options.duration, easing: r2 = this.options.easing, lerp: l = !n2 && this.options.lerp, onComplete: h = null, force: a = false, programmatic: c = true } = {}) {
      if (!this.isStopped && !this.isLocked || a) {
        if (["top", "left", "start"].includes(t2))
          t2 = 0;
        else if (["bottom", "right", "end"].includes(t2))
          t2 = this.limit;
        else {
          var u;
          let i2;
          if ("string" == typeof t2 ? i2 = document.querySelector(t2) : null != (u = t2) && u.nodeType && (i2 = t2), i2) {
            if (this.options.wrapper !== window) {
              const t3 = this.options.wrapper.getBoundingClientRect();
              e2 -= this.isHorizontal ? t3.left : t3.top;
            }
            const s3 = i2.getBoundingClientRect();
            t2 = (this.isHorizontal ? s3.left : s3.top) + this.animatedScroll;
          }
        }
        if ("number" == typeof t2) {
          if (t2 += e2, t2 = Math.round(t2), this.options.infinite ? c && (this.targetScroll = this.animatedScroll = this.scroll) : t2 = i(0, t2, this.limit), s2)
            return this.animatedScroll = this.targetScroll = t2, this.setScroll(this.scroll), this.reset(), void (null == h || h(this));
          if (!c) {
            if (t2 === this.targetScroll)
              return;
            this.targetScroll = t2;
          }
          this.animate.fromTo(this.animatedScroll, t2, { duration: n2, easing: r2, lerp: l, onStart: () => {
            o2 && (this.isLocked = true), this.isScrolling = true;
          }, onUpdate: (t3, i2) => {
            this.isScrolling = true, this.velocity = t3 - this.animatedScroll, this.direction = Math.sign(this.velocity), this.animatedScroll = t3, this.setScroll(this.scroll), c && (this.targetScroll = t3), i2 || this.emit(), i2 && requestAnimationFrame(() => {
              this.reset(), this.emit(), null == h || h(this);
            });
          } });
        }
      }
    }
    get rootElement() {
      return this.options.wrapper === window ? this.options.content : this.options.wrapper;
    }
    get limit() {
      return this.dimensions.limit[this.isHorizontal ? "x" : "y"];
    }
    get isHorizontal() {
      return "horizontal" === this.options.orientation;
    }
    get actualScroll() {
      return this.isHorizontal ? this.rootElement.scrollLeft : this.rootElement.scrollTop;
    }
    get scroll() {
      return this.options.infinite ? (this.animatedScroll % (t2 = this.limit) + t2) % t2 : this.animatedScroll;
      var t2;
    }
    get progress() {
      return 0 === this.limit ? 1 : this.scroll / this.limit;
    }
    get isSmooth() {
      return this.__isSmooth;
    }
    set isSmooth(t2) {
      this.__isSmooth !== t2 && (this.__isSmooth = t2, this.toggleClass("lenis-smooth", t2));
    }
    get isScrolling() {
      return this.__isScrolling;
    }
    set isScrolling(t2) {
      this.__isScrolling !== t2 && (this.__isScrolling = t2, this.toggleClass("lenis-scrolling", t2));
    }
    get isStopped() {
      return this.__isStopped;
    }
    set isStopped(t2) {
      this.__isStopped !== t2 && (this.__isStopped = t2, this.toggleClass("lenis-stopped", t2));
    }
    get isLocked() {
      return this.__isLocked;
    }
    set isLocked(t2) {
      this.__isLocked !== t2 && (this.__isLocked = t2, this.toggleClass("lenis-locked", t2));
    }
    get className() {
      let t2 = "lenis";
      return this.isStopped && (t2 += " lenis-stopped"), this.isLocked && (t2 += " lenis-locked"), this.isScrolling && (t2 += " lenis-scrolling"), this.isSmooth && (t2 += " lenis-smooth"), t2;
    }
    toggleClass(t2, i2) {
      this.rootElement.classList.toggle(t2, i2), this.emitter.emit("className change", this);
    }
  };

  // ../util/injectCSS.js
  function injectCSS(string) {
    const style = document.createElement("style");
    style.textContent = string;
    document.head.append(style);
  }

  // ../util/webflow.js
  function handleEditor(onEditorView = null) {
    if (Webflow.env("editor") !== void 0) {
      if (onEditorView !== null)
        onEditorView();
      console.log("Webflow Editor View");
      return true;
    } else {
      return false;
    }
  }

  // ../util/eval.js
  function isArrowFunction(str) {
    const arrowFunctionRegex = /^(\s*[(]?[a-zA-Z0-9\s,]*[)]?\s*=>\s*{?\s*[\s\S]*}?)/;
    return arrowFunctionRegex.test(str);
  }
  function evalConfig(selector, defaults = {}) {
    const data = document.querySelector(selector);
    if (!data)
      return { ...defaults };
    const out = { ...data.dataset };
    for (const item in out) {
      const value = out[item];
      if (value === "" || value === " ") {
      } else if (!isNaN(value)) {
        out[item] = +value;
      } else if (value === "true" || value === "false") {
        if (value === "true") {
          out[item] = true;
        } else
          out[item] = false;
      } else if (isArrowFunction(value)) {
        out[item] = new Function(`return ${value};`)();
      } else {
        out[item] = value;
      }
    }
    return { ...defaults, ...out };
  }

  // index.js
  injectCSS(`
    .lenis.lenis-smooth {
      scroll-behavior: auto;  
    }
    html.lenis {
      height: auto;
    }
`);
  var Scroll = class extends r {
    constructor(params2) {
      if (params2.selector) {
        params2.wrapper = document.querySelector(params2.selector);
        if (params2.wrapper)
          params2.content = params2.wrapper.children[0];
      }
      super(params2);
      this.params = params2;
      this.isActive = true;
      this.init();
      this.call = {
        stop: () => this.stop(),
        start: () => this.start()
      };
    }
    init() {
      this.config();
      this.render();
      if (this.params.useRaf) {
        this.y = window.scrollY;
        this.max = window.innerHeight;
        this.speed = 0;
        this.percent = this.y / (document.body.scrollHeight - window.innerHeight);
        this.direction = 0;
        this.on("scroll", (e2) => this.outScroll(e2));
      }
      handleEditor(this.destroy.bind(this));
    }
    config() {
      [...document.querySelectorAll("[data-scrolllink]")].forEach((item) => {
        const target = document.querySelector(item.dataset.scrolllink);
        if (target)
          item.addEventListener(
            "click",
            (e2) => {
              e2.preventDefault();
              this.scrollTo(target);
            },
            { passive: false }
          );
      });
      [...document.querySelectorAll('[data-scroll="overscroll"]')].forEach(
        (item) => item.setAttribute("onwheel", "event.stopPropagation()")
      );
      [...document.querySelectorAll('[data-scroll="stop"]')].forEach((item) => {
        item.onclick = () => {
          this.stop();
          this.isActive = false;
        };
      });
      [...document.querySelectorAll('[data-scroll="start"]')].forEach((item) => {
        item.onclick = () => {
          this.start();
          this.isActive = true;
        };
      });
      [...document.querySelectorAll('[data-scroll="toggle"]')].forEach((item) => {
        item.onclick = () => {
          if (this.isActive) {
            this.stop();
            this.isActive = false;
          } else {
            this.start();
            this.isActive = true;
          }
        };
      });
    }
    render(time) {
      this.raf(time);
      window.requestAnimationFrame(this.render.bind(this));
    }
    outScroll({ scroll, limit, velocity, progress, direction }) {
      this.y = scroll || 0;
      this.max = limit || window.innerHeight;
      this.speed = velocity || 0;
      this.percent = progress || 0;
      this.direction = 0;
      if (this.params.useRaf) {
        window.dispatchEvent(
          new CustomEvent("sscroll", {
            detail: {
              y: this.y,
              max: this.max,
              speed: this.speed,
              percent: this.percent,
              direction: this.direction
            }
          })
        );
      }
    }
    renderWebflow(time) {
    }
  };
  var params = evalConfig("[data-id-scroll]", {
    // defaults
    wrapper: window,
    duration: 1.5,
    easing: (t2) => t2 === 1 ? 1 : 1 - Math.pow(2, -10 * t2),
    // https://easings.net
    orientation: "vertical",
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 1.5,
    infinite: false,
    // internal
    useRaf: true
  });
  window.sscroll = new Scroll(params);
})();
//# sourceMappingURL=index.js.map
