import React from 'react'
import { Button } from '../ui/button'
function Header() {
  return (
    <div className='p-2 shadow-sm flex justify-between items-center px-5'>
      <img src='/logo.svg'/>
     
     <div>
      <Button className="px-6 py-3 text-xl rounded-sm shadow cursor-pointer">
        Sign In
      </Button>
    </div>

    </div>
  )
}

export default Header
