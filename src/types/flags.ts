import type { Flag, SingleFlag } from './generics.js'
import type { FormatOption, TypeOption } from './options.js'

export type TypeFlag = Flag<'type', TypeOption>

export type FormatFlag = Flag<'format', FormatOption>

export type HelpFlag = SingleFlag<'format'>
