import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './shoppingList.css';

const ShoppingList = ({ list }) => {
  const [checkedItems, setCheckedItems] = useState([]);

  const toggleCheckedItem = (itemName) => {
    if (checkedItems.includes(itemName)) {
      setCheckedItems(checkedItems.filter((item) => item !== itemName));
    } else {
      setCheckedItems([...checkedItems, itemName]);
    }
  };

  return (
    <Box>
      <Typography variant="h6" marginBottom={2}>
        Items to Buy
      </Typography>
      {Object.entries(list).map(([section, items]) => (
        <Box key={section} marginBottom={2}>
          <Typography variant="subtitle1">{section}</Typography>
          <TransitionGroup component={null}>
            {items
              .filter((item) => !checkedItems.includes(item))
              .map((item) => (
                <CSSTransition key={item} timeout={300} classNames="item">
                  <Box>
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => toggleCheckedItem(item)}
                    />
                    <Typography component="span">{item}</Typography>
                  </Box>
                </CSSTransition>
              ))}
          </TransitionGroup>
        </Box>
      ))}
      <Typography variant="h6" marginTop={4} marginBottom={2}>
        Items in Stock
      </Typography>
      {Object.entries(list).map(([section, items]) => (
        <Box key={`${section}-checked`} marginBottom={2}>
          <Typography variant="subtitle1">{section}</Typography>
          <TransitionGroup component={null}>
            {items
              .filter((item) => checkedItems.includes(item))
              .map((item) => (
                <CSSTransition key={item} timeout={300} classNames="item">
                  <Box>
                    <input
                      type="checkbox"
                      checked={true}
                      onChange={() => toggleCheckedItem(item)}
                    />
                    <Typography
                      component="span"
                      sx={{
                        textDecoration: 'line-through',
                        color: 'text.secondary',
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                </CSSTransition>
              ))}
          </TransitionGroup>
        </Box>
      ))}
    </Box>
  );
};

export default ShoppingList;
