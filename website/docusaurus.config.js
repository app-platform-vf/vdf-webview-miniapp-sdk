const { themes } = require("prism-react-renderer");

const REPO_BASE = "/vdf-webview-miniapp-sdk";

/** @type {import('@docusaurus/types').Config} */
module.exports = {
  title: "VDF WebView MiniApp SDK",
  tagline: "SDK giao tiếp WebView ↔ Native (Android/iOS) qua bridge event",
  url: "https://app-platform-vf.github.io",
  baseUrl: `${REPO_BASE}/docs/`,
  trailingSlash: true,
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  i18n: { defaultLocale: "vi", locales: ["vi"] },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/", // docs là gốc của /docs/
        },
        blog: false,
        theme: { customCss: require.resolve("./src/css/custom.css") },
      }),
    ],
  ],

  themeConfig: {
    navbar: {
      title: "vdf-webview-miniapp-sdk",
      items: [
        { to: "/", label: "Docs", position: "left" },
        { href: `${REPO_BASE}/docs/reference/`, label: "API Reference", position: "left" },
        { href: `${REPO_BASE}/demo/`, label: "Demos", position: "left" },
        { href: "https://www.npmjs.com/package/vdf-webview-miniapp-sdk", label: "npm", position: "right" },
      ],
    },
    prism: { theme: themes.github, darkTheme: themes.dracula },
  },
};
