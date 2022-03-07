export interface Brand {
  source: string
  dest: string
  filename: string
  brand: string
  theme: string
  mode: string
}

export interface BuildPath {
  css: string
}

export interface BuildConfig {
  current: Brand,
  buildPath: BuildPath
}
