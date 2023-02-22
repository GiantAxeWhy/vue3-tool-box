<template>
  <div
    :class="vertifyWrapClass"
    :style="{ width: '320px', margin: '0 auto' }"
    @mousemove="handleDragMove"
    @mouseup="handleDragEnd"
    @touchmove="handleDragMove"
    @touchend="handleDragEnd"
  >
    <div>
      <canvas ref="canvasRef" width="320" height="160" id="canvasRef"> </canvas>
      <canvas
        ref="blockRef"
        class="block"
        id="blockRef"
        @mousedown="handleDragStart"
        @touchstart="handleDragStart"
      ></canvas>
    </div>
    <div
      :class="sliderClass"
      :style="{
        pointerEvents: isLoading ? 'none' : 'auto',
        width: '320px',
      }"
    >
      <div class="sliderMask" :style="{ width: sliderLeft + 'px' }">
        <div
          class="slider"
          :style="{ left: sliderLeft + 'px' }"
          @mousedown="handleDragStart"
          @touchstart="handleDragStart"
        >
          <div class="sliderIcon">&rarr;</div>
        </div>
      </div>
      <div class="sliderText">{{ textTip }}</div>
    </div>
    <div
      className="refreshIcon"
      @click="handleRefresh"
      :style="{ backgroundImage: `url(${refreshIcon})` }"
    ></div>
    <div
      class="loadingContainer"
      :style="{
        width: '320px',
        height: '160px',
        display: isLoading ? '' : 'none',
      }"
    >
      <div class="loadingIcon"></div>
      <span>加载中...</span>
    </div>
  </div>
</template>

<script lang="js" setup name="vertify">
import { ref, watch, onMounted , reactive, toRefs } from "vue";

export default {
  props:{
  /**
   * @description   拖拽滑块时的回调, 参数为当前滑块拖拽的距离
   * @default       (l: number):void => {}
   */
  onDraw:(l) => {
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
  onSuccess: ()=>{
  },
  /**
   * @description   验证失败回调
   * @default       ():void => {}
   */
  onFail: ()=>{
  },
  /**
   * @description   刷新时回调
   * @default       ():void => {}
   */
  onRefresh: ()=>{
  },
},
  emits: ["verfity-slide","fail-slide"],
setup(props, ctx) {
 const state = reactive({
     sliderLeft:0,
      isLoading:false,
      textTip:'',
      sliderClass:'sliderContainer',
      vertifyWrapClass:'vertifyWrap',
      blockRef:null,
      trailRef:[],
      isMouseDownRef:false,
      imgRef:null,
      refreshIcon: "http://cdn.dooring.cn/dr/icon12.png",
    });
const VertifyType = {
  spliced: true,
  verified: false, // 简单验证拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
  left: 0, // 滑块的移动位置
  destX: 0, // 滑块的目标位置
}
const l = 42
const r= 9
const L = l + r * 2 + 3; // 滑块实际边长
const PI = Math.PI;
const width= 320;
const height = 160;
let canvasRef = ref(null);
// let blockRef = ref(null);
const xRef = ref(0);
// const textTip = ref('');
const yRef = ref(0);
// const imgRef = ref(null);
// let isLoading = ref(false);
// const isMouseDownRef = ref(false)
// let sliderClass = ref("sliderContainer");
// const trailRef = ref([]);
const originXRef = ref(0);
// const sliderLeft = ref(0);
const originYRef = ref(0);
const drawPath = ( ctx,x,y,operation)=>{
  console.log('ctx',ctx)
  ctx.beginPath();
  ctx.moveTo(x,y);
  ctx.arc(x + l / 2, y - r + 2, r, 0.72 * PI, 2.26 * PI);
  ctx.lineTo(x + l, y);
  ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
  ctx.lineTo(x + l, y + l);
  ctx.lineTo(x, y + l);
  ctx.arc(x + r - 2, y + l / 2, r + 0.4, 2.76 * PI, 1.24 * PI, true);
  ctx.lineTo(x, y);
  ctx.lineWidth = 2;
  ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.7)";
  ctx.stroke();
  ctx.globalCompositeOperation = "destination-over";
  operation ==="fill"?ctx.fill():ctx.clip()
}
function getRandomNumberByRange(start, end) {
  return Math.round(Math.random() * (end - start) + start);
}

function sum(x, y) {
  return x + y;
}

function square(x) {
  return x * x;
}
const initImg = ()=>{
  const img = createImg(()=>{
    draw(img)
  })
  state.imgRef = img;
}
const createImg = (onload)=>{
  const img = new Image();

  img.onload = onload;
    img.crossOrigin = "Anonymous";
  console.log('img',img)
  img.src='https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  return img
}
const handleRefresh = () => {
  reset();

};
//成功的回调
const onSuccess=()=>{
  console.log(222)
    reset();
  ctx.emit('verfity-slide')
}
//失败时的回调
const onFail =()=>{
  console.log(12)
  state.vertifyWrapClass = "vertifyWrap shake"
  setTimeout(()=>{ state.vertifyWrapClass = "vertifyWrap" }, 800)
  ctx.emit('fail-slide')
}
const draw =(img)=>{
   const canvasRef2 = document.getElementById("canvasRef");
   const blockRef2 =document.getElementById("blockRef");
   state.blockRef = blockRef2
  console.log('canvasRef',canvasRef)
  const canvasCtx = canvasRef2.getContext("2d")
  const blockCtx = blockRef2.getContext("2d");
  xRef.value = getRandomNumberByRange(L+10,width - (L+10));
  yRef.value = getRandomNumberByRange(10 + r * 2, height - (L + 10))
  drawPath(canvasCtx, xRef.value, yRef.value,'fill')
  drawPath(blockCtx, xRef.value, yRef.value,'clip')
  // 画入图片
  canvasCtx.drawImage(img, 0, 0, width, height);
  blockCtx.drawImage(img, 0, 0, width, height);


  const y1 = yRef.value - r * 2 - 1;
  const ImageData = blockCtx.getImageData(xRef.value - 3, y1, L, L);
  blockRef2.width = L;
  blockCtx.putImageData(ImageData, 0, y1);
}

const verify = () => {
  const arr = state.trailRef; // 拖动时y轴的移动距离
  const average = arr.reduce(sum) / arr.length;
  const deviations = arr.map((x) => x - average);
  const stddev = Math.sqrt(deviations.map(square).reduce(sum) / arr.length);
  const left = parseInt(state.blockRef.style.left);
  return {
    spliced: Math.abs(left - xRef.value) < 10,
    verified: stddev !== 0, // 简单验证拖动轨迹，为零时表示Y轴上下没有波动，可能非人为操作
    left,
    destX: xRef.value,
  };
};

const reset = () => {
  // const canvasCtx = canvasRef.value.getContext("2d");
  // const blockCtx = blockRef.value.getContext("2d");
    const canvasRef2 = document.getElementById("canvasRef");
   const blockRef2 =document.getElementById("blockRef");
     const canvasCtx = canvasRef2.getContext("2d")
  const blockCtx = blockRef2.getContext("2d");
  // 重置样式
  state.sliderLeft = 0;
  state.sliderClass = "sliderContainer";
  state.blockRef.width = width;
  state.blockRef.style.left = 0 + "px";

  // 清空画布
  canvasCtx.clearRect(0, 0, width, height);
  blockCtx.clearRect(0, 0, width, height);

  // 重新加载图片
  //state.isLoading = true;
  // imgRef.value.setSrc(getRandomImgSrc());
    //img.src='https://xbk.189.cn/dev-api/profile/upload/2022/08/05/images_20220805164155A025.png'
  //createImg()
  console.log('state.imgRef',state.imgRef.src)
  state.imgRef.src = 'https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
};

const handleDragStart = function(e) {
  console.log('e',e)
  originXRef.value = e.clientX || e.touches[0].clientX;
  originYRef.value = e.clientY || e.touches[0].clientY;
  state.isMouseDownRef = true;
};

const handleDragEnd = (e) => {
  if (!state.isMouseDownRef) return false;
  state.isMouseDownRef = false;
  const eventX = e.clientX || e.changedTouches[0].clientX;
  if (eventX === originXRef.value) return false;
  console.log('sliderClass',state.sliderClass.value)
 state.sliderClass = "sliderContainer";
  //自定义验证逻辑
  // const { spliced, verified } = onCustomVertify
  //    onCustomVertify(verify())
  //   : verify();
  const {spliced, verified}  =verify()
  if (spliced) {
    if (verified) {
      state.sliderClass = "sliderContainer sliderContainer_success";
      typeof onSuccess === "function" && onSuccess();
    } else {
      console.log('sliderClass',state.sliderClass)
      state.sliderClass = "sliderContainer sliderContainer_fail";
      state.textTip = "请再试一次";
      reset();
    }
  } else {
    state.sliderClass = "sliderContainer sliderContainer_fail";
    typeof onFail === "function" && onFail();
    setTimeout(reset.bind(this), 1000);
  }
};
const handleDragMove = (e) => {
  if (!state.isMouseDownRef) return false;
  e.preventDefault();
  const eventX = e.clientX || e.touches[0].clientX;
  const eventY = e.clientY || e.touches[0].clientY;
  const moveX = eventX - originXRef.value;
  const moveY = eventY - originYRef.value;
  if (moveX < 0 || moveX + 38 >= width) return false;
  state.sliderLeft = moveX;
  const blockLeft = ((width - 40 - 20) / (width - 40)) * moveX;
  console.log('blockRef',state.blockRef.style)
  state.blockRef.style.left = blockLeft + "px";

  state.sliderClass = "sliderContainer sliderContainer_active";
  state.trailRef.push(moveY);
  //拖拽滑块时的回调, 参数为当前滑块拖拽的距离
  // onDraw && onDraw(blockLeft);
};

onMounted(() => {
  initImg();
});
  return {
      ...toRefs(state),
      handleDragStart,
      handleDragEnd,
      handleDragMove,
      handleRefresh
    };
  }
}
</script>

<style scoped lang="less">
.shake {
  animation: shake 800ms ease-in-out;
}
@keyframes shake {
  /* 垂直抖动 */
  10%,
  90% {
    transform: translate3d(0, -1px, 0);
  }
  20%,
  80% {
    transform: translate3d(0, +2px, 0);
  }
  30%,
  70% {
    transform: translate3d(0, -4px, 0);
  }
  40%,
  60% {
    transform: translate3d(0, +4px, 0);
  }
  50% {
    transform: translate3d(0, -4px, 0);
  }
}
.vertifyWrap {
  position: relative;

  .block {
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
    cursor: grab;
  }

  .block:active {
    cursor: grabbing;
  }

  .sliderContainer {
    position: relative;
    text-align: center;
    width: 310px;
    height: 40px;
    line-height: 40px;
    margin-top: -5px;
    background: #f7f9fa;
    color: #45494c;
    border: 1px solid #e4e7eb;
  }

  .sliderContainer_active .slider {
    height: 38px;
    top: -1px;
    border: 1px solid #486cd6;
  }

  .sliderContainer_active .sliderMask {
    height: 38px;
    border-width: 1px;
  }

  .sliderContainer_success .slider {
    height: 38px;
    top: -1px;
    border: 1px solid #0db87f;
    background-color: #0ca14a !important;
  }

  .sliderContainer_success .sliderMask {
    height: 38px;
    border: 1px solid #0db87f;
    background-color: #d2f4ef;
  }

  .sliderContainer_success .sliderIcon {
    background-position: 0 -26px !important;
  }

  .sliderContainer_fail .slider {
    height: 38px;
    top: -1px;
    border: 1px solid #f57a7a;
    background-color: #f57a7a !important;
  }

  .sliderContainer_fail .sliderMask {
    height: 38px;
    border: 1px solid #f57a7a;
    background-color: #fce1e1;
  }

  .sliderContainer_fail .sliderIcon {
    top: 14px;
    background-position: 0 -82px !important;
  }

  .sliderContainer_active .sliderText,
  .sliderContainer_success .sliderText,
  .sliderContainer_fail .sliderText {
    display: none;
  }

  .sliderMask {
    position: absolute;
    left: 0;
    top: 0;
    height: 40px;
    border: 0 solid #486cd6;
    background: #d1e9fe;
  }

  .slider {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    background: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    transition: background 0.2s linear;
    cursor: pointer;
    cursor: grab;
  }

  .slider:active {
    cursor: grabbing;
  }

  .slider:hover {
    background: #486cd6;
  }

  .sliderIcon {
    font-size: 18px;
    color: #000;
  }

  .slider:hover .sliderIcon {
    color: #fff;
  }

  .refreshIcon {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    background-size: 32px;
  }

  .loadingContainer {
    position: absolute;
    left: 0;
    top: 0;
    width: 310px;
    height: 155px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #45494c;
    z-index: 2;
    background: #edf0f2;
  }

  .loadingIcon {
    width: 32px;
    height: 32px;
    margin-bottom: 10px;
    background: url(http://cdn.dooring.cn/dr/icon12.png);
    background-size: 32px;
    animation: loading-icon-rotate 0.8s linear infinite;
  }

  @keyframes loading-icon-rotate {
    from {
      transform: rotate(0);
    }
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
