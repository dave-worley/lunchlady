const {
  Configuration,
  OpenAIApi,
} = require('openai')
const fs = require('fs')
require('dotenv')
  .config()
const personality = require('./system')

const menu = require('./menu.json')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY,
})
const openai = new OpenAIApi(configuration)

const generateShoppingList = async (menu) => {
  const menuString = JSON.stringify(
    menu,
    null,
    2,
  )
  const prompt = `Given the following weekly menu, please generate an exhaustive shopping list organized by Lidl grocery store sections. Please include exact quantities and weights. Please respond only in JSON format. Imagine these to be gourmet recipes and include any necessary spices. Remember to include incidental fruits for snacking. Don't assume anything in the pantry. Assume items will mostly be made from scratch except where jarred sauces would be easier. 
  
  For example we would never cook with a boxed mashed potato mix or a ready-made stuffed pepper filling. The json format looks like { "Produce": [
    "Mixed nuts, 1 can",
    "Lettuce, 1 head",
    "Tomato, 4-5",
    "Avocado, 3-4",
    "Carrots, 2lbs bag",
    "Baby carrots, 1 bag",
    "Potatoes, 1 bag"
  ] }
  
  ${menuString}
  
  Once you are done, please evaluate the list you have created and add any additional items you think are necessary or have been omitted.
  
  Then, output the final shopping list in JSON format.
  `

  try {
    openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          'role': 'system',
          content: personality,
        },
        {
          'role': 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
    })
      .then((response) => {
        const shoppingListJSON = response.data.choices[0].message.content
        fs.writeFileSync(
          'src/shoppingList.json',
          shoppingListJSON,
        )
        console.log('Shopping list generated and saved as shoppingList.json')
      })
  } catch (error) {
    if (error.response) {
      console.log(error.response.status)
      console.log(error.response.data)
    } else {
      console.log(error.message)
    }
  }


}

generateShoppingList(menu)
