import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { LocationHistoryContextProvider } from './models/LocationHistoryContext'
import App from './App'
import { configureApp } from './configureApp'
import './index.scss'

configureApp()

ReactDOM.render(
  <BrowserRouter>
    <LocationHistoryContextProvider>
      <App />
    </LocationHistoryContextProvider>
  </BrowserRouter>,
  document.getElementById('root')
)
