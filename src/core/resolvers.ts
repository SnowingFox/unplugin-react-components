import type { ResolverReturnType, Resolvers } from '../types'

export const resolversType = new Set<ResolverReturnType>()

export const getResolversResult = async (resolvers: Resolvers) => {
  for (const item of resolvers) {
    const fn = await item
    resolversType.add(fn())
  }

  return resolversType
}
