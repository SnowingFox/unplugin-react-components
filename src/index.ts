import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import { createFilter } from '@rollup/pluginutils'
import type { GenerateDtsOptions, Options, TransformOptions } from './types'
import { changeREOnBuildStart, transform } from './core/transformer'
import { searchGlob } from './core/searchGlob'
import { generateDts } from './core/generateDts'
import { resolveOptions } from './core/utils'

export * from './core/resolvers'
export * from './core/generateDts'
export * from './core/resolvers/index'
export * from './core/searchGlob'
export * from './core/transformer'

export default createUnplugin<Options>((options = {}) => {
  options = resolveOptions(options)

  const filter = createFilter(
    options.include || [/\.[j|t]sx$/],
    options.exclude || [/[\\/]node_modules[\\/]/, /[\\/]\.git[\\/]/],
  )
  const searchGlobResult = searchGlob({ rootPath: (options.dts as any)?.rootPath || options.rootDir! })
  const dtsOptions = {
    components: searchGlobResult,
    filename: (options.dts as GenerateDtsOptions)?.filename || 'components',
    rootPath: (options.dts as GenerateDtsOptions)?.rootPath || options.rootDir!,
    local: options.local,
    resolvers: options.resolvers,
  } as GenerateDtsOptions

  if (options.dts === true)
    generateDts({ ...dtsOptions })
  else if (typeof options.dts === 'object')
    generateDts({ ...dtsOptions, ...options.dts })

  return {
    name: 'unplugin-react-components',
    transformInclude(id) {
      return filter(id)
    },
    async transform(code, id) {
      const context: TransformOptions = {
        code: new MagicString(code),
        components: searchGlobResult,
        rootDir: options.rootDir!,
        resolvers: options.resolvers!,
        local: options.local!,
        mode: options.mode!,
        id,
      }

      return await transform(context)
    },
    buildStart() {
      if (options.mode === 'prod')
        changeREOnBuildStart()
    },
  }
})
