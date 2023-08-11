import React from 'react';
import { Dialog } from 'primereact/dialog';

const DialogBox = ({ visible, setVisible, header, w, children }) => {
    return (
        <Dialog 
            header={header} 
            visible={visible} 
            style={{ width: `${w ? w : '75vw'}` }} 
            onHide={() => setVisible(false)}
        >
            {children}
        </Dialog>
    )
}

export default DialogBox;