import React, { useContext } from 'react';
import { ToastContainer, toast } from "react-toastify";
import { UserContext } from "../context/UserContext";
import { operations } from "../static/operations";
import { useNavigate } from 'react-router-dom';

const Operations = () => {
    const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);

    const access = (path) => {  
        const splitPath = path.split("/")[1];
        let location = "";

        currentUser?.userAccess?.forEach(acs => {
            if(splitPath === acs.name && acs.access === true){
                location = path;
            }
        });
        
        if(location !== ""){
            navigate(location);
        }else{
            return toast.warning("Your account don't have permission to access this operation.", { position: toast.POSITION.BOTTOM_RIGHT });
        }
    }

    return (
        <>
            <ToastContainer 
                draggable={false}
                hideProgressBar={true}
            />
            <div className='py-28 w-screen h-screen overflow-y-auto grid place-items-center pb-5 md:pt-0 bg-gray-100'>
                <div className='grid grid-cols-2 gap-5 md:grid-cols-4 md:gap-14 md:gap-y-10'>
                    {
                        operations?.map((op, idx) => (
                            <div className='grid place-items-center gap-4 text-center' key={idx}>
                                <div onClick={() => access(op.path)} className="border cursor-pointer grid place-items-center rounded-md bg-white w-28 aspect-square drop-shadow-md hover:shadow-xl duration-200">{op.icon}</div>
                                <span className='text-sm font-semibold'>{op.name}</span>
                            </div>  
                        ))
                    }
                </div>
            </div>
        </>
    )
}

export default Operations