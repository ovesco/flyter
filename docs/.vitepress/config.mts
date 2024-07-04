import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "flyter",
  // @ts-ignore
  base: process.env.NODE_ENV === "production" ? "/flyter/" : undefined,
  description: "The flyter library documentation",
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/guide/getting-started" },
    ],

    sidebar: [
      {
        text: "Introduction",
        items: [
          { text: "Getting Started", link: "/guide/getting-started" },
          { text: "API", link: "/guide/api" },
        ],
      },
      {
        text: "Configuration",
        items: [
          { text: "Configuration", link: "/config/configuration" },
          { text: "Server Handler", link: "/config/server-handler" },
          { text: "Type and Renderer", link: "/config/type-and-renderer" },
          { text: "Hooks and callbacks", link: "/config/callbacks" },
          { text: "Templates", link: "/config/templates" },
          { text: "Buttons", link: "/config/buttons" },
        ],
      },
      {
        text: "Extending Flyter",
        items: [
          { text: "Custom Renderer", link: "/extending/renderer" },
          { text: "Custom Type", link: "/extending/type" },
          { text: "Theming", link: "/extending/theme" },
        ],
      },
      {
        text: "Examples",
        items: [
          {
            text: "Creating an Instance",
            link: "/examples/creating-an-instance",
          },
          { text: "Attaching to Target", link: "/examples/attach-to-target" },
          { text: "Tailwind Theme", link: "/examples/tailwindcss-theme" },
          { text: "Datepicker Type", link: "/examples/datepicker-type" },
          { text: "Usage with Vue", link: "/examples/usage-with-vue" },
          { text: "Usage with Alpine", link: "/examples/usage-with-alpine" },
        ],
      },
    ],
    socialLinks: [{ icon: "github", link: "https://github.com/ovesco/flyter" }],
  },
});
