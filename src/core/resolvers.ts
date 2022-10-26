import type { ResolverReturnType, Resolvers } from '../types'

export const resolversType = new Set<ResolverReturnType[]>()

export const getResolversResult = async (resolvers: Resolvers) => {
  if (!resolvers)
    return

  for (const item of resolvers) {
    const fn = await item
    if (typeof fn === 'function')
      resolversType.add((fn as any)())
    else
      resolversType.add(fn)
  }

  return resolversType
}

