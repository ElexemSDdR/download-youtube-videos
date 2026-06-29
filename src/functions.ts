import { youtubeDl } from 'youtube-dl-exec'

export const downloadVideo = async (url: string) => {
  if (url === '' || !url) return 'Enter an url'
  const downloaded = await youtubeDl(url, {
    writeThumbnail: true,
    consoleTitle: true,
    extractAudio: true,
    audioFormat: "m4a",
    audioQuality: 0,
    writeInfoJson: true
  })

  return downloaded
}
