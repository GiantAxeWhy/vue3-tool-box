import { reactive as j, ref as m, onMounted as q, toRefs as F } from "vue";
const A = {
  props: {
    /**
     * @description   拖拽滑块时的回调, 参数为当前滑块拖拽的距离
     * @default       (l: number):void => {}
     */
    onDraw: (c) => {
    },
    /**
     * @description   用户的自定义验证逻辑
     * @default       (arg: VertifyType) => VertifyType
     */
    // onCustomVertify: (arg) => VertifyType
    /**
    * @description   验证成功回调
    * @default       ():void => {}
    */
    onSuccess: () => {
    },
    /**
     * @description   验证失败回调
     * @default       ():void => {}
     */
    onFail: () => {
    },
    /**
     * @description   刷新时回调
     * @default       ():void => {}
     */
    onRefresh: () => {
    }
  },
  emits: ["verfity-slide", "fail-slide"],
  setup(c, f) {
    const t = j({
      sliderLeft: 0,
      isLoading: !1,
      textTip: "",
      sliderClass: "sliderContainer",
      vertifyWrapClass: "vertifyWrap",
      blockRef: null,
      trailRef: [],
      isMouseDownRef: !1,
      imgRef: null,
      refreshIcon: "http://cdn.dooring.cn/dr/icon12.png"
    }), l = 42, a = 9, d = l + a * 2 + 3, u = Math.PI, i = 320, v = 160;
    let M = m(null);
    const g = m(0), R = m(0), y = m(0), _ = m(0), b = (e, s, o, n) => {
      console.log("ctx", e), e.beginPath(), e.moveTo(s, o), e.arc(s + l / 2, o - a + 2, a, 0.72 * u, 2.26 * u), e.lineTo(s + l, o), e.arc(s + l + a - 2, o + l / 2, a, 1.21 * u, 2.78 * u), e.lineTo(s + l, o + l), e.lineTo(s, o + l), e.arc(s + a - 2, o + l / 2, a + 0.4, 2.76 * u, 1.24 * u, !0), e.lineTo(s, o), e.lineWidth = 2, e.fillStyle = "rgba(255, 255, 255, 0.7)", e.strokeStyle = "rgba(255, 255, 255, 0.7)", e.stroke(), e.globalCompositeOperation = "destination-over", n === "fill" ? e.fill() : e.clip();
    };
    function k(e, s) {
      return Math.round(Math.random() * (s - e) + e);
    }
    function I(e, s) {
      return e + s;
    }
    function X(e) {
      return e * e;
    }
    const T = () => {
      const e = W(() => {
        E(e);
      });
      t.imgRef = e;
    }, W = (e) => {
      const s = new Image();
      return s.onload = e, s.crossOrigin = "Anonymous", console.log("img", s), s.src = "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", s;
    }, Y = () => {
      h();
    }, w = () => {
      console.log(222), h(), f.emit("verfity-slide");
    }, D = () => {
      console.log(12), t.vertifyWrapClass = "vertifyWrap shake", setTimeout(() => {
        t.vertifyWrapClass = "vertifyWrap";
      }, 800), f.emit("fail-slide");
    }, E = (e) => {
      const s = document.getElementById("canvasRef"), o = document.getElementById("blockRef");
      t.blockRef = o, console.log("canvasRef", M);
      const n = s.getContext("2d"), r = o.getContext("2d");
      g.value = k(d + 10, i - (d + 10)), R.value = k(10 + a * 2, v - (d + 10)), b(n, g.value, R.value, "fill"), b(r, g.value, R.value, "clip"), n.drawImage(e, 0, 0, i, v), r.drawImage(e, 0, 0, i, v);
      const p = R.value - a * 2 - 1, O = r.getImageData(g.value - 3, p, d, d);
      o.width = d, r.putImageData(O, 0, p);
    }, L = () => {
      const e = t.trailRef, s = e.reduce(I) / e.length, o = e.map((p) => p - s), n = Math.sqrt(o.map(X).reduce(I) / e.length), r = parseInt(t.blockRef.style.left);
      return {
        spliced: Math.abs(r - g.value) < 10,
        verified: n !== 0,
        // 简单验证拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
        left: r,
        destX: g.value
      };
    }, h = () => {
      const e = document.getElementById("canvasRef"), s = document.getElementById("blockRef"), o = e.getContext("2d"), n = s.getContext("2d");
      t.sliderLeft = 0, t.sliderClass = "sliderContainer", t.blockRef.width = i, t.blockRef.style.left = 0 + "px", o.clearRect(0, 0, i, v), n.clearRect(0, 0, i, v), console.log("state.imgRef", t.imgRef.src), t.imgRef.src = "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    }, S = function(e) {
      console.log("e", e), y.value = e.clientX || e.touches[0].clientX, _.value = e.clientY || e.touches[0].clientY, t.isMouseDownRef = !0;
    }, B = (e) => {
      if (!t.isMouseDownRef || (t.isMouseDownRef = !1, (e.clientX || e.changedTouches[0].clientX) === y.value))
        return !1;
      console.log("sliderClass", t.sliderClass.value), t.sliderClass = "sliderContainer";
      const { spliced: o, verified: n } = L();
      o ? n ? (t.sliderClass = "sliderContainer sliderContainer_success", typeof w == "function" && w()) : (console.log("sliderClass", t.sliderClass), t.sliderClass = "sliderContainer sliderContainer_fail", t.textTip = "请再试一次", h()) : (t.sliderClass = "sliderContainer sliderContainer_fail", typeof D == "function" && D(), setTimeout(h.bind(this), 1e3));
    }, P = (e) => {
      if (!t.isMouseDownRef)
        return !1;
      e.preventDefault();
      const s = e.clientX || e.touches[0].clientX, o = e.clientY || e.touches[0].clientY, n = s - y.value, r = o - _.value;
      if (n < 0 || n + 38 >= i)
        return !1;
      t.sliderLeft = n;
      const p = (i - 40 - 20) / (i - 40) * n;
      console.log("blockRef", t.blockRef.style), t.blockRef.style.left = p + "px", t.sliderClass = "sliderContainer sliderContainer_active", t.trailRef.push(r);
    };
    return q(() => {
      T();
    }), {
      ...F(t),
      handleDragStart: S,
      handleDragEnd: B,
      handleDragMove: P,
      handleRefresh: Y
    };
  }
};
const N = (c, f) => {
  const t = c.__vccOpts || c;
  for (const [l, a] of f)
    t[l] = a;
  return t;
}, C = /* @__PURE__ */ N(A, [["__scopeId", "data-v-5928d181"]]);
C.install = (c) => {
  c.component(C.__name, C);
};
const z = [C], G = (c) => {
  z.forEach((f) => {
    c.component(f.__name, f);
  });
}, J = {
  install: G
};
export {
  J as default,
  C as vertifySlide
};
