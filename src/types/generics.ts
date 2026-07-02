import type { Option } from './options.js'

export type Flag<T extends string, K extends Option> = `--${T}=${K}`
export type SingleFlag<T extends string> = `--${T}`
