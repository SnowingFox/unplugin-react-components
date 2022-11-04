import { resolve } from 'path'
import { readFileSync } from 'fs'
import { expect, test } from 'vitest'
import MagicString from 'magic-string'
import { AntdResolver } from '../src/core/resolvers/antd'
import { slash } from '../src/core/utils'
import { searchGlob } from '../src/core/searchGlob'
import { generateDts, transform } from '../src'

const rootPath = slash(`${resolve(__dirname)}/fixtures`)
const searchGlobResult = searchGlob({
  rootPath,
})
const id = 'D:/Dev/unplugin/unplugin-react-components/test/fixtures/App.tsx'

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
  expect(searchGlobResult).toMatchInlineSnapshot(`
      Set {
        {
          "name": "A",
          "path": "D:/Dev/unplugin/unplugin-react-components/test/fixtures/A.tsx",
          "type": "Export",
        },
        {
          "name": "App",
          "path": "D:/Dev/unplugin/unplugin-react-components/test/fixtures/App.tsx",
          "type": "Export",
        },
      }
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
  })).toMatchSnapshot()
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
  })).toMatchInlineSnapshot(`
    "import { Progress as _unplugin_react_Progress_0 } from 'antd'
    import { Tooltip as _unplugin_react_Tooltip_1 } from 'antd'

      import { jsxDEV as _jsxDEV } from \\"react/jsx-dev-runtime\\";
      function App() {
        return /*#__PURE__*/_jsxDEV(\\"div\\", {
          className: \\"App\\",
          children: [/*#__PURE__*/_jsxDEV(A, {
            variant: 'contained',
            children: \\"hi mui\\"
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 6,
            columnNumber: 7
          }, this), /*#__PURE__*/_jsxDEV(_unplugin_react_Progress_0, {
            percent: 30
          }, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 7,
            columnNumber: 7
          }, this), /*#__PURE__*/_jsxDEV(A, {}, void 0, false, {
            fileName: _jsxFileName,
            lineNumber: 8,
            columnNumber: 7
          }, this), /*#__PURE__*/_jsxDEV(_unplugin_react_Tooltip_1, {
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

test('generate components.d.ts', async () => {
  generateDts({
    components: searchGlobResult,
    filename: 'components',
    local: true,
    rootPath,
    resolvers: [],
  })

  const generated = readFileSync(`${rootPath}/components.d.ts`, { encoding: 'utf-8' })

  expect(generated).toMatchSnapshot()
})
