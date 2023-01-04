import type { BaseResolverOptions } from '../../types'
import { createResolver } from './createResolver'

interface Options extends BaseResolverOptions { }

export const AntdV5Resolver = createResolver<Options>({
  module: 'antd',
  prefix: 'Ant',
  style: false,
})
