const fs = require('fs')

// Function to print the meals of the selected type from the menu
function printMeals(menu, mealType) {
  let counter = 1
  for (let date in menu) {
    if (menu[date][mealType]) {
      console.log(`${counter}. ${menu[date][mealType]}`)
      counter++
    }
  }
}

// Load the menu from a JSON file (You should put your JSON data into menu.json file in the same directory)
let rawMenuData = fs.readFileSync('menu.json')

let menu = JSON.parse(rawMenuData)

// Replace 'Breakfast' with 'Lunch' or 'Dinner' if needed
printMeals(
  menu,
  'Dinner',
)
