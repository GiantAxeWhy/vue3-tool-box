import VertifySlide from "./VertifySlide";

//按需引入
export { VertifySlide };

const components = [VertifySlide];

const install = (App) => {
  components.forEach((item) => {
    App.component(item.name, item);
  });
};

export default {
  install,
};
