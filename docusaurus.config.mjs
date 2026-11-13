/** @type {import('@docusaurus/types').Config} */
const socialNavbarItems = [
  {
    href: 'https://github.com/DhawalShankar/golang4all',
    label: 'GitHub',
    icon:
      '<path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.85 10.9.58.1.79-.25.79-.55 0-.27-.01-.99-.02-1.94-3.19.69-3.86-1.54-3.86-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.75 1.18 1.75 1.18 1.02 1.75 2.67 1.24 3.32.95.1-.74.4-1.24.73-1.53-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18A11.1 11.1 0 0 1 12 6.35c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.06.78 2.14 0 1.54-.01 2.78-.01 3.16 0 .3.21.66.8.55A11.5 11.5 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5"/>',
  },
  {
    href: 'https://www.linkedin.com/company/golangforall/',
    label: 'LinkedIn',
    icon:
      '<path fill="currentColor" d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12Zm1.78 13.02H3.56V9h3.56v11.45ZM22.22 0H1.78C.8 0 0 .77 0 1.73v20.54C0 23.23.8 24 1.78 24h20.44c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/>',
  },
  {
    href: 'https://instagram.com/golangforall',
    label: 'Instagram',
    icon:
      '<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="18" cy="6" r="1.25" fill="currentColor"/>',
  },
  {
    href: 'https://x.com/golangforall',
    label: 'X',
    icon:
      '<path fill="currentColor" d="M18.9 1.15h3.68l-8.04 9.2L24 23.16h-7.4l-5.8-7.58-6.64 7.58H.47l8.6-9.79L0 1.15h7.59l5.24 6.93Zm-1.29 19.44h2.04L6.43 3.29H4.24Z"/>',
  },
].map(({href, label, icon}) => ({
  type: 'html',
  className: 'navbar-social-item',
  position: 'right',
  value: `<a class="navbar__link navbar-social-link" href="${href}" aria-label="${label}" title="${label}" target="_blank" rel="noopener noreferrer"><svg class="navbar-social-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icon}</svg></a>`,
}));

const config = {
  title: 'GolangForAll',
  favicon: 'img/favicon.ico',
  url: 'https://golangforall.in',
  baseUrl: '/',

  headTags: [
    {
      tagName: 'script',
      attributes: {
        async: true,
        src: 'https://www.googletagmanager.com/gtag/js?id=G-RQWQW3BSZB',
      },
    },
    {
      tagName: 'script',
      attributes: {},
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-RQWQW3BSZB');
      `,
    },
  ],

  onBrokenLinks: 'warn',
  onBrokenAnchors: 'warn',
  onBrokenMarkdownLinks: 'warn',

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        indexDocs: true,
        indexPages: true,
        indexBlog: false,
        searchBarPosition: 'right',
      },
    ],
  ],

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          sidebarPath: './sidebars.js',
        },
        blog: false,
        pages: {},
        theme: {
          customCss: './src/css/custom.css',
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'GolangForAll',
      logo: {
        alt: 'GolangForAll Logo',
        src: 'img/logo.png',
      },

      items: [
        {
          to: '/about',
          label: 'About',
          position: 'left',
        },
        {
          to: '/blog',
          label: 'Blog',
          position: 'left',
        },
        {
          to: '/docs/intro',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://golab.golangforall.in',
          label: 'GoLab',
          position: 'left',
        },
        ...socialNavbarItems,
      ],
    },

    footer: {
      style: 'dark',
      links: [
        {
          title: 'Explore',
          items: [
            {label: 'Home', to: '/'},
            {label: 'Docs', to: '/docs/intro'},
            {label: 'Blog', to: '/blog'},
            {label: 'About', to: '/about'},
          ],
        },
        {
          title: 'Community',
          items: [
            {label: 'Meetups', to: '/docs/meetups'},
            {
              label: 'WhatsApp channel',
              href: 'https://whatsapp.com/channel/0029VbDoRp9JP214yrRcCS2I',
            },
            {
              label: 'WhatsApp group',
              href: 'https://chat.whatsapp.com/G642UWUIanCJjF8jzavUPA',
            },
            {label: 'Meet the founder', href: 'https://thewittyswan.space'},
            {
              label: '🍎 Buy me an apple',
              href: 'https://rzp.io/rzp/U6FewHU',
            },
          ],
        },
        {
          title: 'Follow GolangForAll',
          items: [
            {label: 'Instagram', href: 'https://instagram.com/golangforall'},
            {label: 'X', href: 'https://x.com/golangforall'},
            {label: 'YouTube', href: 'https://youtube.com/@golangforall'},
            {
              label: 'GitHub',
              href: 'https://github.com/DhawalShankar/golang4all',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/golangforall/',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} GolangForAll. Learn. Build. Share. Meet.`,
    },
  },
};

export default config;