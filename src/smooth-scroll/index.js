import Lenis from "@studio-freight/lenis";
import { injectCSS } from "../util/injectCSS";
import { handleEditor } from "../util/webflow";
import { evalConfig } from "../util/eval";

injectCSS(`
    .lenis.lenis-smooth {
      scroll-behavior: auto;  
    }
    html.lenis {
      height: auto;
    }
`);

class Scroll extends Lenis {
  constructor(params) {
    // check selector if needed || window
    if (params.selector) {
      params.wrapper = document.querySelector(params.selector);
      if (params.wrapper) params.content = params.wrapper.children[0];
    }

    // console.log(params);
    super(params);

    this.params = params;
    this.isActive = true;
    this.init();

    // -- interface
    this.call = {
      stop: () => this.stop(),
      start: () => this.start(),
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
      this.on("scroll", (e) => this.outScroll(e));
    }

    handleEditor(this.destroy.bind(this));
  }

  config() {
    [...document.querySelectorAll("[data-scrolllink]")].forEach((item) => {
      const target = document.querySelector(item.dataset.scrolllink);
      if (target)
        item.addEventListener(
          "click",
          (e) => {
            e.preventDefault();
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
    // if (this.params.useRaf) this.call.onRender(time);
  }

  outScroll({ scroll, limit, velocity, progress, direction }) {
    // console.log(scroll, limit, velocity, progress, direction);
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
            direction: this.direction,
          },
        })
      );
    }
  }

  renderWebflow(time) {}
}

/*  --- Init */
const params = evalConfig("[data-id-scroll]", {
  // defaults
  wrapper: window,
  duration: 1.5,
  easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // https://easings.net
  orientation: "vertical",
  smoothWheel: true,
  smoothTouch: false,
  touchMultiplier: 1.5,
  infinite: false,
  // internal
  useRaf: true,
});

window.sscroll = new Scroll(params);

/* ---- Events */

// window.addEventListener("sscroll", (e) => {
//   console.log(e.detail);
// });

/* ---- Callbacks */

// window.SScroll.call.stop()
// window.SScroll.call.start()
