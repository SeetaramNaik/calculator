import './App.css';
import React, { useReducer } from 'react';
import {BrowserRouter,Routes,Router,Link} from 'react-router-dom';
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';
import BackspaceIcon from '@mui/icons-material/Backspace';

export const ACTION = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate',
};
function reducer(state, { type, payload }) {
  //reducer function takes 2 parameter - currentState & action
  switch (type) {
    case ACTION.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          curOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === '0' && state.curOperand === '0') {
        return state;
      }
      if (payload.digit === '.' && state.curOperand.includes('.')) {
        return state;
      }
      return {
        ...state,
        curOperand: `${state.curOperand || ''}${payload.digit}`,
      };
    case ACTION.CHOOSE_OPERATION:
      if (state.curOperand == null && state.prevOperand == null) {
        return state;
      }

      if (state.curOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.prevOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          prevOperand: state.curOperand,
          curOperand: null,
        };
      }
      return {
        ...state,
        prevOperand: evaluate(state),
        operation: payload.operation,
        curOperand: null,
      };
    case ACTION.CLEAR:
      return {};
    case ACTION.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          curOperand: null,
        };
      }
      if (state.curOperand == null) return state;
      if (state.curOperand.length === 1) {
        return {
          ...state,
          curOperand: null,
        };
      }
      return {
        ...state,
        curOperand: state.curOperand.slice(0, -1),
      };
    case ACTION.EVALUATE:
      if (
        state.operation == null ||
        state.curOperand == null ||
        state.prevOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        prevOperand: null,
        operation: null,
        curOperand: evaluate(state),
      };
  }
}

function evaluate({ curOperand, prevOperand, operation }) {
  const prev = parseFloat(prevOperand);
  const cur = parseFloat(curOperand);
  if (isNaN(prev) || isNaN(cur)) return '';

  let computation = '';
  switch (operation) {
    case '+':
      computation = prev + cur;
      break;
    case '-':
      computation = prev - cur;
      break;
    case '*':
      computation = prev * cur;
      break;
    case '/':
      computation = prev / cur;
      break;
    case '%':
      computation=prev % cur;
      break; 
    default:
      alert('Calculator not working currently...SORRY for the inconvenience');
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat('en-us', {
  maximumFractionDigits: 0,
});

function formatOperand(operand) {
  if (operand == null) return;
  const [integer, decimal] = operand.split('.');
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ curOperand, prevOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  ); //useReducer takes 2 parameter - reducer(function) & initialState
  //it return two values - newState & dispatch( to dispatch the action)
  return (
    <>
    
    <div className='calculator'>
      <div className="options">

      </div>
      <div className='output'>
        <div className='previous-operand'>
          {formatOperand(prevOperand)}
          {operation}
        </div>
        <div className='current-operand'>{formatOperand(curOperand)}</div>
      </div>
      <button
        style={{ color: 'red', backgroundColor: 'black' }}
        // className='span-two'
        onClick={() => dispatch({ type: ACTION.CLEAR })}
      >
        C
      </button>
      <button
        style={{ color: 'white', backgroundColor: 'black' }}
        onClick={() => dispatch({ type: ACTION.DELETE_DIGIT })}
      >
        <BackspaceIcon style={{ color: '#53a82f'}}/>
      </button>
      <OperationButton operation='%' dispatch={dispatch} />
      <OperationButton operation='/' dispatch={dispatch} />
      <DigitButton className='digit' digit='1' dispatch={dispatch} />
      <DigitButton digit='2' dispatch={dispatch} />
      <DigitButton digit='3' dispatch={dispatch} />
      <OperationButton operation='*' dispatch={dispatch} />
      <DigitButton digit='4' dispatch={dispatch} />
      <DigitButton digit='5' dispatch={dispatch} />
      <DigitButton digit='6' dispatch={dispatch} />
      <OperationButton operation='+' dispatch={dispatch} />
      <DigitButton digit='7' dispatch={dispatch} />
      <DigitButton digit='8' dispatch={dispatch} />
      <DigitButton digit='9' dispatch={dispatch} />
      <OperationButton operation='-' dispatch={dispatch} />
      <DigitButton digit='.' dispatch={dispatch} />
      <DigitButton digit='0' dispatch={dispatch} />
      <button
        style={{ color: 'white',backgroundColor: 'black' }}
        className='span-two equal'
        onClick={() => dispatch({ type: ACTION.EVALUATE })}
      >
        =
      </button>



      
    </div>
    
   
    
    </>
    
  );
}

export default App;
