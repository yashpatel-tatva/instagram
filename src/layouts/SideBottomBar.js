import React from 'react'
import { assets } from '../constants/Assets'
import { Stack } from '@mui/material'
import '../App.css'
import { NavLink } from 'react-router-dom'
import { AllRoutes } from '../constants/AllRoutes'


const SideBottomBar = ({ children }) => {
    return (
        <div className='displaytype w-screen'>
            <div className='uptotab sidebar float-left'>
                <div className='h-screen p-5 border-r-2' style={{ width: 'fit-content' }}>
                    <Stack spacing={5}>
                        <div className='flex gap-2' style={{ width: 'fit-content' }}><img src={assets.instaIcon} width={'30px'} alt='' /> </div>
                        <Stack spacing={2}>
                            <NavLink to={AllRoutes.Home}>
                                {({ isActive }) => (
                                    <div role='button' className={`flex gap-2 items-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                        <img src={isActive ? assets.homeActiveIcon : assets.homeIcon} width={'28px'} alt='' />
                                        <span className='md:hidden'>Home</span>
                                    </div>
                                )}
                            </NavLink>
                            <NavLink to={AllRoutes.Search}>
                                {({ isActive }) => (
                                    <div role='button' className={`flex gap-2 items-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                        <img src={isActive ? assets.searchActiveIcon : assets.searchIcon} width={'28px'} alt='' />
                                        <span className='md:hidden'>Search</span>
                                    </div>
                                )}
                            </NavLink>
                            <NavLink to={AllRoutes.Explore}>
                                {({ isActive }) => (
                                    <div role='button' className={`flex gap-2 items-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                        <img src={isActive ? assets.exploreActiveIcon : assets.exploreIcon} width={'28px'} alt='' />
                                        <span className='md:hidden'>Explore</span>
                                    </div>
                                )}
                            </NavLink>
                            <NavLink to={AllRoutes.Reels}>
                                {({ isActive }) => (
                                    <div role='button' className={`flex gap-2 items-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                        <img src={isActive ? assets.reelsActiveIcon : assets.reelsIcon} width={'28px'} alt='' />
                                        <span className='md:hidden'>Reels</span>
                                    </div>
                                )}
                            </NavLink>
                            <NavLink to={AllRoutes.Messages}>
                                {({ isActive }) => (
                                    <div role='button' className={`flex gap-2 items-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                        <img src={isActive ? assets.dmsActiveIcon : assets.dmsIcon} width={'28px'} alt='' />
                                        <span className='md:hidden'>Messages</span>
                                    </div>
                                )}
                            </NavLink>
                            <NavLink to={AllRoutes.Notification}>
                                {({ isActive }) => (
                                    <div role='button' className={`flex gap-2 items-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                        <img src={isActive ? assets.notificationActiveIcon : assets.notificationIcon} width={'28px'} alt='' />
                                        <span className='md:hidden'>Notification</span>
                                    </div>
                                )}
                            </NavLink>
                            <NavLink >
                                {/* {({ isActive }) => ( */}
                                <div role='button' className={`flex gap-2 items-center`}>
                                    <img src={assets.addIcon} width={'28px'} alt='' />
                                    <span className='md:hidden'>Add</span>
                                </div>
                                {/* )} */}
                            </NavLink>
                            <NavLink to={AllRoutes.UserProfile}>
                                {({ isActive }) => (
                                    <div role='button' className={`flex gap-2 items-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                        <img src={isActive ? assets.personIcon : assets.personIcon} width={'28px'} alt='' />
                                        <span className='md:hidden'>Profile</span>
                                    </div>
                                )}
                            </NavLink>
                        </Stack>
                    </Stack>
                </div>
            </div>
            <div className='formobile bottombar w-screen'>
                <div className='w-full border-t-2' style={{ padding: '2%' }}>
                    <Stack direction={'row'} justifyContent={'space-around'}>
                        <NavLink to={AllRoutes.Home}>
                            {({ isActive }) => (
                                <div role='button' className={`flex gap-2 items-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                    <img src={isActive ? assets.homeActiveIcon : assets.homeIcon} width={'28px'} alt='' />
                                    <span className='md:hidden'>Home</span>
                                </div>
                            )}
                        </NavLink>
                        <NavLink to={AllRoutes.Search}>
                            {({ isActive }) => (
                                <div role='button' className={`flex gap-2 items-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                    <img src={isActive ? assets.searchActiveIcon : assets.searchIcon} width={'28px'} alt='' />
                                    <span className='md:hidden'>Search</span>
                                </div>
                            )}
                        </NavLink>
                        <NavLink to={AllRoutes.Reels}>
                            {({ isActive }) => (
                                <div role='button' className={`flex gap-2 items-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                    <img src={isActive ? assets.reelsActiveIcon : assets.reelsIcon} width={'28px'} alt='' />
                                    <span className='md:hidden'>Reels</span>
                                </div>
                            )}
                        </NavLink>
                        <NavLink to={AllRoutes.Messages}>
                            {({ isActive }) => (
                                <div role='button' className={`flex gap-2 items-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                    <img src={isActive ? assets.dmsIcon : assets.dmsIcon} width={'28px'} alt='' />
                                    <span className='md:hidden'>Messages</span>
                                </div>
                            )}
                        </NavLink>
                        <NavLink to={AllRoutes.UserProfile}>
                            {({ isActive }) => (
                                <div role='button' className={`flex gap-2 items-center ${isActive ? 'text-blue-500' : 'text-gray-500'}`}>
                                    <img src={isActive ? assets.personIcon : assets.personIcon} width={'28px'} alt='' />
                                    <span className='md:hidden'>Profile</span>
                                </div>
                            )}
                        </NavLink>
                    </Stack>
                </div>
            </div>
            <div className='overflow-scroll h-screen'>
                {children}
            </div>
        </div>
    )
}

export default SideBottomBar;