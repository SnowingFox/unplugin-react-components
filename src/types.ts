import type MagicString from 'magic-string'

export interface Options {
  rootDir: string
  dts?: boolean | Omit<GenerateDtsOptions, 'components'>
}

export interface ComponentsContext {
  name: string
  path: string
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
}
