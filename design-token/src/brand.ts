import path from 'path'
import fs from 'fs'
import { Brand } from './types'

const getDirectories = (dirPath: string) => {
  return fs.readdirSync(path.resolve(__dirname, dirPath)).map(folder => folder)
}

export const getBrands = (): Brand[] => {
  const BRANDS = [{
    source: path.resolve('tokens', 'globals', '**', '*.json'),
    dest: '',
    filename: 'globals',
    brand: '',
    theme: '',
    mode: ''
  }]

  getDirectories(path.resolve('tokens', 'brands')).map(brand => {
    getDirectories(path.resolve('tokens', 'brands', brand)).map(theme => {
      getDirectories(path.resolve('tokens', 'brands', brand, theme)).map(mode => {
        BRANDS.push({
          source: path.resolve('tokens', 'brands', brand, theme, mode, '**', '*.json'),
          dest: path.join(brand, theme),
          filename: mode,
          brand,
          theme,
          mode
        })
        
      })
    })
  })

  return BRANDS
}
