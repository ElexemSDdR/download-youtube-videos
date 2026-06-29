import { downloadVideo } from "./functions.js"

const argvs = process.argv.slice(2)

const [url] = argvs

const result = await downloadVideo(url as string)

console.log(result)
