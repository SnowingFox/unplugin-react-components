import type MagicString from 'magic-string'
import type { FilterPattern } from '@rollup/pluginutils'

export interface Options {
  rootDir?: string
  dts?: boolean | Partial<Omit<GenerateDtsOptions, 'components'>>
  /**
   * RegExp or glob to match files to be transformed
   */
  include?: FilterPattern

  /**
   * RegExp or glob to match files to NOT be transformed
   */
  exclude?: FilterPattern
}

export interface ImportInfo {
  name?: string
  default?: string
  from: string
}

export interface ComponentsContext {
  name: string
  path: string
  relativePath: string
  type: 'Export' | 'ExportDefault' | 'Declaration'
}

export type Components = Set<ComponentsContext>

export interface TransformOptions {
  id: string
  code: MagicString
  components: Components
  rootDir: string
}

export interface GenerateDtsOptions {
  components: Components
  rootPath: string
  filename: string
}
