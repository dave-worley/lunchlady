import React, {
  useEffect,
  useState,
} from 'react'
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
} from '@mui/material'
import {
  format,
  isBefore,
  isToday,
  parse,
  startOfDay
} from 'date-fns'

const mealsData = {
  "Saturday, March 18, 2023": {
    "Breakfast": "Banana and peanut butter smoothie with a scoop of protein powder",
    "Lunch": "Tuna salad sandwiches (egg salad or chicken salad for those who don't like seafood), with a side of baby carrots and hummus",
    "Dinner": "Pressure cooker beef stew with carrots, potatoes, and peas, served with crusty bread",
    "Snack Plate": "Brownie bites (sweet), Cheese cubes and whole-grain crackers (savory), Sliced bell peppers with a side of hummus for dipping (healthy)"
  },
  "Sunday, March 19, 2023": {
    "Breakfast": "Mini quiches with spinach, cheese, and mushrooms (can be made ahead and reheated)",
    "Lunch": "Chicken Caesar salad (swap out chicken for shrimp for the seafood lovers)",
    "Dinner": "Ratatouille (try finely dicing the veggies for the teenager) served over polenta",
    "Snack Plate": "Mini fruit tarts (sweet), Edamame (lightly salted, served in the pod) (savory), Sliced cucumber with a side of tzatziki sauce for dipping (healthy)"
  },
  "Monday, March 20, 2023": {
    "Breakfast": "Bagels with cream cheese, smoked salmon for the seafood lovers, and fresh fruit",
    "Lunch": "Italian antipasto salad with salami, provolone, olives, and artichoke hearts",
    "Dinner": "Pesto pasta with cherry tomatoes and roasted chicken (mix in some steamed broccoli for those who enjoy it)",
    "Snack Plate": "Graham crackers with a side of Nutella for dipping (sweet), Turkey or salami roll-ups (turkey or salami slices wrapped around a cheese stick) (savory), Strawberries (healthy)"
  },
  "Tuesday, March 21, 2023": {
    "Breakfast": "Pancakes with maple syrup, bacon, and fresh fruit",
    "Lunch": "Greek salad with feta, cucumber, tomato, and olives (add grilled chicken for the teenager)",
    "Dinner": "Baked ziti with marinara sauce, ground turkey (or Italian sausage), and mozzarella, served with garlic bread",
    "Snack Plate": "Yogurt-covered raisins (a handful) (sweet), Pita chips with a side of guacamole for dipping (savory), Cherry tomatoes (healthy)"
  }
}

const MenuCard = ({ dateStr, meals }) => {
  const date = parse(dateStr, 'EEEE, MMMM d, yyyy', new Date());
  const isPast = isBefore(date, startOfDay(new Date()));
  const today = isToday(date);
  const opacity = isPast ? 0.5 : 1;
  const fontWeight = today ? 'bold' : 'normal';
  const fontSize = today ? '1.2rem' : '1rem';

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
      <Paper
        elevation={3}
        sx={{
          padding: 2,
          borderRadius: 2,
          textAlign: 'left',
          backgroundColor: 'white',
          opacity,
          border: today ? '3px solid #3f51b5' : 'none',
        }}
      >
        <Typography variant="h5" fontWeight={fontWeight} fontSize={fontSize} marginBottom={12}>
          {format(date, 'EEEE')}
        </Typography>
        {Object.entries(meals).map(([meal, description]) => (
          <Typography key={meal} marginBottom={4}>
            <strong>{meal}:</strong> {description}
          </Typography>
        ))}
      </Paper>
    </Grid>
  );
};

const App = () => {
  const [meals, setMeals] = useState({});

  useEffect(() => {
    setMeals(mealsData);
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1, marginTop: 4 }}>
        <Grid container spacing={3}>
          {Object.entries(meals).map(([date, dayMeals]) => (
            <MenuCard key={date} dateStr={date} meals={dayMeals} />
          ))}
        </Grid>
      </Box>
    </Container>
  );
};


export default App
