import { SearchIcon } from 'lucide-react';
import React from 'react'

export function SearchInput() {
    //todo: add search function
  return (
    <form className='w-full max-w-[600px] flex'>
         <div className='relative w-full'>
                <input type="text" placeholder='Search'
                className='w-full rounded-l-full border border-gray-300 pl-4 py-2 pr-12 focus:outline-none focus:border-blue-500' / >
{/* {Todo: add/remove search button} */}
         </div>
         <button type='submit' className='bg-gray-100 px-5 py-2.5 border-l-0 rounded-r-full hover:bg-gray-200 disable:opacity-50 disabled:cursor-not-allowed'>
            <SearchIcon className='size-5'/>
         </button>
    </form>
  );
}
