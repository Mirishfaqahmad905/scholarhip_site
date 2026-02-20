import React from 'react'
import { useRoutes } from 'react-router-dom'
import Homepage from './HomePage'

const Body = () => {
     const Route=useRoutes([
         {path:'/',element:<Homepage/>},
     ]);
  return (
 <div>
      
         <div>{Route}</div>
 </div>
  )
}

export default Body