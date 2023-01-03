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
  expect(await transform({
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
  })).toMatchInlineSnapshot(`
    "import { A as _unplugin_react_A_0 } from 'D:/Dev/unplugin/unplugin-react-components/test/fixtures/A.tsx'
    import { Progress as _unplugin_react_Progress_1 } from 'antd'
    import 'antd/es/progress/style/index.css'
    import { Tooltip as _unplugin_react_Tooltip_2 } from 'antd'
    import 'antd/es/tooltip/style/index.css'

      import { jsxDEV as _jsxDEV } from \\"react/jsx-dev-runtime\\";
      function App() {
        return /*#__PURE__*/_jsxDEV(\\"div\\", {
          className: \\"App\\",
          children: [/*#__PURE__*/_jsxDEV(_unplugin_react_A_0, {
            variant: 'contained',
            children: \\"hi mui\\"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 6,
            columnNumber: 7
          }, this), /*#__PURE__*/_jsxDEV(_unplugin_react_Progress_1, {
            percent: 30
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 7,
            columnNumber: 7
          }, this), /*#__PURE__*/_jsxDEV(_unplugin_react_A_0, {}, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 8,
            columnNumber: 7
          }, this), /*#__PURE__*/_jsxDEV(_unplugin_react_Tooltip_2, {
            title: \\"prompt text\\",
            children: /*#__PURE__*/_jsxDEV(\\"span\\", {
              children: \\"Tooltip will show on mouse enter.\\"
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
      export default App;"
  `)
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
