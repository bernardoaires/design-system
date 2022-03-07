import path from 'path'
import { getBrands } from './brand'
import { buildTokens } from './build'

getBrands().map(async (current) => {
  const buildPath = {
    css: path.join('dist', 'css', current.dest, path.sep)
  }
  
  await buildTokens({ current, buildPath })
})
