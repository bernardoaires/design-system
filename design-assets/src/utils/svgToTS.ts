/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs'
import path from 'path'
import fse from 'fs-extra'

interface Config {
  input: string,
  output: string,
  scale?: number
}

const specialCharactherRegex = /[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/gi

const matchSpecialCharacters = () => {
  return new RegExp(specialCharactherRegex)
}

const normalizeName = (name: string) => {
  const regex = matchSpecialCharacters()
  return !regex.test(name[0]) ? name[0].toUpperCase() + name.slice(1, name.length) : name[1].toUpperCase() + name.slice(2, name.length)
}

const _camelCase = (name: string) => {
  return name.toLowerCase()
    .replace( /[-_]+/g, ' ')
    .replace( /[^\w\s]/g, '')
    .replace( / (.)/g, ($1) => { return $1.toUpperCase() })
    .replace( / /g, '')
}

export const svgToTS =  (config: Config) => {
  const scale = config.scale || 1
  const files = fs.readdirSync(config.input)
  const svgs = []
  const isIcon = config.input.includes('icons')

  for (const file of files) {
    if (file.slice(-4) !== '.svg') continue
    const code = fs.readFileSync(path.join(config.input, file), 'utf-8')
    const size = String(code.match(/viewBox="[^"]+/)).slice(9)
    const name = file.slice(0, -4)

    const svgExpression = /^[^>]+>|<[^<]+$/g

    let body = code.replace(svgExpression, '')
      .replace(/(\r\n|\n|\r)/g, '')

    if (isIcon) {
      body = body.replace(/fill="[^"]+/g, 'fill="currentColor')
    }

    const camelCase = name.replace(/-+./g, (m) => m.slice(-1).toUpperCase())
    const titleCase = camelCase.replace(/./, (m) => m.toUpperCase())
    const [w, h] = size.split(' ').slice(2).map((val: any) => `${(val / scale).toFixed(3)}em`)
    if (!h) throw new Error(`Malformed viewBox in SVG ${file}`)

    svgs.push({
      camelCase,
      titleCase,
      name,
      svg: `<svg viewBox="${size}" class="${name}" width="${w}" height="${h}" aria-hidden="true" focusable="false">${body}</svg>`
    })
  }

  let commonAssetIndex = ''
  let srcAssetIndex = ''
  const svgsList: string[] = []
  let svgTypes = 'import { SvgProps } from \'react-native-svg\'\n\n'

  svgs.forEach(({ svg, name }) => {
    const _name = name.replace(/-/g, '_').toLocaleLowerCase()
    const normalizedName = normalizeName(_camelCase(_name))
    const currentFileContent = `const ${normalizedName} = '${svg}'\nexport default ${normalizedName}`
    commonAssetIndex += `import ${normalizedName} from "./${_name}.ts"\n`
    srcAssetIndex += `import ${normalizedName} from "./${name}.svg"\n`
    svgTypes += `export const ${normalizedName}: React.FC<SvgProps>\n`
    svgsList.push(normalizedName)
    fse.outputFileSync(`${config.output}/${name.replace(/-/g, '_').toLocaleLowerCase()}.ts`, currentFileContent)
  })

  const exportsAssets = `
  export {
    ${svgs.map(svg => normalizeName(_camelCase(svg.name))).join()}
  }
`
  commonAssetIndex += exportsAssets
  srcAssetIndex += exportsAssets

  fse.outputFileSync(`${config.output}/index.ts`, commonAssetIndex)
  fse.outputFileSync(`${config.input}/index.ts`, srcAssetIndex)

  if (svgTypes)
    fse.outputFileSync(`${config.input}/index.d.ts`, svgTypes)
  fse.outputFileSync(`${config.output}/exported-assets-list.ts`, `export default ${JSON.stringify(svgsList)}`)
}
