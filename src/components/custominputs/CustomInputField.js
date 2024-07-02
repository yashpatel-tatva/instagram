import React, { useState } from 'react'
import styles from './CustomInputField.module.css'
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone';
import CancelTwoToneIcon from '@mui/icons-material/CancelTwoTone';

const CustomInputField = ({ label, type, onInputChange, iconType = "none", id = '' }) => {
    const [inputType, setInputType] = useState(type);
    const [showPass, setShowPass] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [showicon, setshowicon] = useState(true)
    const handleToggleType = () => {
        setShowPass(!showPass);
        setInputType(showPass ? 'password' : 'text');
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        onInputChange(value);
    };
    const handleBlur = (e) => {
        // const value = e.target.value;
        setshowicon(true)
    };

    return (
        <div className='mb-3'>
            <div className={`${styles.formGroup} flex items-center rounded`}>
                <input type={inputType} className={styles.formControl} placeholder='' onChange={handleChange} value={inputValue} onBlur={handleBlur} onFocus={() => setshowicon(false)} /><span>{label}</span>
                {(showicon && iconType !== "none") && (iconType ? <label style={{ padding: '0px 3px' }}><CheckCircleTwoToneIcon sx={{ color: 'green' }} /></label> : <label style={{ padding: '0px 3px' }}><CancelTwoToneIcon sx={{ color: 'red' }} /></label>)}
                {type === 'password' && (
                    <label role='button' onClick={handleToggleType} className={styles.passshow}>
                        {inputValue ? (showPass ? 'Hide' : 'Show') : ''}
                    </label>
                )}
            </div>
        </div>
    );
};

export default CustomInputField
