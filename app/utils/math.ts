export function simpleHash(number: number | string) {
    const input = number.toString();

    // Initialize the hash value
    let hash = 0;

    for (let i = 0; i < input.length; i++) {
        // Get the character code of the current character
        const charCode = input.charCodeAt(i);

        // Update the hash using a simple calculation
        // eslint-disable-next-line no-bitwise
        hash = (hash << 5) - hash + charCode;
    }

    return hash;
}

export function generateRandomString(length = 20) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}
