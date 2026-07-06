import type { Flag, SingleFlag } from '@/types/generics'
import type { FormatOption, TypeOption } from '@/types/options'

export type TypeFlag = Flag<'type', TypeOption>

export type FormatFlag = Flag<'format', FormatOption>

export type HelpFlag = SingleFlag<'format'>
