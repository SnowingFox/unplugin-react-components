import path, { isAbsolute, relative } from 'path'
import type { TransformOptions } from '../types'
import { isExportComponent, slash, stringifyImport } from './utils'

const reactComponentRE = /_jsxDEV\(([^"][^React\.]\w+)/g

export function transform(options: TransformOptions) {
  const { code, id, components } = options

  const matches = Array.from(code.original.matchAll(reactComponentRE)).map(item => ({
    name: item[1],
    path: id,
  }))

  const imports = []
  for (const matched of matches) {
    const component = Array.from(components).find(item => item.name === matched.name)
    if (!component)
      continue

    const importedPath = isAbsolute(component.relativePath)
      ? component.relativePath
      : `/${slash(relative(path.resolve(options.rootDir), component.relativePath))}`

    if (isExportComponent(component)) {
      imports.push(stringifyImport({
        name: component.name,
        from: importedPath,
      }))
    }
    else {
      imports.push(stringifyImport({
        default: component.name,
        from: importedPath,
      }))
    }
  }

  code.prepend(`${imports.join('\n')}\n`)

  return code.toString()
}
