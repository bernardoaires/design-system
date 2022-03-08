import { svgToTS } from './utils/svgToTS'
const assetModuleFolders = ['icons']

assetModuleFolders.forEach(asset => {
  const options = {
    input: `src/assets/${asset}`,
    output: `dist/assets/${asset}`
  }

  svgToTS(options)
})
