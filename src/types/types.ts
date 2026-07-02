import type { TypeFlag, FormatFlag, HelpFlag } from './flags.js'

export type Flag = TypeFlag | FormatFlag | HelpFlag

export interface DownloadVideoParams {
  url: string
  flags?: Flag[]
}

export type VideoFormat = 'mp4' | 'webm'

export type AudioFormat = 'mp3' | 'm4a' | 'wav'
