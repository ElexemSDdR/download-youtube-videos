import { downloadVideo } from '@/functions.js'
import type { Flag } from '@/types/types.js'

const argvs = process.argv.slice(2)

const [url] = argvs
const options = argvs.slice(1)

try {
  const result = await downloadVideo({
    url: url as string,
    flags: options as Flag[],
  })
  console.log(result)
} catch (e: any) {
  console.error(e.message)
}
