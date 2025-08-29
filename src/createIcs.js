const ics = require('ics')
const fs = require('fs')
const moment = require('moment')

// Load the JSON data from a local file
const menuData = require('./menu.json')

function createIcs(menuData, outputFilename) {
  let events = []
  for (let date in menuData) {
    const meals = menuData[date]
    for (let meal in meals) {
      const description = meals[meal]

      // Convert the date string to a datetime object
      let dateObj = moment(
        date,
        'dddd, MMMM D, YYYY',
      )

      // Set the time for each meal
      let time
      if (meal === 'Breakfast') {
        time = 9
      } else if (meal === 'Lunch') {
        time = 12
      } else if (meal === 'Dinner') {
        time = 17
      } else if (meal === 'Dessert') {
        time = 19
      }

      dateObj = dateObj.add(
        time,
        'hours',
      )

      const endDateObj = dateObj.clone()
        .add(
          1,
          'hours',
        )

      const event = {
        title: `${meal}: ${description}`,
        start: dateObj.toArray()
          .slice(
            0,
            5,
          ),
        end: endDateObj.toArray()
          .slice(
            0,
            5,
          ),
        productId: '-//Family Menu//Worley//',
      }
      events.push(event)
    }
  }

  ics.createEvents(
    events,
    (error, value) => {
      if (error) {
        console.log(error)
      }

      fs.writeFileSync(
        outputFilename,
        value,
      )
    },
  )

  console.log(`Created ${outputFilename}`)
}

createIcs(
  menuData,
  'menu.ics',
)