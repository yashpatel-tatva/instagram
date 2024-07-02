import React from 'react'

const ErrorModal = ({ open, message }) => {
    return (
        <span style={{ color: 'red' }} open={open}   >
            {message}
        </span>
    )
}

export default ErrorModal
