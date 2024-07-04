import DefaultTheme from "vitepress/theme";
import { h } from "vue";
import HomeComponent from "../../components/HomeComponent.vue";
import "./tailwind.min.css";

export default {
  extends: DefaultTheme,
  // override the Layout with a wrapper component that
  // injects the slots
  Layout() {
    return h(DefaultTheme.Layout, null, {
      "home-hero-image": () => h(HomeComponent),
    });
  },
};
