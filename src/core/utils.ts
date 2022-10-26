import type { ComponentsContext, ExportType, ImportInfo, Options } from '../types'

export const isExportComponent = (component: ComponentsContext | ExportType) =>
  typeof component === 'string' ? component === 'Export' : component.type === 'Export'

/**
 * Replace backslash to slash
 */
export function slash(str: string) {
  return str.replace(/\\/g, '/')
}

export function stringifyImport(info: ImportInfo | string) {
  if (typeof info === 'string')
    return `import '${info}'`
  else if (info.name && info.as)
    return `import { ${info.name} as ${info.as} } from '${info.from}'`
  else if (info.name)
    return `import { ${info.name} } from '${info.from}'`
  else
    return `import ${info.default} from '${info.from}'`
}

export function resolveOptions(options: Options = {}): Required<Options> {
  return {
    rootDir: options.rootDir || process.cwd(),
    dts: false,
    include: [/\.[j|t]sx$/],
    exclude: [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
    resolvers: options.resolvers || [],
    ...options,
  }
}
