import { importModule } from 'local-pkg'
import { isCapitalCase } from '../utils'
import type { BaseResolverOptions, ResolverReturnType } from '../../types'

interface CreateResolverOptions {
  prefix: string
  module: string
  exclude?: (name: string) => boolean
  style?: boolean
}

export function createResolver<T extends BaseResolverOptions = BaseResolverOptions>(
  _options: CreateResolverOptions,
) {
  return async (options: T = {} as T) => {
    let prefix: string | undefined

    if (typeof options.prefix === 'boolean' && options.prefix)
      prefix = 'Ant'
    else if (typeof options.prefix === 'string')
      prefix = options.prefix

    const pkgs = await importModule(_options.module)

    const components: ResolverReturnType[] = Object.keys(pkgs)
      .filter((item) => {
        if (_options.exclude)
          return isCapitalCase(item) && _options.exclude(item)

        return isCapitalCase(item)
      })
      .map((item) => {
        const component: ResolverReturnType = {
          name: `${typeof prefix === 'string' ? prefix : ''}${item}`,
          originalName: typeof prefix === 'string' ? item.replace(prefix, '') : item,
          from: _options.module,
          type: 'Export',
        }

        if (_options.style)
          component.style = `${_options.module}/es/${component.originalName.toLowerCase()}/style/index.css`

        return component
      })

    return () => components
  }
}
