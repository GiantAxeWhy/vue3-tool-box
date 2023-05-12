<template>
  <div class="watermark-container" ref="parentRef">
    <slot></slot>
    <!-- 添加一个div,填充满整个区域，设置水印背景，重复 -->
  </div>
</template>
<script>
export default {
  name: "waterMark",
};
</script>
<script setup>
import { onMounted, ref, watchEffect, onUnmounted } from "vue";
import useWaterMarkBg from "./useWaterMarkBg";

const props = defineProps({
  text: {
    type: String,
    required: true,
    default: "waterMark",
  },
  fontSize: {
    type: Number,
    default: 10,
  },
  gap: {
    type: Number,
    default: 1,
  },
});
let ob;
let div;
const bg = useWaterMarkBg(props);
console.log("bg", bg.value);
const parentRef = ref(null);
const flag = ref(0);
onMounted(() => {
  ob = new MutationObserver((records) => {
    console.log(records);
    for (const record of records) {
      for (const dom of record.removedNodes) {
        if (dom === div) {
          flag.value++;
          return;
        }
      }
      if (record.target === div) {
        flag.value++;
        return;
      }
    }
  });
  ob.observe(parentRef.value, {
    childList: true,
    attributes: true,
    subtree: true,
  });
});
onUnmounted(() => {
  ob && ob.disconnect();
  div = null;
}),
  watchEffect(() => {
    flag.value;
    if (!parentRef.value) {
      return;
    }
    if (div) {
      div.remove();
    }
    div = document.createElement("div");
    const { base64, styleSize } = bg.value;
    div.style.backgroundImage = `url(${base64})`;
    div.style.backgroundSize = `${styleSize}px ${styleSize}px`;
    div.style.backgroundRepeat = "repeat";
    div.style.width = "100%";
    div.style.height = "100%";
    div.style.zIndex = 9999;
    div.style.pointerEvents = "none";
    div.style.position = "absolute";
    div.style.inset = 0;
    parentRef.value.appendChild(div);
  });
</script>

<style scoped>
.watermark-container {
  position: relative;
}
</style>
