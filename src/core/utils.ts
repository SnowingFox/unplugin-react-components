import type { ComponentsContext } from '../types'

export const isExportComponent = (component: ComponentsContext) => component.type === 'Export'

export const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean'
