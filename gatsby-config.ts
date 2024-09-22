import type { GatsbyConfig } from "gatsby";

const config: GatsbyConfig = {
  siteMetadata: {
    siteUrl: `https://vn.699.ooo`, // 网站基础 URL
    title: `freely`, // 网站标题
    description: `This is a sample text over a video background.`,
    author: `@freely`,
  },
  // 自动生成 GraphQL 类型，生成类型文件的路径
  graphqlTypegen: {
    typesOutputPath: `src/gatsby-types.d.ts`,
    documentSearchPaths: [`./src/**/*.{ts,tsx}`],
  },
  plugins: [
    `gatsby-plugin-typescript`, // 添加 TypeScript 支持
    {
      resolve: `gatsby-source-filesystem`, // 加载静态资源
      options: {
        name: `images`,
        path: `${__dirname}/src/images`, // 图像文件的路径
      },
    },
    {
      resolve: `gatsby-source-filesystem`, // 加载视频文件
      options: {
        name: `videos`,
        path: `${__dirname}/src/images`, // 视频文件路径
      },
    },
    `gatsby-transformer-sharp`, // 图像优化工具
    `gatsby-plugin-sharp`, // 提供图像处理的功能
    {
      resolve: `gatsby-plugin-manifest`, // PWA 的 manifest 配置
      options: {
        name: `freely`, // PWA 应用名称
        short_name: `freely`, // 应用的简短名称
        start_url: `/`, // PWA 启动 URL
        background_color: `#ffffff`, // 背景颜色
        theme_color: `#663399`, // 主题颜色
        display: `standalone`, // PWA 的显示模式
        icon: `src/images/gatsby-icon.png`, // 网站图标路径
      },
    },
    `gatsby-plugin-offline`, // PWA 离线支持
    `gatsby-plugin-sass`, // 如果你使用了 Sass/CSS 预处理器，可以启用这个插件
  ],
};

export default config;