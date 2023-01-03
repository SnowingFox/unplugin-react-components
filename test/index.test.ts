import { resolve } from 'path'
import { expect, test } from 'vitest'
import MagicString from 'magic-string'
import { AntdResolver, generateDts, searchGlob, transform } from '../src'
import { slash } from '../src/core/utils'

const rootPath = slash(`${resolve(__dirname)}/fixtures`)
const searchGlobResult = searchGlob({
  rootPath,
})

const id = slash(`${process.cwd()}/test/fixtures/App.tsx`)

const code = `
  import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
  function App() {
    return /*#__PURE__*/_jsxDEV("div", {
      className: "App",
      children: [/*#__PURE__*/_jsxDEV(A, {
        variant: 'contained',
        children: "hi mui"
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 6,
        columnNumber: 7
      }, this), /*#__PURE__*/_jsxDEV(AntProgress, {
        percent: 30
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 7,
        columnNumber: 7
      }, this), /*#__PURE__*/_jsxDEV(A, {}, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 8,
        columnNumber: 7
      }, this), /*#__PURE__*/_jsxDEV(AntTooltip, {
        title: "prompt text",
        children: /*#__PURE__*/_jsxDEV("span", {
          children: "Tooltip will show on mouse enter."
        }, void 0, false, {
          fileName: _jsxFileName,
          lineNumber: 10,
          columnNumber: 9
        }, this)
      }, void 0, false, {
        fileName: _jsxFileName,
        lineNumber: 9,
        columnNumber: 7
      }, this)]
    }, void 0, true, {
      fileName: _jsxFileName,
      lineNumber: 5,
      columnNumber: 5
    }, this);
  }
  _c = App;
  export default App;`

test('test searchGlob', async () => {
  const arr = Array.from(searchGlobResult).map(i => ({ ...i, path: 'searchGlob' }))
  expect(arr).toMatchInlineSnapshot(`
    [
      {
        "name": "A",
        "path": "searchGlob",
        "type": "Export",
      },
      {
        "name": "App",
        "path": "searchGlob",
        "type": "Export",
      },
    ]
  `)
})

test('play with resolver', async () => {
  const transformed = await transform({
    code: new MagicString(code),
    id,
    components: searchGlobResult,
    resolvers: [
      AntdResolver({
        prefix: 'Ant',
      }),
    ],
    local: true,
    rootDir: slash(`${resolve(__dirname)}/fixtures`),
  })

  if (transformed.trim().startsWith('""'))
    transformed.replace('""', '"')

  expect(transformed).toMatchSnapshot()
})

test('ignore local components', async () => {
  expect(await transform({
    code: new MagicString(code),
    id,
    components: searchGlobResult,
    local: false,
    rootDir: slash(`${resolve(__dirname)}/fixtures`),
    resolvers: [
      AntdResolver(),
    ],
  })).toMatchSnapshot()
})

test('generate components.d.ts', async () => {
  const dts = await generateDts({
    components: searchGlobResult,
    filename: 'components',
    local: true,
    rootPath,
    resolvers: [],
  })

  expect(dts).toMatchSnapshot()
})
