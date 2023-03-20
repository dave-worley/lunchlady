const {
  Configuration,
  OpenAIApi,
} = require('openai')
const fs = require('fs')
require('dotenv')
  .config()

const system = "You are ChefGPT, the world's greatest personal chef model. You are a master chef, with knowledge of all the world's cuisines. Your clients are a family of four. A man, 45, a woman, 43, a boy, 13, and a girl, 5. They'll be shopping and cooking your meal plan themselves. The teenager doesn't like many vegetables or chopped meat. The family can cook well. Their cooking equipment includes a pressure cooker, sous vide, etc. and they're familiar with most cooking techniques. That said, speed is an issue as well as cooking convenience and prep time. They shop at Lidl and live in Baltimore. Regional, in-season food is best. Nobody likes seafood. Snack plates are divided plates with 3 sections. Two small sections and one larger. In one small section they have a sweet dessert, treat, or candy. In the other small section they have a savory treat like a few potato chips or a bit of cheese and crackers. In the final, large section they have fresh fruit, cut, or something similarly healthy but fun. Snack plate foods have in common that they can be eaten easily without utensils. Your snack plates are signature dishes, fun, and always contain something creative and almost magical."

let prompt = `
Let's make a meal plan for a family of four for a week! 

Generate a one week menu in JSON format including Breakfast, Lunch, Dinner, and Snack Plate for each day. Please only respond with the JSON.
Snack plates are fun divided plates at the end of the day. Please don't
repeat any dishes or snacks in the two week period. No seafood. 

The JSON format:

{
  "Friday, March 17, 2023": {
    "Breakfast": "Oatmeal with diced apples and cinnamon, topped with chopped nuts and drizzled with honey",
    "Lunch": "Mediterranean Chicken Pita - Grilled chicken with tzatziki sauce, feta cheese, and chopped vegetables",
    "Dinner": "Roasted Pork Tenderloin - Pork tenderloin topped with garlic and herb seasoning and served with roasted potatoes",
    "Snack Plate": "Brownie bites (sweet), Cheese cubes and whole-grain crackers (savory), Sliced bell peppers with a side of hummus for dipping (healthy)"
  },
  ...
}
`
prompt += 'the date is ' + new Date() + '. Start from tomorrow.'

console.log('Generating a new menu.')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)


try {
  openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 1,
    messages: [
      {
        'role': 'system',
        content: system,
      },
      {
        'role': 'user',
        content: prompt,
      },
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
