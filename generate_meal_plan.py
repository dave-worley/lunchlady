import json
import os
from dotenv import load_dotenv
from openai import OpenAI

# Load environment variables
load_dotenv()

key = os.getenv('OPENAI_KEY')

client = OpenAI(api_key=key)

# Load meal plan JSON
try:
    with open('src/menu.json', 'r') as file:
        meal_plan = json.load(file)
except Exception as e:
    print(f"Error loading JSON file: {e}")
    exit(1)


# OpenAI request function
def get_recipe(date, meal, dish_name):
    system_prompt = """You are a world class chef. Your recipes are featured in Michelin-starred restaurants. You create balanced, flavorful dishes with lots of herbs and spices.

All your dishes feature suitable sides, sauces, and seasoning.

You respond in Markdown format. The date is heading 2. The meal (breakfast, lunch, or dinner) and the name of the dish are heading 3. Ingredients are bullets. Steps are ordered lists. Label ingredients and steps. Do not use dividers.

All measurements are in metric by weight. The dishes use American terminology. Do not use tablespoons or other volumetric measurements. Use metric weights. Temperatures should be in Fahrenheit.

Please ensure the recipes are properly seasoned and include all necessary herbs and spices.

Meals should serve four people. Avoid service instruction and extra text."""

    user_prompt = f"{date} – {meal}: {dish_name}"

    try:
        response = client.chat.completions.create(
            model="gpt-5-chat-latest",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating recipe for {meal} on {date}: {e}")
        return f"## {date}\n### {meal}: {dish_name}\n*Recipe generation failed: {e}*\n"

# Generate all recipes into one markdown string
full_markdown = "# Weekly Meal Plan Recipes\n\n"

for date, meals in meal_plan.items():
    for meal_time, dish in meals.items():
        print(f"Generating recipe for {meal_time} on {date}: {dish}")
        recipe_md = get_recipe(date, meal_time, dish)
        full_markdown += recipe_md + "\n\n"

# Save markdown locally
local_filename = 'generated_meal_plan.md'
try:
    with open(local_filename, 'w') as file:
        file.write(full_markdown)
    print(f"Markdown saved as {local_filename}")
    print("You can now manually share this document with your wife.")
except Exception as e:
    print(f"Error saving markdown: {e}")
