export function hexToInt(hex) {
    return parseInt(hex, 16);
}

export function intToHex(int) {
    return int.codePointAt(0).toString(16);
}

export function unicodeToString(unicode) {
    return String.fromCharCode(parseInt(unicode, 16));
}