import type { TransformOptions } from '../types'

const reactComponentRE = /_jsxDEV\(([^"][^React\.]\w+)/g

export function transform(options: TransformOptions) {
  const { code, id, components } = options

  const matches = Array.from(code.original.matchAll(reactComponentRE)).map(item => ({
    name: item[1],
    path: `${id.replace(options.rootDir.replaceAll('\\', ''), '')}`,
  }))

  const imports = []
  for (const matched of matches) {
    const component = Array.from(components).find(item => item.name === matched.name)
    if (!component)
      continue

    imports.push(`import ${component.type === 'Export' ? `{ ${component.name} }` : `${component.name}`} from "${component.path}";`)
  }

  code.prepend(imports.join('\n'))

  return code.toString()
}
