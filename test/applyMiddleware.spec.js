import test from 'ava'
import applyMiddleware from '../src/applyMiddleware'
import createStore from '../src/createStore'
import combineReducer from '../src/combineReducers'

const fruitReducer = function (state = '', action) {
  switch (action.type) {
    case 'apple': {
      return 'apple'
    }
    case 'banana': {
      return 'banana'
    }
    default:
      return state
  }
}

const animalReducer = function (state = '', action) {
  switch (action.type) {
    case 'dog': {
      return 'dog'
    }
    case 'cat': {
      return 'cat'
    }
    default:
      return state
  }
}

const reducer = combineReducer({
  fruit: fruitReducer,
  animal: animalReducer
})

test('applyMiddleware will wrapper dispatch', t => {
  let stubCalledTime = 0
  const store = createStore(reducer, applyMiddleware(store => dispatch => action => {
    stubCalledTime++
    dispatch(action)
    console.log('in middlware', store.getState())
  }))

  console.log('initalization end')
  console.log(store.state)
  store.dispatch({type: 'dog'})
  console.log(store.state)

  t.is(stubCalledTime, 1)
  console.log('store.state from test', store.getState())
  t.is(store.getState().animal, 'dog')
})

test('applyMiddleware test thunk', t => {
  let stubCalledTime = 0
  const actionCountingMiddleware = store => dispatch => action => {
    stubCalledTime++
    dispatch(action)
  }

  const thunkMiddleware = ({dispatch, getState}) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState)
    }

    return next(action)
  }
  const store = createStore(reducer, applyMiddleware(thunkMiddleware, actionCountingMiddleware))

  store.dispatch(function (dispatch, getState) {
    t.is(getState().animal, '')
    dispatch({type: 'dog'})
  })

  t.is(store.getState().animal, 'dog')
  t.is(stubCalledTime, 1)
})
