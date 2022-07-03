import path from 'path'
import { writeFile } from 'fs'

writeFile(path.resolve('./src/config/default'), '', 'utf-8', (err) => {
  // eslint-disable-next-line no-console
  console.log(err)
})
