import type { PluginOption } from 'vite'
import MagicString from 'magic-string'

const reactComponentRE = /_jsxDEV\(([^"][^React\.]\w+)/g

export function UnpluginReactComponents(): PluginOption {
  const components = []

  return {
    name: 'unplugin-react-components',
    transform(source, id) {
      if (!/\.[j|t]sx$/.test(id)) 
        return source

      const code = new MagicString(source)

      components.push(...Array.from(code.original.matchAll(reactComponentRE)).map(item => item[1]))

      console.log(components);
    }
  }
}
