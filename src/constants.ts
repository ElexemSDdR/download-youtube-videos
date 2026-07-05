import type { AudioFormat, VideoFormat } from '@/types/types.js'
import type { PossibleOption } from '@/types/options.js'

export const possibleFlags = ['--type', '--format']

const audioFormats: AudioFormat[] = ['m4a', 'mp3', 'wav']
const videoFormats: VideoFormat[] = ['mp4', 'webm']

export const POSSIBLE_OPTIONS: PossibleOption = {
  types: ['audio', 'video'],
  formats: {
    audio: audioFormats,
    video: videoFormats,
  },
}
