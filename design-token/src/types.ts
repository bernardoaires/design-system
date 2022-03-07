export interface Brand {
  source: string
  dest: string
  filename: string
  brand: string
  theme: string
  mode: string
}

export enum StyleOptions {
  CSS = 'css',
  SCSS = 'scss'
}
export type BuildPath = {
  [K in StyleOptions]: string | undefined
}

export interface BuildConfig {
  current: Brand,
  buildPath: BuildPath
}
