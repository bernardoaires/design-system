import sd from 'style-dictionary'
import { registerConfig } from './config'
import { BuildConfig } from './types'

export const buildTokens = async ({ current, buildPath }: BuildConfig) => {
  const styleDictionary = sd.extend(
    registerConfig({
      current,
      buildPath
    })
  )

  styleDictionary.buildAllPlatforms()
}
