import type MagicString from 'magic-string'
import type { FilterPattern } from '@rollup/pluginutils'

export interface Options {
  /**
   * Provide path which will be transformed
   *
   * @default process.cwd()
   */
  rootDir?: string

  /**
   * Should generate d.ts file
   *
   * @default false
   */
  dts?: boolean | Partial<Omit<GenerateDtsOptions, 'components'>>

  /**
   * Should generate d.ts file
   *
   * @default true
   */
  local?: boolean

  /**
   * RegExp or glob to match files to be transformed
   */
  include?: FilterPattern

  /**
   * RegExp or glob to match files to NOT be transformed
   */
  exclude?: FilterPattern

  /**
   * Pass a custom function to resolve the component importing path from the component name.
   *
   */
  resolvers?: Resolvers

  /*
  * decide is dev or prod mode so that can right to parse react code.
  *
  * @default 'dev'
  */
  mode?: 'dev' | 'prod'
}

export interface ImportInfo {
  as?: string
  name?: string
  default?: string
  from: string
}

export type ExportType = 'Export' | 'ExportDefault'

export interface ComponentsContext {
  name: string
  path: string
  type: ExportType | 'Declaration'
}

export interface ResolverReturnType {
  name: string
  from: string
  type: ExportType
  originalName: string
  style?: string
}

export type ResolverComponent = () => ResolverReturnType[] | Promise<ResolverReturnType[]>

export type Resolvers = Promise<ResolverComponent>[] | ResolverComponent[]

export type Components = Set<ComponentsContext>

export interface TransformOptions {
  id: string
  code: MagicString
  components: Components
  rootDir: string
  resolvers: Resolvers
  local: boolean
}

export interface GenerateDtsOptions {
  components: Components
  rootPath: string
  filename: string
  resolvers: Resolvers
  local: boolean
}

export interface SearchGlobOptions {
  rootPath: string
}

export interface BaseResolverOptions {
  prefix?: boolean | string
}
