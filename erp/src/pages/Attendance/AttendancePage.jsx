import React from 'react';
import moment from 'moment';

const AttendancePage = () => {
    return (
        <div className='h-screen w-screen grid place-items-center'>
            <div className='w-[90%] md:w-[50%] lg:w-[25%] bg-white drop-shadow-lg rounded-md grid gap-6 p-4'>
                <div className='flex items-center justify-center flex-col'>
                    <span className='text-3xl font-semibold'>Username</span>
                    <span>{moment(Date.now()).format("ll")}</span>
                </div>
                <button className='bg-green-400 text-white rounded-md py-4 text-2xl font-semibold'>Time-in</button>
            </div>
        </div>
    )
}

export default AttendancePage;