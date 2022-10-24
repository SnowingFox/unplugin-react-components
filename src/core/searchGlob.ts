import fs from 'fs'
import fg from 'fast-glob'
import { parse } from '@babel/parser'
import type { BaseNode } from 'estree-walker'
import { walk } from 'estree-walker'
import type { Node } from '@babel/types'
import type { Components, ComponentsContext } from '../types'

export function searchGlob(): Components {
  const files = fg.sync(['**/**.tsx', '**/**.jsx'])

  const components: Components = new Set()

  for (const file of files) {
    const code = fs.readFileSync(file, { encoding: 'utf-8' })

    const program = parse(code, {
      sourceType: 'module',
      plugins: [
        'typescript',
        'jsx',
      ],
    }) as BaseNode
    walk(program, {
      enter(nodes) {
        const node = nodes as unknown as Node
        let name = ''
        let type: ComponentsContext['type'] = 'Declaration'

        /*
          const A = () => (
              <div>1</div>
          )
        */
        if (
          node.type === 'VariableDeclaration'
          && (
            (node.declarations[0].init?.type === 'ArrowFunctionExpression'
              && node.declarations[0].init?.body?.type === 'JSXElement')
          )
        ) {
          type = 'Declaration'
          name = (node.declarations.find(item => item.type === 'VariableDeclarator' && item.id.type === 'Identifier')!.id as any).name
        }
        else if (
          node.type === 'FunctionDeclaration'
          && node.body.type === 'BlockStatement'
          && node.body.body.find(item => item.type === 'ReturnStatement' && item.argument?.type === 'JSXElement')
        ) {
          name = node.id?.name || ''
          type = 'Declaration'
        }
        else if (node.type === 'ExportDefaultDeclaration') {
          if (
            node.declaration.type === 'FunctionDeclaration'
            && node.declaration.body.body.find(item => item.type === 'ReturnStatement' && item.argument?.type === 'JSXElement')
          ) {
            name = (node.declaration as any).id.name
            type = 'ExportDefault'
          }
          /*
          const A = () => (
              <div>1</div>
          )
          export default A
          */
          else if (node.declaration.type === 'Identifier') {
            const exportedName = node.declaration?.name
            const component = Array.from(components).find(item => item.name === exportedName)
            if (component && component.type === 'Declaration') {
              type = 'ExportDefault'
              name = component.name
            }
          }
        }
        else if (node.type === 'ExportNamedDeclaration') {
          /*
            export function A() {
              return <div>1</div>
            }
          */
          if (
            node.declaration?.type === 'FunctionDeclaration'
            && node.declaration.body.type === 'BlockStatement'
            && node.declaration.body.body.find(item => item.type === 'ReturnStatement' && item.argument?.type === 'JSXElement')
          ) {
            name = node.declaration.id?.name || ''
            type = 'Export'
          }
          else if (node.declaration?.type === 'VariableDeclaration') {
            const declaration = node.declaration.declarations.find(
              item => item.type === 'VariableDeclarator' && item.init?.type === 'ArrowFunctionExpression',
            )
            if (
              declaration && declaration.init?.type === 'ArrowFunctionExpression'
              && declaration.init.body.type === 'BlockStatement'
              && declaration.init.body.body.find(item => item.type === 'ReturnStatement' && item.argument?.type === 'JSXElement')
            ) {
              name = (declaration.id as any).name
              type = 'Export'
            }
          }
        }

        if (name?.length) {
          components.add({
            name,
            path: `/${file}`,
            type,
          })
        }
      },
    })
  }

  return new Set(Array.from(components).filter(item => item.type !== 'Declaration'))
}
