
export function binaryToBase64(data: string) {
    return Buffer.from(data, 'binary').toString('base64');
}
