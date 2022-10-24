import fs from 'fs'
import type { GenerateDtsOptions } from '../types'
import { isExportComponent } from './utils'

export function generateDts(options: GenerateDtsOptions) {
  const { components, rootPath } = options

  let dts = 'export {}\ndeclare global{\n'
  components.forEach((component) => {
    dts += `\tconst ${component.name}: typeof import('.${component.path.replace(/\.[tj]sx$/, '')}')['${isExportComponent(component) ? component.name : 'default'}']\n`
  })

  fs.writeFileSync(`${rootPath}/components.d.ts`, `${dts}}`)
}
