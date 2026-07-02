import type { AudioFormat, VideoFormat } from './types.js'

export type TypeOption = 'audio' | 'video'

export type FormatOption = VideoFormat | AudioFormat

export type Option = TypeOption | FormatOption

export type PossibleOption = {
  types: TypeOption[]
  formats: {
    audio: AudioFormat[]
    video: VideoFormat[]
  }
}
