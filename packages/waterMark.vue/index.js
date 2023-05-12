import waterMark from "./src/waterMark.vue";

waterMark.install = (App) => {
  App.component(waterMark.name, waterMark);
};

export default waterMark;
