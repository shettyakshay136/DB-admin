type Tkey = "travel-admin";

export interface LocalStorageValue {
    token?: string | null;
    admin?: {
        name: string;
        email: string;
        uid: number;
    } | null;
}

export const localStorageValue: LocalStorageValue = {
    token: null,
    admin: null,
};

export const getLocalStorage = (key: Tkey) => {
    const localStorageData = localStorage.getItem(key);
    const parsedData: LocalStorageValue = localStorageData ? JSON.parse(localStorageData) : null;
    return parsedData;
};

export const setLocalStorage = <T>(key: Tkey, value: T) => {
    const stringifyValue = JSON.stringify(value);
    return localStorage.setItem(key, stringifyValue);
};

export function generatePassword(length = 12) {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
    let password = '';
    
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    
    return password;
}
