import preprocess from 'svelte-preprocess';
import adapter from '@sveltejs/adapter-static';
/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    // hydrate the <div id="svelte"> element in src/app.html
    target: '#svelte',
    adapter: adapter({
      // default options are shown
      pages: 'build',
      assets: 'build',
      fallback: null,
    }),
    vite: {
      css: {
        preprocessorOptions: {
          scss: {
            additionalData: '@import "src/variables.scss";',
          },
        },
      },
      optimizeDeps: {
        exclude: ['@urql/svelte'],
      },
    },
  },

  preprocess: [
    preprocess({
      scss: {
        prependData: '@import "src/variables.scss";',
      },
    }),
  ],
};

export default config;
