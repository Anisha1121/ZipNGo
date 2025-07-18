import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import CreateTrip from './create-trip/index.jsx'
import GeneratingTrip from './create-trip/GeneratingTrip.jsx'
import Header from './components/custom/Header.jsx'
import { Toaster } from "sonner";
import { GoogleOAuthProvider } from '@react-oauth/google'
import ViewTrip from './view-trip/[tripid]/index.jsx'
import Mytrips from './my-trips'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />
  },
   {
    path: '/create-trip',
    element: <CreateTrip />
  },
   {
    path: '/generating-trip',
    element: <GeneratingTrip />
  },
   {
    path: '/view-trip/:tripId',
    element: <ViewTrip/>
  },
  {
    path: '/my-trips',
    element: <Mytrips />
  }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_AUTH_CLIENT_ID}>
      <Header/>
      <RouterProvider router={router} />
      <Toaster position="top-right" />
    </GoogleOAuthProvider>
    
  </React.StrictMode>,
)
