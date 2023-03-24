const {
  Configuration,
  OpenAIApi,
} = require('openai')
const fs = require('fs')
require('dotenv')
  .config()
const personality = require('./system')

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
    temperature: 0.8,
    messages: [
      {
        'role': 'system',
        content: personality,
      },
      {
        'role': 'user',
        content: prompt,
      },
      {
        'role': 'user',
        content: `Here's our last menu. Please avoid anything similar!
        
        Monday:

Breakfast: Yogurt with granola and fresh berries
Lunch: Grilled cheese sandwiches with tomato soup
Dinner: Sous vide lemon herb chicken breasts, steamed green beans, and garlic mashed potatoes
Tuesday:

Breakfast: Scrambled eggs with cheese and whole-wheat toast
Lunch: Caprese salad with sliced tomatoes, fresh mozzarella, basil, and a balsamic glaze (add sliced chicken for the teenager)
Dinner: Basque chicken with peppers and onions, served with white rice
Wednesday:

Breakfast: Overnight oats with almond milk, honey, and mixed nuts
Lunch: Turkey and cheese wraps with lettuce, tomato, and avocado
Dinner: Spaghetti carbonara (use turkey bacon or pancetta for a milder flavor), with a side salad for those who enjoy it
Thursday:

Breakfast: Banana and peanut butter smoothie with a scoop of protein powder
Lunch: Tuna salad sandwiches (egg salad or chicken salad for those who don't like seafood), with a side of baby carrots and hummus
Dinner: Pressure cooker beef stew with carrots, potatoes, and peas, served with crusty bread
Friday:

Breakfast: Mini quiches with spinach, cheese, and mushrooms (can be made ahead and reheated)
Lunch: Chicken Caesar salad (swap out chicken for shrimp for the seafood lovers)
Dinner: Ratatouille (try finely dicing the veggies for the teenager) served over polenta
Saturday:

Breakfast: Bagels with cream cheese, smoked salmon for the seafood lovers, and fresh fruit
Lunch: Italian antipasto salad with salami, provolone, olives, and artichoke hearts
Dinner: Pesto pasta with cherry tomatoes and roasted chicken (mix in some steamed broccoli for those who enjoy it)
Sunday:

Breakfast: Pancakes with maple syrup, bacon, and fresh fruit
Lunch: Greek salad with feta, cucumber, tomato, and olives (add grilled chicken for the teenager)
Dinner: Baked ziti with marinara sauce, ground turkey (or Italian sausage), and mozzarella, served with garlic bread
        
        `,
      },
      {
        'role': 'user',
        content: `and here's our last snack plate menu so please avoid things in this list:
        Snack Plate 1:

Sweet: Chocolate-covered almonds (a handful)
Savory: Mini pretzels with a side of mustard for dipping
Healthy: Apple slices
Snack Plate 2:

Sweet: Rice crispy treats (store-bought or homemade)
Savory: Popcorn (lightly salted or seasoned)
Healthy: Baby carrots with a side of ranch dressing for dipping
Snack Plate 3:

Sweet: Mini blueberry muffins (store-bought or homemade)
Savory: Mixed nuts (a handful)
Healthy: Celery sticks with a side of peanut butter for dipping
Snack Plate 4:

Sweet: Brownie bites (store-bought or homemade)
Savory: Cheese cubes and whole-grain crackers
Healthy: Sliced bell peppers with a side of hummus for dipping
Snack Plate 5:

Sweet: Mini fruit tarts (store-bought or homemade)
Savory: Edamame (lightly salted, served in the pod)
Healthy: Sliced cucumber with a side of tzatziki sauce for dipping
Snack Plate 6:

Sweet: Graham crackers with a side of Nutella for dipping
Savory: Turkey or salami roll-ups (turkey or salami slices wrapped around a cheese stick)
Healthy: Strawberries
Snack Plate 7:

Sweet: Yogurt-covered raisins (a handful)
Savory: Pita chips with a side of guacamole for dipping
Healthy: Cherry tomatoes

        
        `
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
