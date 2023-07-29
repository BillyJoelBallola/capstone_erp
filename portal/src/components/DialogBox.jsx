import React from 'react';
import { Dialog } from 'primereact/dialog';

const DialogBox = ({ visible, setVisible, func }) => {
    const footerContent = (
        <div className='flex gap-1 justify-end'>
            <button className='btn-dark-outlined' onClick={() => setVisible(false)}>No</button>
            <button className='btn-dark px-4' onClick={func}>Yes</button>
        </div>
    );
    
    return (
        <Dialog header="Check Out" visible={visible} onHide={() => setVisible(false)} footer={footerContent}>
            <div className='text-center'>
                <p className="m-0 font-semibold text-lg">Are you sure you want to leave this page?</p>
                <p className="m-0 text-sm">Once you leave, the process will automatically cancel.</p>
            </div>
        </Dialog>
    )
}

export default DialogBox