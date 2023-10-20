import * as Figma from 'figma-api'
import fs from 'node:fs/promises'
import { optimize } from 'svgo'
import path from 'node:path'

import { getDirname } from '../utils/get-dirname'

interface FigmaPage {
  fileKey: string
  type: string
  ids: string
}

let figmaPages: FigmaPage[] = [
  {
    fileKey: '4z2OIRRbvD1GwIdFQLswY4',
    type: 'base',
    ids: '1:2',
  },
  {
    fileKey: '4z2OIRRbvD1GwIdFQLswY4',
    type: 'files',
    ids: '1:3',
  },
  {
    fileKey: '4z2OIRRbvD1GwIdFQLswY4',
    type: 'folders',
    ids: '1:4',
  },
]

let api = new Figma.Api({
  personalAccessToken: process.env.FIGMA_ACCESS_TOKEN!,
})

let dirname = getDirname()

export let getIcons = async ({ fileKey, type, ids }: FigmaPage) => {
  let { nodes } = await api.getFileNodes(fileKey, [ids])
  let document = nodes[ids]?.document as Figma.DOCUMENT

  let icons = document.children.reduce(
    (accumulator: { name: string; id: string }[], { name, id }) =>
      name !== 'unknown' ? [...accumulator, { name, id }] : accumulator,
    [],
  )

  let { images } = await api.getImage(fileKey, {
    ids: icons.map(({ id }) => id).join(','),
    format: 'svg',
    scale: 1,
  })

  let iconPath = path.join(dirname, '..', 'icons', type)
  await fs.mkdir(iconPath, { recursive: true })

  await Promise.all(
    icons.map(async icon => {
      let iconUrl = images[icon.id]

      if (iconUrl) {
        let response = await fetch(iconUrl)
        let image = await response.text()
        await fs.writeFile(
          path.join(iconPath, `${icon.name}.svg`),
          optimize(image, {
            plugins: ['preset-default', 'removeDimensions'],
          }).data,
        )
      }
    }),
  )
}

Promise.all(figmaPages.map(getIcons))
