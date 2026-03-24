const fs = require('fs')
const path = require('path')
const {
  format,
} = require('date-fns')

const oldMenuPath = path.join(
  __dirname,
  'menu.json',
)

if (fs.existsSync(oldMenuPath)) {
  const datestamp = format(new Date(), 'yyyyMMdd')

  const newMenuPath = path.join(
    __dirname,
    '..',
    'old_menus',
    `${datestamp}-menu.json`,
  )
  fs.renameSync(
    oldMenuPath,
    newMenuPath,
  )
  console.log(`Menu deprecated and saved as ${datestamp}-menu.json`)

  const menuPath = path.join(
    __dirname,
    'menu.json',
  )
  fs.writeFileSync(
    menuPath,
    '',
  )
  console.log('blank menu.json created')
} else {
  console.log('menu.json not found')
}
