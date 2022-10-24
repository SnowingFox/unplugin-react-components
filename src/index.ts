import { createUnplugin } from 'unplugin'
import MagicString from 'magic-string'
import type { Options, TransformOptions } from './types'
import { transform } from './core/transform'
import { searchGlob } from './core/searchGlob'
import { generateDts } from './core/generateDts'

export default createUnplugin<Options>((options) => {
  const searchGlobResult = searchGlob()

  if (options.dts === true)
    generateDts({ rootPath: options.rootDir, components: searchGlobResult })
  else if (typeof options.dts === 'object')
    generateDts({ ...options.dts, components: searchGlobResult })

  return {
    name: 'unplugin-react-components',
    transformInclude(id) {
      return /\.[j|t]sx$/.test(id)
    },
    async transform(code, id) {
      const context: TransformOptions = {
        code: new MagicString(code),
        components: searchGlobResult,
        rootDir: options.rootDir,
        id,
      }
      return transform(context)
    },
  }
})
