import path from 'path'
import { getBrands } from './brand'
import { buildTokens } from './build'
import { registerFilter, registerFormat } from './config'
import { BuildPath, StyleOptions } from './types'

registerFilter()
registerFormat()

getBrands().map(async (current) => {
  const buildPath: BuildPath = {
    css: path.join('dist', 'css', current.dest, path.sep),
    scss: path.join('dist', 'scss', current.dest, path.sep)
  }
  
  await buildTokens({ current, buildPath })
})
