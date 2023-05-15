const {
  Configuration,
  OpenAIApi,
} = require('openai')
const fs = require('fs')
require('dotenv')
  .config()
const personality = require('./system')
const previousMenus = require('../old_menus/20230412-20230418-menu.json')

let prompt = `
Let's make a meal plan for a family of four for a week! 

Generate a one week menu in JSON format including Breakfast, Lunch, Dinner, and Dessert for each day.

Don't repeat any dishes or desserts. A previous menu will be included. No seafood.

Make sure to avoid placing the same type of meat twice in a row. For example, if you have chicken for dinner on Monday, please don't have chicken for dinner on Tuesday. 

Let's think of a creative theme. Please include dessert. Be original. No more yogurt parfaits, yogurt bowls, or smoothies. No more caprese anything, cobb salad, or lame salads. Please include a protein with most meals and avoid fully vegetarian meals.

Please try to include French, Basque, and/or Spanish cuisine.

The JSON format:

{
  "Friday, March 17, 2023": {
    "Breakfast": "Oatmeal with diced apples and cinnamon, topped with chopped nuts and drizzled with honey",
    "Lunch": "Mediterranean Chicken Pita - Grilled chicken with tzatziki sauce, feta cheese, and chopped vegetables",
    "Dinner": "Roasted Pork Tenderloin - Pork tenderloin topped with garlic and herb seasoning and served with roasted potatoes",
    "Dessert": "Cheesecake with fresh berries",
  },
  ...
}
`
prompt += 'the date is ' + new Date() + '. Start from tomorrow. Please only respond with the JSON.'

console.log('Generating a new menu.')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)


try {
  openai.createChatCompletion({
    model: 'gpt-4',
    temperature: 0.8,
    messages: [
      {
        'role': 'system',
        content: personality,
      },
      {
        role: 'user',
        content: prompt,
      },
      {
        role: 'user',
        content: 'This is our last menu. Please make the new menu extremely different.' + previousMenus.toString(),
      }
    ],
  })
    .then((completion) => {
      console.log(completion.data.choices[0].message)
      const menuJSON = completion.data.choices[0].message.content
      console.log(menuJSON)
      fs.writeFileSync(
        'src/menu.json',
        menuJSON,
      )
      console.log('Menu generated and saved as menu.json')
    })
} catch (error) {
  if (error.response) {
    console.log(error.response.status)
    console.log(error.response.data)
  } else {
    console.log(error.message)
  }
}
