import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const Loader = () => {
    return (
        <div className='absolute pointer-events-none h-screen w-screen bg-black/40 z-50 grid place-items-center'>
            <ProgressSpinner strokeWidth="4" /> 
        </div>
    )
}

export default Loader;