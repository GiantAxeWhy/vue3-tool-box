import VertifySlide from "./src/vertify-slide.vue";

VertifySlide.install = (App) => {
  App.component(VertifySlide.name, VertifySlide);
};

export default VertifySlide;
