# unplugin-react-components

[![NPM version](https://img.shields.io/npm/v/unplugin-react-components?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-react-components)

## Install

```bash
npm i unplugin-react-components
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Components from 'unplugin-react-components/vite'

export default defineConfig({
  plugins: [
    Components({ /* options */ }),
  ],
})
```

Example: [`playground/`](./playground/)

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Components from 'unplugin-react-components/rollup'

export default {
  plugins: [
    Components({ /* options */ }),
  ],
}
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-react-components/webpack')({ /* options */ })
  ]
}
```

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default {
  buildModules: [
    ['unplugin-react-components/nuxt', { /* options */ }],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-react-components/webpack')({ /* options */ }),
    ],
  },
}
```

<br></details>

<details>
<summary>esbuild</summary><br>

```ts
// esbuild.config.js
import { build } from 'esbuild'
import Components from 'unplugin-react-components/esbuild'

build({
  plugins: [Components()],
})
```

<br></details>

## Usage
Use components in templates as you would usually do, it will import components on demand, and there is no import and component registration required anymore! If you register the parent component asynchronously (or lazy route), the auto-imported components will be code-split along with their parent.

It will automatically turn this

```tsx
export function App() {
  return (
    <CompA />
  )
}
```
into this
```tsx
import { CompA } from './CompA'

export function App() {
  return (
    <CompA />
  )
}
```

## TypeScript
```ts
Components({
  dts: true, // enabled by default if `typescript` is installed
})
```
Once the setup is done, a components.d.ts will be generated and updates automatically with the type definitions. Feel free to commit it into git or not as you want.
> Make sure you also add components.d.ts to your tsconfig.json under include

## Importing from UI Libraries
Use third-party components in your components as you would usually do, it will import components on demand, and there is no import and component registration required anymore!

> At present, the number of UI supported is limited. If you want to provide more UI support, you are welcome to propose PR or you can use custom resolver.

Supported Resolvers:
- [Antd](https://github.com/SnowingFox/unplugin-react-components/blob/master/src/core/resolvers/antd.ts)
- [Mui](https://github.com/SnowingFox/unplugin-react-components/blob/master/src/core/resolvers/mui.ts)

```ts
import { AntdResolver, MuiResolver } from 'unplugin-react-components'

Components({
  resolvers: [
    AntdResolver(),
    MuiResolver()
  ],
})
```

## Custom Resolver
```ts
Components({
  resolvers: [
    () => [
      /**
       * in App.tsx
       * import { Form } from 'formik'
       *
       * in components.d.ts
       * const MikForm: typeof import('formik')['Form']
       *
       * **/
      { name: 'MikForm',  from: 'formik', type: 'Export', orignalName: 'Form' }
      /**
       * in App.tsx
       * import XXX from 'ui'
       *
       * in components.d.ts
       * const Component: typeof import('ui')['default']
       *
       * **/
      { name: 'Component',  from: 'ui', type: 'ExportDefault', orignalName: 'XXX' }
    ]
  ],
})
```
