import React from 'react'
import { Button } from '../ui/button'
function Header() {
  return (
    <div className='p-2 shadow-sm flex justify-between items-center px-5'>
      <img src='/logo.svg'/>
     
     <div>
      <Button className="shadow cursor-pointer">
        Sign In
      </Button>
    </div>

    </div>
  )
}

export default Header
