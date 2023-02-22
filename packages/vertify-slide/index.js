import vertify from "./src/scrollDemo.vue";

vertify.install = (App) => {
  App.component(vertify.__name, vertify);
};

export default vertify;
