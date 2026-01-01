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
def get_recipe(dish_name):
    system_prompt = """You are a world class chef. Your recipes are featured in Michelin-starred restaurants. You create balanced, flavorful dishes with lots of herbs and spices.

All your dishes feature suitable sides, sauces, and seasoning.

You respond in Markdown format. The main dish name is heading 4. Any side dishes are not headings. Ingredients are bullets. Steps are ordered lists. Label ingredients and steps.

All measurements are in metric by weight. The dishes use American terminology. Do not use tablespoons or other volumetric measurements. Use metric weights. Temperatures should be in Fahrenheit.

Ensure the recipes are properly seasoned and include all necessary herbs and spices. Caesar dressing should be store-bought.

Meals should serve four people. Avoid service instruction and notes about how many the meal serves in headings. Be terse and professional. Remove dividers."""

    user_prompt = dish_name

    try:
        response = client.chat.completions.create(
            model="gpt-5.2",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ]
        )
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error generating recipe for {dish_name}: {e}")
        return f"#### {dish_name}\n*Recipe generation failed: {e}*\n"

# Generate all recipes into one markdown string
full_markdown = "# Meal Plan Recipes\n\n"

for week, meals in meal_plan.items():
    week_label = week.replace("_", " ").title()
    full_markdown += f"## {week_label}\n\n"

    for meal_type, dishes in meals.items():
        meal_label = meal_type.title()
        full_markdown += f"### {meal_label}\n\n"

        for dish in dishes:
            print(f"Generating recipe for {week_label} - {meal_label}: {dish}")
            recipe_md = get_recipe(dish)
            full_markdown += recipe_md + "\n\n"

# Save markdown locally
local_filename = 'generated_meal_plan.md'
try:
    with open(local_filename, 'w') as file:
        file.write(full_markdown)
    print(f"Markdown saved as {local_filename}")
except Exception as e:
    print(f"Error saving markdown: {e}")
