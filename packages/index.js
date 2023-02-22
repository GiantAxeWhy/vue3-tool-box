import vertifySlide from "./vertify-slide";

//按需引入
export { vertifySlide };

const components = [vertifySlide];

const install = (App) => {
  components.forEach((item) => {
    App.component(item.__name, item);
  });
};

export default {
  install,
};
