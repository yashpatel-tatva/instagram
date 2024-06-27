import React, { useEffect, useState } from 'react'
import styles from '../landphoneimg/LandPhoneImg.module.css'
import phoneScreen1 from '../../assets/img/png/phonescreen1.png'
import phoneScreen2 from '../../assets/img/png/phonescreen2.png'
import phoneScreen3 from '../../assets/img/png/phonescreen3.png'
import phone from '../../assets/img/png/phone.png'

const LandPhoneImg = () => {

    const [thisImg, setthisImg] = useState(phoneScreen1);

    useEffect(() => {
        const screenImages = [phoneScreen1, phoneScreen2, phoneScreen3];
        const changeScreenImage = () => {
            const randomIndex = Math.floor(Math.random() * screenImages.length);
            setthisImg(screenImages[randomIndex]);
        };
        const interval = setInterval(changeScreenImage, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className='flex md:hidden w-6/12 justify-end h-screen items-center' >
            <div className={styles.phone}>
                <img src={phone} draggable={false} alt=''></img>
                <div className={styles.phonescreen}><img src={thisImg} draggable={false} alt=''></img></div>
            </div>
        </div>
    )
}

export default LandPhoneImg
