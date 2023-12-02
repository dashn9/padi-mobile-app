export function capitalizeFirstLetter(str: string | undefined) {
    if (typeof str === 'undefined') {
        return '';
    }

    return str.charAt(0).toUpperCase() + str.slice(1);
}
