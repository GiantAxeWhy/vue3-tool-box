# vertify-slide

是一款基于 vue3/vite/js 开发的滑动验证码
这个滑动验证码组件是一个可用于验证用户身份的工具。它可以很容易地集成到你的网站或应用程序中，提供一种用户友好的验证方式，以防止机器人或其他自动化程序的攻击。

## 安装

使用本组件之前，你需要先安装它。可以使用以下命令来安装：

```shell
npm install vue3-tool-box
```

或者你可以下载源代码并将它们引入你的项目中。

## 全局使用方法

在 vue3 项目中全局引用的方式

```js
//main.ts or main.js
import { createApp } from "vue";
import App from "./App.vue";
import Vue3ToolBox from "vue3-tool-box";
import "vue3-tool-box/lib/style.css";

const app = createApp(App);

app.use(Vue3ToolBox);
app.mount("#app");
```

如果使用 ts+vite 的方式，需要在 env.d.ts 中加入最后一句声明，否则 ts 会检测报错。

```js
/// <reference types="vite/client" />
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vue3-tool-box';
```

## 局部使用方法

```vue
<script setup>
import { vertifySlide } from "../packages/index";
</script>

<template>
  <vertify-slide @verfity-slide="verfitySlide" />
</template>

<style></style>
```

## 参数说明

verfitySlide 方法为验证成功回调的方法

## 贡献

欢迎大家为这个组件做出贡献！如果你发现了任何错误或问题，或者想要添加新的功能，请提交一个 pull 请求。

## 许可证

本组件采用 MIT 许可证。请查看 LICENSE 文件以获取更多信息。

## github 仓库

欢迎下载使用 更个性化适配自己的场景
https://github.com/GiantAxeWhy/vue3-tool-box
