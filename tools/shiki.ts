import stripJsonComments from 'strip-json-comments'
import { fileURLToPath } from 'node:url'
import decompress from 'decompress'
import fs from 'node:fs/promises'
import path from 'node:path'
import os from 'node:os'

interface Theme {
  themes: {
    name: string
    id: string
  }[]
  publisher: string
  extension: string
}

let themes: {
  [key: string]: Theme
} = {
  github: {
    themes: [
      { name: 'GitHub Light Default', id: 'github-light' },
      { name: 'GitHub Dark Default', id: 'github-dark' },
    ],
    extension: 'github-vscode-theme',
    publisher: 'GitHub',
  },
  gruvbox: {
    themes: [
      { name: 'Gruvbox Dark Hard', id: 'gruvbox-dark' },
      { name: 'Gruvbox Light Hard', id: 'gruvbox-light' },
    ],
    publisher: 'jdinhlife',
    extension: 'gruvbox',
  },
  drakula: {
    themes: [{ name: 'Dracula', id: 'dracula' }],
    publisher: 'dracula-theme',
    extension: 'theme-dracula',
  },
}

let __filename = fileURLToPath(import.meta.url)
let __dirname = path.dirname(__filename)

let getTheme = async ([name, theme]: [string, Theme]) => {
  let { themes: themesData, publisher, extension } = theme
  let vsUrl = `https://open-vsx.org/api/${publisher}/${extension}`
  let vsResponse = await fetch(vsUrl)
  let vsJson = await vsResponse.json()
  let vslxUrl: string = vsJson.downloads.universal
  let vslxResponse = await fetch(vslxUrl)
  let arrayBuffer = await vslxResponse.arrayBuffer()
  let buffer = Buffer.from(arrayBuffer)
  let tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), name))
  await decompress(buffer, tmpDir)
  let packageJsonBuffer = await fs.readFile(
    path.join(tmpDir, 'extension', 'package.json'),
  )
  let packageJson = JSON.parse(packageJsonBuffer.toString())
  let extensionThemes: {
    uiTheme: string
    label: string
    path: string
  }[] = packageJson.contributes.themes
  await Promise.all(
    themesData.map(async ({ name: themeName, id }) => {
      let extensionTheme = extensionThemes.find(
        ({ label }) => label === themeName,
      )
      if (extensionTheme) {
        let themePath = path.join(tmpDir, 'extension', extensionTheme.path)
        let themeBuffer = await fs.readFile(themePath)
        let themeDir = path.join(__dirname, '..', 'themes')
        await fs.mkdir(themeDir, { recursive: true })
        await fs.writeFile(
          path.join(themeDir, `${id}.json`),
          stripJsonComments(themeBuffer.toString()),
        )
      }
    }),
  )
  await fs.rm(tmpDir, { recursive: true })
}

Promise.all(Object.entries(themes).map(getTheme))
