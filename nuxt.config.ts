import NuxtConfiguration from '@nuxt/config'

const env: NuxtConfiguration['env'] = {

}

const modules: NuxtConfiguration['modules'] = [
  // Docs: https://github.com/nuxt-community/dotenv-module
  '@nuxtjs/dotenv',

  [
    'bootstrap-vue/nuxt',
    {
      bootstrapCSS: false,
      bootstrapVueCSS: false
    }
  ],

  [
    '@nuxtjs/style-resources',
    {
      scss: [
        '@/assets/scss/_variables.scss'
      ]
    }
  ]
]

const build: NuxtConfiguration['build'] = {

}

const head: NuxtConfiguration['head'] = {
  title: '',
  meta: [
    {
      charset: 'utf-8'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1'
    },
    {
      hid: 'description',
      name: 'description',
      content: ''
    }
  ],
  link: [
    // {
    //   rel: 'icon',
    //   type: 'image/x-icon', href: '/favicon.ico'
    // }
  ]
}

const plugins: NuxtConfiguration['plugins'] = [
  { ssr: false, src: '~/plugins/vue-skyicons.ts' }
]

const config: NuxtConfiguration = {
  env,
  head,
  modules,
  build,
  plugins,
  loading: {
    color: '#3B8070'
  },
  css: [
    '~assets/scss/app.scss'
  ]
}

export default config
