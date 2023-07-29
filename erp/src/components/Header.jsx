import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { TieredMenu } from 'primereact/tieredmenu';
import DynamicLinks from './DynamicLinks';
import axios from "axios";

const Header = () => {
  const menu = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

    const headerItem = [
        {
            template: <div className='m-2 py-2 px-4 font-semibold text-gray-600 rounded-lg bg-gray-100'>{currentUser?.name}</div>,
        },
        {
            label: 'My Profile',
        },
        {
            separator: true
        },
        {
            label: 'Sign Out',
            command: () => logout()
        },
    ]

    useEffect(() => {
        window.cookieStore.get('token')
        .then((token) => {
            const { value } = token; 
            if(!value) navigate("/login");
        })
        .catch((err) => {
            navigate("/login");
        })
    }, [])
    
    const logout = () => {
        axios.post("/erp/logout").then((res) => {
        navigate("/login");
        })
    }

    const AvatarInitials = () => {
        const split = currentUser?.name?.split(" ");
        if(split){
        return (
            <div className='uppercase bg-gray-600 py-1 px-2 rounded-md text-white font-semibold'>{`${split[0].slice(0, 1)}${split[1].slice(0, 1)}`}</div>
        )
        }
    }

    return (
        <nav className='z-40 w-screen py-2 bg-white/[.1] backdrop-blur-xl md:bg-transparent top-0 fixed px-6'>
            <div className='flex justify-between items-center w-full'>
                <DynamicLinks />
                <div className='relative'>
                    <button onClick={(e) => menu.current.toggle(e)}>
                        {
                            currentUser &&
                            currentUser.userImage ?
                            <img src={currentUser.userImage} alt="user-image" />
                            :
                            <AvatarInitials />
                        }
                    </button>
                    <TieredMenu model={headerItem} popup ref={menu} breakpoint="767px" className='text-sm'/>
                </div>
            </div>
        </nav>
    )
}

export default Header