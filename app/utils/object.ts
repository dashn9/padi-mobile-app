
export function binaryToBase64(data: string) {
    return Buffer.from(data, 'binary').toString('base64');
}

export function fetchObjectValuesRecursively(obj: Record<string, any>) {
    let values: unknown[] = [];

    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if (typeof obj[key] === 'object') {
                // If the property is an object, recursively call the function
                values = values.concat(fetchObjectValuesRecursively(obj[key] as Record<string, any>));
            } else {
                // If the property is not an object, add its value to the array
                values.push(obj[key]);
            }
        }
    }

    return values;
}
