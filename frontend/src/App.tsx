import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Container, Paper, Grid, Button, Typography } from '@mui/material';
import { backend } from 'declarations/backend';

const theme = createTheme({
  palette: {
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#f8f9fa',
    },
    success: {
      main: '#28a745',
    },
  },
});

const App: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplay(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplay('0.');
      setWaitingForSecondOperand(false);
      return;
    }

    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const performOperation = async (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = await backend.calculate(operator, firstOperand, inputValue);
      if (result !== null) {
        setDisplay(String(result));
        setFirstOperand(result);
      } else {
        setDisplay('Error');
        setFirstOperand(null);
      }
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };

  const buttons = [
    '7', '8', '9', '/',
    '4', '5', '6', '*',
    '1', '2', '3', '-',
    '0', '.', '=', '+'
  ];

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 2, backgroundColor: theme.palette.primary.main }}>
          <Typography variant="h4" component="div" sx={{ mb: 2, color: 'white' }}>
            {display}
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={clear}
                sx={{ mb: 1 }}
              >
                Clear
              </Button>
            </Grid>
            {buttons.map((btn) => (
              <Grid item xs={3} key={btn}>
                <Button
                  fullWidth
                  variant="contained"
                  color={btn === '=' ? 'success' : 'secondary'}
                  onClick={() => {
                    if (btn === '=') {
                      performOperation('=');
                    } else if (['+', '-', '*', '/'].includes(btn)) {
                      performOperation(btn);
                    } else if (btn === '.') {
                      inputDecimal();
                    } else {
                      inputDigit(btn);
                    }
                  }}
                >
                  {btn}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default App;