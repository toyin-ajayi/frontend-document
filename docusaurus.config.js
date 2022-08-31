// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const sidebarTransform = require("./src/utils/sidebarTransform");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "JcJian's fontend document",
  tagline: "构建前端知识体系",
  url: "https://www.qwerasd.fun/",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/logo.jpeg",

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: "jianjiacheng", // Usually your GitHub org/user name.
  projectName: "fontend-document", // Usually your repo name.

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: "zh-Hans",
    locales: ["zh-Hans"],
  },

  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/jianjiachenghub/fontend-document/tree/main/",
          async sidebarItemsGenerator({
            defaultSidebarItemsGenerator,
            ...args
          }) {
            const sidebarItems = await defaultSidebarItemsGenerator({
              ...args,
            });
            // console.log('1111', sidebarItems)
            sidebarTransform(sidebarItems);
            return sidebarItems;
          },
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            "https://github.com/jianjiachenghub/fontend-document/tree/main/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      algolia: {
        // Algolia 提供的应用 ID
        appId: 'NVPHZD3LTK',
        //  公开 API 密钥：提交它没有危险
        apiKey: 'fc538fc0538006cd18547e92871b04f9',
        indexName: 'jcjian',
        // 可选：见下文
        contextualSearch: true,
        // 可选：搜索页面的路径，默认启用（可以用 `false` 禁用）
        searchPagePath: 'search',
      },
      docs: {
        sidebar: {
          autoCollapseCategories: true,
        },
      },
      navbar: {
        title: "JcJian",
        logo: {
          alt: "Logo",
          src: "img/logo.jpeg",
        },
        items: [
          {
            to: "blog",
            label: "博客",
            position: "left",
          },
          ...require("./src/utils/files.js").navbars,
          {
            href: "https://github.com/jianjiachenghub/fontend-document",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Community",
            items: [
              {
                label: "segmentfault",
                href: "https://segmentfault.com/u/ipromise/articles?sort=votes",
              },
            ],
          },
          {
            title: "More",
            items: [
              {
                label: "GitHub",
                href: "https://github.com/jianjiachenghub/",
              },
              {
                label: "Blog",
                to: "/blog",
              }
            ],
          },
        ],
        // copyright: `Copyright © ${new Date().getFullYear()} My Project, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
