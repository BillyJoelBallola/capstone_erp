import React, { useEffect, useState } from 'react';
import HomeProducts from '../components/HomeProducts';
import axios from 'axios';

const Home = () => {
    const [query, setQuery] = useState("");
    const [displayStyle, setDisplayStyle] = useState("grid");

    return (
        <div className='pt-28 pb-32'>
            <div className='side-margin flex items-center justify-between gap-4'>
                <div className='w-11/12 md:w-2/3 lg:w-2/5 flex gap-3 items-center bg-gray-100 py-1 px-4 rounded-lg border border-gray-300'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#6B7280" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                    </svg>
                    <input 
                        type="text"
                        id='searchBox'
                        placeholder='Type to search items using product names'
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className='flex items-center'>
                    <button onClick={() => setDisplayStyle("grid")} className={`bg-gray-200 pl-3 pr-1 py-1 rounded-l-full border-2 ${displayStyle === "grid" && 'border-red-300' }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                        </svg>
                    </button>
                    <button onClick={() => setDisplayStyle("list")} className={`bg-gray-200 pr-3 pl-1 py-1 rounded-r-full border-2 ${displayStyle === "list" && 'border-red-300' }`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className='mt-5'>
                <HomeProducts 
                    query={query}
                    display={displayStyle}
                />
            </div>
        </div>
    )
}

export default Home;