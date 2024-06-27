import { phoneRegex, emailRegex, usernameRegex, passwordRegex } from '../constants/Regex'

export const isNullOrEmptyOrWhitespace = (str) => {
    return !str || str.trim() === '';
};

export const phoneValid = (str) => {
    return phoneRegex.test(str);
};
export const emailValid = (str) => {
    return emailRegex.test(str);
};
export const usernameValid = (str) => {
    return usernameRegex.test(str);
};
export const passwordValid = (str) => {
    return passwordRegex.test(str);
};


export const isLoginValid = (id, password) => {
    if (isNullOrEmptyOrWhitespace(id) || isNullOrEmptyOrWhitespace(password)) {
        return false;
    }
    if (!(phoneValid(id) || emailValid(id) || usernameValid(id))) {
        return false;
    }
    if (!(passwordValid(password))) {
        return false;
    }
    return true;
}

export const isSignupValid = (id, username, password) => {
    if (isNullOrEmptyOrWhitespace(id) || isNullOrEmptyOrWhitespace(password) || isNullOrEmptyOrWhitespace(username)) {
        return false;
    }
    if (!(phoneValid(id) || emailValid(id))) {
        return false;
    }
    if (!(passwordValid(password))) {
        return false;
    }
    if (!(usernameValid(username))) {
        return false;
    }
    return true;
}

export const isIdValid = (id) => {
    if (isNullOrEmptyOrWhitespace(id)) {
        return false;
    }
    if (!(phoneValid(id) || emailValid(id) || usernameValid(id))) {
        return false;
    }
    return true;
}

export const getIdType = (id) => {
    if (phoneValid(id)) return "phone"
    if (emailValid(id)) return "email"
    if (usernameValid(id)) return "username"
}