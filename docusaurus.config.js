// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Github Actions TH',
  tagline: 'คู่มือทำ CI/CD ด้วย GitHub Actions สำหรับคนไทย',
  url: 'https://github-actions-th.thadaw.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'mildronize', // Usually your GitHub org/user name.
  projectName: 'github-actions-thai', // Usually your repo name.


  // https://www.flaticon.com/packs/kitty-avatars-3
  i18n: {
    defaultLocale: 'th',
    locales: ['th', 'en'],
  },

  plugins: [
    [
      '@docusaurus/plugin-google-gtag',
      {
        trackingID: 'G-DYS0KBXEDD',
        anonymizeIP: true,
      },
    ],
  ],

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
        
      
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'GitHub Actions TH',
        logo: {
          alt: 'GitHub Actions Logo',
          src: 'img/logo.png',
        },
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
          {
            href: 'https://github.com/mildronize/github-actions-thai',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'Docs',
                to: '/docs/about-the-book',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: '.NET Thailand Facebook Group',
                href: 'https://www.facebook.com/groups/1046502542102269',
              },
              // {
              //   label: 'Stack Overflow',
              //   href: 'https://stackoverflow.com/questions/tagged/docusaurus',
              // },
              // {
              //   label: 'Discord',
              //   href: 'https://discordapp.com/invite/docusaurus',
              // },
              // {
              //   label: 'Twitter',
              //   href: 'https://twitter.com/docusaurus',
              // },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Blog',
                to: '/blog',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/mildronize/github-actions-thai',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} GitHub Actions TH, Inc. Built with Docusaurus, <a href="https://creativecommons.org/licenses/by-nc/4.0/">CC BY-NC 4.0</a>`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['powershell'],
      },
    }),
};

module.exports = config;
