import React, { useEffect, useState } from 'react';
import HomeProducts from '../components/HomeProducts';
import axios from 'axios';

const Home = () => {
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState("");

    useEffect(() => {
        axios.get("/erp/categories").then(({ data }) => {
            setCategories(data);
        })
    }, [])

    return (
        <div className='pt-40 py-32'>
            <div className='grid gap-8'>
                <div className='flex items-center justify-center'>
                    <div className='w-11/12 md:w-2/3 lg:w-2/5 flex gap-3 items-center bg-gray-200 py-1 px-4 rounded-lg'>
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
                </div>
                {/* <div className='grid place-items-center'>
                    <div className='flex gap-2 md:gap-4'>
                        <button 
                            className='bg-gray-200 flex items-center gap-2 px-3 rounded-full font-semibold hover:bg-gray-400 duration-150' 
                            onClick={() => setCategory(categories.find(item => item?.name.toLowerCase().includes("pork"))._id)}>
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#212121" stroke="none">
                                    <path d="M4246 3946 c-31 -30 -34 -74 -7 -107 18 -23 25 -24 189 -29 152 -4 174 -7 198 -26 53 -39 69 -71 69 -134 0 -63 -16 -95 -69 -134 -37 -28 -150 -34 -244 -12 -63 14 -210 16 -1320 16 -983 0 -1252 3 -1264 13 -9 6 -44 46 -78 87 -109 134 -217 210 -366 258 -106 36 -199 50 -191 30 2 -7 51 -130 108 -273 142 -354 143 -355 387 -355 128 0 134 -1 157 -25 33 -32 33 -78 0 -110 -23 -24 -29 -25 -168 -25 -184 0 -250 18 -327 87 -58 52 -88 95 -115 166 -10 26 -21 47 -25 47 -5 0 -35 -20 -68 -45 -65 -49 -108 -97 -187 -209 -141 -201 -314 -350 -532 -460 l-73 -36 0 -194 0 -194 97 -63 c206 -133 409 -223 631 -279 l117 -30 136 -137 136 -138 43 -261 43 -261 -26 -77 -26 -77 116 3 116 3 32 95 c18 52 48 128 69 167 36 72 36 74 36 195 l0 122 92 139 c50 76 100 142 109 148 29 15 57 10 117 -20 89 -44 246 -101 371 -132 304 -77 641 -78 951 -3 58 15 108 28 112 31 4 2 -17 36 -47 76 -113 148 -185 349 -185 520 0 38 5 53 25 72 55 56 135 15 135 -69 0 -66 25 -184 54 -256 39 -96 100 -183 184 -260 l74 -70 45 -178 45 -177 -31 -190 c-17 -104 -31 -196 -31 -202 0 -10 24 -13 88 -13 l87 1 143 251 142 251 0 243 0 243 149 175 c209 244 246 304 298 473 25 83 27 100 27 288 1 184 -1 205 -22 265 -13 36 -44 96 -69 133 -25 37 -44 69 -42 70 2 2 16 9 31 16 52 27 95 70 129 133 31 58 34 70 33 148 0 72 -4 93 -26 136 -39 75 -70 107 -140 145 l-63 34 -177 3 -177 4 -25 -26z m-3162 -1025 c26 -27 31 -39 31 -81 0 -43 -5 -54 -33 -82 -28 -28 -39 -33 -82 -33 -43 0 -54 5 -82 33 -28 28 -33 39 -33 81 0 52 25 92 70 112 37 16 96 3 129 -30z"/>
                                    <path d="M4587 2015 l-107 -124 0 -219 0 -218 40 -119 c22 -65 40 -127 40 -137 0 -10 -25 -68 -55 -128 l-55 -110 70 0 70 0 101 202 101 202 -77 194 -78 194 32 191 c17 104 30 191 28 193 -2 2 -51 -52 -110 -121z"/>
                                </g>
                            </svg>
                            <span>Pork</span>
                        </button>
                        <button 
                            className='bg-gray-200 flex items-center gap-2 px-3 rounded-full font-semibold hover:bg-gray-400 duration-150'
                            onClick={() => setCategory(categories.find(item => item?.name.toLowerCase().includes("chicken"))._id)}>
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 512.000000 512.000000" preserveAspectRatio="xMidYMid meet">
                                <g transform="translate(0.000000,512.000000) scale(0.100000,-0.100000)" fill="#212121" stroke="none">
                                    <path d="M1150 5105 c-19 -9 -44 -25 -56 -36 l-21 -20 -37 25 c-134 90 -320 -10 -319 -173 0 -41 7 -70 26 -108 l27 -53 -62 -62 c-35 -35 -74 -84 -88 -110 l-25 -47 -262 -123 -263 -122 158 -92 c86 -51 163 -96 170 -101 11 -6 5 -25 -25 -88 -33 -69 -38 -89 -38 -150 1 -114 59 -211 157 -261 l48 -24 0 -363 c0 -199 5 -424 10 -499 34 -472 233 -898 572 -1224 269 -258 511 -382 916 -470 l22 -4 0 -299 c0 -420 18 -401 -367 -401 l-253 0 0 -150 0 -150 525 0 c345 0 542 4 577 11 131 28 253 123 309 244 43 91 49 144 49 454 l0 287 98 27 c110 31 319 130 435 206 l78 51 240 -20 c132 -11 250 -20 261 -20 21 0 21 2 14 183 -4 100 -9 215 -13 255 l-6 72 217 0 216 0 0 24 c0 13 -18 135 -40 272 -21 136 -38 250 -36 251 2 2 138 12 302 23 164 10 300 19 301 20 1 0 -81 120 -182 268 l-184 267 152 145 c84 79 185 176 224 215 l73 70 -230 120 c-127 66 -230 124 -230 130 0 5 51 174 114 375 62 201 112 366 111 368 -2 3 -596 -302 -1621 -830 l-291 -150 121 -122 c214 -214 358 -455 432 -724 l23 -82 -37 -16 c-157 -66 -497 -160 -693 -190 -150 -23 -425 -23 -563 0 -394 66 -697 247 -920 550 -49 65 -56 80 -45 91 8 7 64 44 126 83 l112 71 47 -66 c295 -413 844 -551 1496 -376 l97 26 -30 59 c-45 88 -105 183 -172 273 -70 92 -255 281 -339 346 -46 36 -139 156 -496 640 -242 328 -443 602 -447 609 -4 7 12 52 36 103 38 80 44 101 44 159 0 58 -4 72 -30 110 -43 60 -105 93 -175 92 l-55 0 -25 50 c-34 70 -88 106 -166 112 -40 3 -70 0 -94 -11z m1448 -4399 c2 -262 1 -282 -18 -321 -29 -60 -78 -85 -170 -85 -65 0 -71 2 -64 18 5 9 10 159 12 332 1 173 5 321 7 328 3 9 33 12 117 10 l113 -3 3 -279z"/>
                                </g>
                            </svg>
                            <span>Chicken</span>
                        </button>
                    </div>
                </div> */}
            </div>
            <div className='mt-16'>
                <HomeProducts 
                    query={query}
                />
            </div>
        </div>
    )
}

export default Home;