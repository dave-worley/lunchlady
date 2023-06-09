import React, {
  useEffect,
  useState,
} from 'react'
import {
  Box,
  Button,
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
  startOfDay,
} from 'date-fns'
import ShoppingList from './components/shoppingList'
import mealsData from './menu.json'
import shoppingListData from './shoppingList.json'


const MenuCard = ({
  dateStr,
  meals,
}) => {
  const date = parse(
    dateStr,
    'EEEE, MMMM d, yyyy',
    new Date(),
  )
  const isPast = isBefore(
    date,
    startOfDay(new Date()),
  )
  const today = isToday(date)
  const opacity = isPast ? 0.5 : 1
  const fontWeight = today ? 'bold' : 'normal'
  const fontSize = today ? '1.2rem' : '1rem'
  const [showSnack, setShowSnack] = useState(false)

  const toggleSnack = () => {
    setShowSnack(!showSnack)
  }

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={4}
      lg={3}
    >
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
        <Typography
          variant="h5"
          fontWeight={fontWeight}
          fontSize={fontSize}
        >
          {format(
            date,
            'EEEE',
          )}
        </Typography>
        {Object.entries(meals)
          .map(([meal, description]) => {
            if (meal === 'Dessert' && !showSnack) {
              return null
            }
            return (
              <Typography
                key={meal}
                marginBottom={1}
              >
                <strong>{meal}:</strong><br/>{description}
              </Typography>
            )
          })}
        {meals['Dessert'] && (
          <Button
            variant="outlined"
            size="small"
            onClick={toggleSnack}
            sx={{ marginTop: 1 }}
          >
            {showSnack ? 'Hide Dessert' : 'Show Dessert'}
          </Button>
        )}
      </Paper>
    </Grid>
  )
}

const App = () => {
  const [meals, setMeals] = useState({})
  const [shoppingList, setShoppingList] = useState({})

  useEffect(
    () => {
      setMeals(mealsData)
      setShoppingList(shoppingListData)
    },
    [],
  )

  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          flexGrow: 1,
          marginTop: 4,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-start',
            marginBottom: 2,
          }}
        >
          <img
            src="/logo512.png"
            alt="Menu Display App Logo"
            style={{
              width: '100px',
              height: 'auto',
            }}
          />
        </Box>
        <Grid
          container
          spacing={3}
        >
          {Object.entries(meals)
            .map(([date, dayMeals]) => (
              <MenuCard
                key={date}
                dateStr={date}
                meals={dayMeals}
              />
            ))}
        </Grid>

        <Typography
          variant="h4"
          sx={{
            marginTop: 4,
            marginBottom: 2,
          }}
        >
          Shopping List
        </Typography>
        <ShoppingList list={shoppingList}/>
      </Box>
    </Container>
  )
}


export default App
