import { BuildConfig } from './types'

export const registerConfig = ({ current, buildPath }: BuildConfig) => {
  return {
    'source': [current.source],
    'platforms': {
      'web/css': {
        'transformGroup': 'css',
        'buildPath': buildPath.css,
        'files': [{
          'destination': `${current.filename}.css`,
          'format': 'css/variables'
        }]
      }
    }
  }
}
