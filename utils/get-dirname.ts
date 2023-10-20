import path from 'node:path'
import url from 'node:url'

export let getDirname = () => {
  let filename = url.fileURLToPath(import.meta.url)
  return path.dirname(filename)
}
