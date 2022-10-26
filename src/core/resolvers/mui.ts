import { importModule } from 'local-pkg'
import type { MuiResolverOptions, ResolverComponent, ResolverReturnType } from '../../types'
import { isCapitalCase } from '../utils'

let pkgs: any = null
let components: ResolverReturnType

export async function MuiResolver(options: MuiResolverOptions): Promise<ResolverComponent> {
  const { suffix = 'Mui' } = options

  if (!pkgs) {
    pkgs = await importModule('@mui/material')

    components = Object.keys(pkgs)
      .filter(item => isCapitalCase(item))
      .map(item => ({
        name: `${typeof suffix === 'string' ? suffix : ''}${item}`,
        from: '@mui/material',
        type: 'Export',
      }))
  }

  return () => components
}
