import { reactive as F, ref as m, onMounted as A, toRefs as $, openBlock as G, createElementBlock as H, normalizeClass as X, createElementVNode as i, normalizeStyle as R, toDisplayString as J, pushScopeId as K, popScopeId as Q } from "vue";
const U = {
  name: "VertifySlide",
  props: {
    /**
     * @description   拖拽滑块时的回调, 参数为当前滑块拖拽的距离
     * @default       (l: number):void => {}
     */
    onDraw: (n) => {
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
  setup(n, t) {
    const s = F({
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
    }), r = 42, d = 9, u = r + d * 2 + 3, g = Math.PI, c = 320, h = 160;
    let L = m(null);
    const v = m(0), C = m(0), b = m(0), I = m(0), w = (e, o, l, a) => {
      console.log("ctx", e), e.beginPath(), e.moveTo(o, l), e.arc(o + r / 2, l - d + 2, d, 0.72 * g, 2.26 * g), e.lineTo(o + r, l), e.arc(o + r + d - 2, l + r / 2, d, 1.21 * g, 2.78 * g), e.lineTo(o + r, l + r), e.lineTo(o, l + r), e.arc(o + d - 2, l + r / 2, d + 0.4, 2.76 * g, 1.24 * g, !0), e.lineTo(o, l), e.lineWidth = 2, e.fillStyle = "rgba(255, 255, 255, 0.7)", e.strokeStyle = "rgba(255, 255, 255, 0.7)", e.stroke(), e.globalCompositeOperation = "destination-over", a === "fill" ? e.fill() : e.clip();
    };
    function M(e, o) {
      return Math.round(Math.random() * (o - e) + e);
    }
    function S(e, o) {
      return e + o;
    }
    function W(e) {
      return e * e;
    }
    const B = () => {
      const e = Y(() => {
        N(e);
      });
      s.imgRef = e;
    }, Y = (e) => {
      const o = new Image();
      return o.onload = e, o.crossOrigin = "Anonymous", console.log("img", o), o.src = "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", o;
    }, P = () => {
      y();
    }, T = () => {
      console.log(222), y(), t.emit("verfity-slide");
    }, E = () => {
      console.log(12), s.vertifyWrapClass = "vertifyWrap shake", setTimeout(() => {
        s.vertifyWrapClass = "vertifyWrap";
      }, 800), t.emit("fail-slide");
    }, N = (e) => {
      const o = document.getElementById("canvasRef"), l = document.getElementById("blockRef");
      s.blockRef = l, console.log("canvasRef", L);
      const a = o.getContext("2d"), f = l.getContext("2d");
      v.value = M(u + 10, c - (u + 10)), C.value = M(10 + d * 2, h - (u + 10)), w(a, v.value, C.value, "fill"), w(f, v.value, C.value, "clip"), a.drawImage(e, 0, 0, c, h), f.drawImage(e, 0, 0, c, h);
      const p = C.value - d * 2 - 1, z = f.getImageData(v.value - 3, p, u, u);
      l.width = u, f.putImageData(z, 0, p);
    }, O = () => {
      const e = s.trailRef, o = e.reduce(S) / e.length, l = e.map((p) => p - o), a = Math.sqrt(l.map(W).reduce(S) / e.length), f = parseInt(s.blockRef.style.left);
      return {
        spliced: Math.abs(f - v.value) < 10,
        verified: a !== 0,
        // 简单验证拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
        left: f,
        destX: v.value
      };
    }, y = () => {
      const e = document.getElementById("canvasRef"), o = document.getElementById("blockRef"), l = e.getContext("2d"), a = o.getContext("2d");
      s.sliderLeft = 0, s.sliderClass = "sliderContainer", s.blockRef.width = c, s.blockRef.style.left = 0 + "px", l.clearRect(0, 0, c, h), a.clearRect(0, 0, c, h), console.log("state.imgRef", s.imgRef.src), s.imgRef.src = "https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    }, V = function(e) {
      console.log("e", e), b.value = e.clientX || e.touches[0].clientX, I.value = e.clientY || e.touches[0].clientY, s.isMouseDownRef = !0;
    }, j = (e) => {
      if (!s.isMouseDownRef || (s.isMouseDownRef = !1, (e.clientX || e.changedTouches[0].clientX) === b.value))
        return !1;
      console.log("sliderClass", s.sliderClass.value), s.sliderClass = "sliderContainer";
      const { spliced: l, verified: a } = O();
      l ? a ? (s.sliderClass = "sliderContainer sliderContainer_success", typeof T == "function" && T()) : (console.log("sliderClass", s.sliderClass), s.sliderClass = "sliderContainer sliderContainer_fail", s.textTip = "请再试一次", y()) : (s.sliderClass = "sliderContainer sliderContainer_fail", typeof E == "function" && E(), setTimeout(y.bind(this), 1e3));
    }, q = (e) => {
      if (!s.isMouseDownRef)
        return !1;
      e.preventDefault();
      const o = e.clientX || e.touches[0].clientX, l = e.clientY || e.touches[0].clientY, a = o - b.value, f = l - I.value;
      if (a < 0 || a + 38 >= c)
        return !1;
      s.sliderLeft = a;
      const p = (c - 40 - 20) / (c - 40) * a;
      console.log("blockRef", s.blockRef.style), s.blockRef.style.left = p + "px", s.sliderClass = "sliderContainer sliderContainer_active", s.trailRef.push(f);
    };
    return A(() => {
      B();
    }), {
      ...$(s),
      handleDragStart: V,
      handleDragEnd: j,
      handleDragMove: q,
      handleRefresh: P
    };
  }
};
const Z = (n, t) => {
  const s = n.__vccOpts || n;
  for (const [r, d] of t)
    s[r] = d;
  return s;
}, k = (n) => (K("data-v-f87996d7"), n = n(), Q(), n), _ = {
  ref: "canvasRef",
  width: "320",
  height: "160",
  id: "canvasRef"
}, x = /* @__PURE__ */ k(() => /* @__PURE__ */ i("div", { class: "sliderIcon" }, "→", -1)), ee = [
  x
], se = { class: "sliderText" }, ne = /* @__PURE__ */ k(() => /* @__PURE__ */ i("div", { class: "loadingIcon" }, null, -1)), oe = /* @__PURE__ */ k(() => /* @__PURE__ */ i("span", null, "加载中...", -1)), te = [
  ne,
  oe
];
function le(n, t) {
  return G(), H("div", {
    class: X(n.vertifyWrapClass),
    style: { width: "320px", margin: "0 auto" },
    onMousemove: t[5] || (t[5] = (...s) => n.handleDragMove && n.handleDragMove(...s)),
    onMouseup: t[6] || (t[6] = (...s) => n.handleDragEnd && n.handleDragEnd(...s)),
    onTouchmove: t[7] || (t[7] = (...s) => n.handleDragMove && n.handleDragMove(...s)),
    onTouchend: t[8] || (t[8] = (...s) => n.handleDragEnd && n.handleDragEnd(...s))
  }, [
    i("div", null, [
      i("canvas", _, null, 512),
      i("canvas", {
        ref: "blockRef",
        class: "block",
        id: "blockRef",
        onMousedown: t[0] || (t[0] = (...s) => n.handleDragStart && n.handleDragStart(...s)),
        onTouchstart: t[1] || (t[1] = (...s) => n.handleDragStart && n.handleDragStart(...s))
      }, null, 544)
    ]),
    i("div", {
      class: X(n.sliderClass),
      style: R({
        pointerEvents: n.isLoading ? "none" : "auto",
        width: "320px"
      })
    }, [
      i("div", {
        class: "sliderMask",
        style: R({ width: n.sliderLeft + "px" })
      }, [
        i("div", {
          class: "slider",
          style: R({ left: n.sliderLeft + "px" }),
          onMousedown: t[2] || (t[2] = (...s) => n.handleDragStart && n.handleDragStart(...s)),
          onTouchstart: t[3] || (t[3] = (...s) => n.handleDragStart && n.handleDragStart(...s))
        }, ee, 36)
      ], 4),
      i("div", se, J(n.textTip), 1)
    ], 6),
    i("div", {
      className: "refreshIcon",
      onClick: t[4] || (t[4] = (...s) => n.handleRefresh && n.handleRefresh(...s)),
      style: R({ backgroundImage: `url(${n.refreshIcon})` })
    }, null, 4),
    i("div", {
      class: "loadingContainer",
      style: R({
        width: "320px",
        height: "160px",
        display: n.isLoading ? "" : "none"
      })
    }, te, 4)
  ], 34);
}
const D = /* @__PURE__ */ Z(U, [["render", le], ["__scopeId", "data-v-f87996d7"]]);
D.install = (n) => {
  n.component(D.name, D);
};
const ae = [D], ie = (n) => {
  ae.forEach((t) => {
    n.component(t.name, t);
  });
}, de = {
  install: ie
};
export {
  D as VertifySlide,
  de as default
};
