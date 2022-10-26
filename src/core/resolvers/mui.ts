import type { BaseResolverOptions } from '../../types'

import { createResolver } from './createResolver'

interface MuiResolverOptions extends BaseResolverOptions {
}

export const MuiResolver = createResolver<MuiResolverOptions>({
  module: '@mui/material',
  prefix: 'Mui',
  exclude: name => name !== 'FormLabelRoot',
})
