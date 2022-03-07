import sd from 'style-dictionary'
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
      },
      'web/scss': {
        'transformGroup': 'scss',
        'buildPath': buildPath.scss,
        'files': [{
          'destination': `${current.filename}.scss`,
          'format': 'scss/variables',
          'filter': 'isNotObject'
        }, {
          'destination': 'mixins.scss',
          'format': 'scss/mixin',
          'filter': 'isObject'
        }]
      }
    }
  }
}

export const registerFilter = () => {
  sd.registerFilter({
    name: 'isObject',
    matcher: (token) => {
      return typeof token.value === 'object'
    }
  })
  sd.registerFilter({
    name: 'isNotObject',
    matcher: (token) => {
      return typeof token.value !== 'object'
    }
  })
}

export const registerFormat = () => {
  sd.registerFormat({
    name: 'scss/mixin',
    formatter: ({ dictionary }) => {
      let output = ''
      dictionary.allProperties.map(prop => {
        if(prop.attributes?.category == 'switch'){
					output += `
						@if $type == switch-${prop.attributes.type} {
							transition-duration: ${prop.value.velocity};
							transition-timing-function: ${prop.value.vibe};
						}
					`
				}
				if(prop.attributes?.category == 'spin'){
					output += `
						@if $type == spin-${prop.attributes.type} {
							transition-duration: ${prop.value.velocity};
							transition-timing-function: ${prop.value.vibe};
							#{$trigger} {
								transform: rotate(${prop.value.rotation});
							}
						}
					`
				}
				if(prop.attributes?.category == 'expand'){
					output += `
						@if $type == spin-${prop.attributes.type} {
							transition-duration: ${prop.value.velocity};
							transition-timing-function: ${prop.value.vibe};
							#{$trigger} {
								transform: scale(${prop.value.scale});
							}
						}
					`
				}
			});

			return `
        @mixin motion-token($type, $trigger){
          ${output}
        }
			`
    }
  })
}
