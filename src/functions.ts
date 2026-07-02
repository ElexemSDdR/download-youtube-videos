import { youtubeDl } from 'youtube-dl-exec'
import type {
  DownloadVideoParams,
  Flag,
  AudioFormat,
  VideoFormat,
} from './types/types.js'
import type { Option, TypeOption, FormatOption } from './types/options.js'
import { FlagError, InvalidOptionsError, NoUrlError } from './errors.js'
import { POSSIBLE_OPTIONS, possibleFlags } from './constants.js'
import fs from 'node:fs/promises'
import path from 'node:path'
import type { HelpFlag } from './types/flags.js'

const __dirname = path.resolve()

const validateParams = (params: Array<string[] | string>): void | 'help' => {
  const [url] = params
  const flags = params.slice(1).flat() as Flag[]
  const urlRegExp = /https:\/\//

  if (url === '' || url?.includes('--help' as HelpFlag)) return 'help'

  if (url === '' || !urlRegExp.test(url as string))
    throw new NoUrlError('Enter an url')

  flags
    ? flags.some((flag) => {
        if (!possibleFlags.includes(flag.split('=')[0] as string)) {
          throw new InvalidOptionsError(`${flag} is not a valid option`)
        }
      })
    : null
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

    let download
    const { audio, video } = POSSIBLE_OPTIONS.formats

    if (flags) {
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

    return (
      download ??
      (await youtubeDl(url, {
        consoleTitle: true,
        format: 'mp4',
      }))
    )
  } catch (e: any) {
    console.error(e.message)
    return
  }
}
