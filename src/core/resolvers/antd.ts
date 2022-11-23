import type { BaseResolverOptions } from '../../types'
import { createResolver } from './createResolver'

interface Options extends BaseResolverOptions {

}

export const AntdResolver = createResolver<Options>({
  module: 'antd',
  prefix: 'Ant',
  style: true,
})

