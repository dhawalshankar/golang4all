/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'GolangForAll',
  favicon: 'img/golangforall-icon.svg',
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
        {
          type: 'dropdown',
          label: 'Connect',
          position: 'right',
          items: [
            {
              label: 'Instagram',
              href: 'https://instagram.com/golangforall',
            },
            {
              label: 'X',
              href: 'https://x.com/golangforall',
            },
            {
              label: 'YouTube',
              href: 'https://youtube.com/@golangforall',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/DhawalShankar/golang4all',
            },
            {
              label: 'LinkedIn',
              href: 'https://www.linkedin.com/company/golangforall/',
            },
            {
              label: 'WhatsApp channel',
              href: 'https://whatsapp.com/channel/0029VbDoRp9JP214yrRcCS2I',
            },
            {
              label: 'WhatsApp group',
              href: 'https://chat.whatsapp.com/G642UWUIanCJjF8jzavUPA',
            },
            {
              label: 'Founder',
              href: 'https://thewittyswan.space',
            },
          ],
        },
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