// eslint-disable-next-line @typescript-eslint/no-var-requires
const { convertFile } = require('convert-svg-to-png')
import fs from 'fs'
import fse from 'fs-extra'

const createOutputDirSync = (dirPath: fs.PathLike) => {
  if (!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

export const normalizedOutputPath = (sourceFilePath: string) => {
  const outputFilePath = sourceFilePath.replace('src', 'dist').replace('svg', 'png')
  const outputDirArr = outputFilePath.split('/')
  outputDirArr.pop()
  const outputDirPath = outputDirArr.join('/')

  return {
    outputDirPath,
    outputFilePath
  }
}

export const compressFile = (sourceFilePath: string) => {
  const output = normalizedOutputPath(sourceFilePath)
  createOutputDirSync(output.outputDirPath);

  (async () => {
    //COMPRESS SVG FILE TO A TINY BITMAP IMAGE (PNG)
    await convertFile(sourceFilePath, { outputFilePath: output.outputFilePath })
  })()
}

export const copyAssetFile = (sourceFilePath: string) => {
  const output = normalizedOutputPath(sourceFilePath)
  createOutputDirSync(output.outputDirPath)

  fse.copyFileSync(sourceFilePath, output.outputFilePath)
}
