const fs = require('fs')
const path = require('path')
const {
  parse,
  format,
} = require('date-fns')

const oldMenuPath = path.join(
  __dirname,
  'menu.json',
)

if (fs.existsSync(oldMenuPath)) {
  const menu = require(oldMenuPath)
  const dateStrings = Object.keys(menu)
  const startDate = parse(
    dateStrings[0],
    'EEEE, MMMM d, yyyy',
    new Date(),
  )
  const endDate = parse(
    dateStrings[dateStrings.length - 1],
    'EEEE, MMMM d, yyyy',
    new Date(),
  )

  const startDateFormatted = format(
    startDate,
    'yyyyMMdd',
  )
  const endDateFormatted = format(
    endDate,
    'yyyyMMdd',
  )

  const newMenuPath = path.join(
    __dirname,
    '..',
    'old_menus',
    `${startDateFormatted}-${endDateFormatted}-menu.json`,
  )
  fs.renameSync(
    oldMenuPath,
    newMenuPath,
  )
  console.log(`Menu deprecated and saved as ${startDateFormatted}-${endDateFormatted}-menu.json`)

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
