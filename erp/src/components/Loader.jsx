import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

const Loader = () => {
    return (
        <div className='loader'>
            <ProgressSpinner strokeWidth="4" /> 
        </div>
    )
}

export default Loader;