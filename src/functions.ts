import { youtubeDl } from 'youtube-dl-exec'
import type {
  DownloadVideoParams,
  Flag,
  AudioFormat,
  VideoFormat,
} from './types/types.js'
import type { Option, TypeOption, FormatOption } from './types/options.js'
import { FlagError, InvalidOptionsError, UrlError } from './errors.js'
import { POSSIBLE_OPTIONS, possibleFlags } from './constants.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { HelpFlag } from './types/flags.js'

const __dirname = path.resolve()

const validateParams = (params: Array<string[] | string>): void | 'help' => {
  const [url] = params
  const flags = params.slice(1).flat() as Flag[]

  if (url === '' || url?.includes('--help' as HelpFlag)) return 'help'

  if (!url![0]?.startsWith('https://youtu.be'))
    throw new UrlError('Enter a valid url')

  if (flags?.includes('--help' as HelpFlag)) return 'help'

  flags?.some((flag) => {
    if (!possibleFlags.includes(flag.split('=')[0] as string)) {
      throw new InvalidOptionsError(`${flag} is not a valid option`)
    }
  })
}

const getSelectedFlagOption = <T extends Option>(
  flags: Flag[],
  options?: T[],
) => {
  const foundOption = flags
    ?.find((flag: Flag) => {
      if (
        flag.split('=').length > 1 &&
        options?.some((option: string) =>
          option.includes(flag.split('=')[1] as T),
        )
      ) {
        return flag
      }
    })
    ?.split('=')[1] as T

  if (!foundOption || typeof foundOption === 'undefined')
    throw new FlagError(
      `Pass a valid flag. Here the valid ones: ${possibleFlags}. Also check the arguments passed to the flags.`,
    )

  return foundOption
}

const showHelpMessage = async () => {
  const helpMessage = await fs.readFile(
    path.join(__dirname, 'help-message.txt'),
    { encoding: 'utf8' },
  )
  return helpMessage
}

export const downloadVideo = async ({ url, flags }: DownloadVideoParams) => {
  try {
    const validation = validateParams([url, ...(flags ?? '')])
    if (validation === 'help') return showHelpMessage()

    const { audio, video } = POSSIBLE_OPTIONS.formats

    if (!(flags?.length === 0) && flags) {
      if (flags.includes('--help' as HelpFlag)) return showHelpMessage()
      const typeFlag = getSelectedFlagOption<TypeOption>(
        flags,
        POSSIBLE_OPTIONS.types,
      )
      const formatFlag = getSelectedFlagOption<FormatOption>(flags, [
        ...video,
        ...audio,
      ])

      if (typeFlag === 'audio' && audio.includes(formatFlag as AudioFormat)) {
        return await youtubeDl(url, {
          consoleTitle: true,
          extractAudio: true,
          audioFormat: formatFlag,
          audioQuality: 0,
        })
      }
      if (typeFlag === 'video' && video.includes(formatFlag as VideoFormat)) {
        return await youtubeDl(url, {
          consoleTitle: true,
          format: formatFlag,
        })
      } else {
        return `Pass a valid format based on the type, not an audio format for a video for example. Here the valid video formats: ${video}; and here the valid audio formats: ${audio}`
      }
    }

    return await youtubeDl(url, {
      consoleTitle: true,
      format: 'mp4',
    })
  } catch (e: any) {
    console.error(e.message)
    return
  }
}
