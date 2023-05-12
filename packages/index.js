import VertifySlide from "./VertifySlide";
import waterMark from "./waterMark.vue";
//按需引入
export { VertifySlide };
export { waterMark };
const components = [VertifySlide, waterMark];

const install = (App) => {
  components.forEach((item) => {
    App.component(item.name, item);
  });
};

export default {
  install,
};
