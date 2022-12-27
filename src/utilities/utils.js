/**
 * Checks if a valid string;
 * @param val: number/string/object/array != (undefined or null)
 */
export const validValue = (val) => {
    return typeof val !== 'undefined' && val && val !== undefined
}


/**
 * Checks if a valid object
 * @param obj: object
 */
export const strictValidObject = (obj) =>
    obj &&
    obj === Object(obj) &&
    Object.prototype.toString.call(obj) !== '[object Array]';

/**
 * Checks if a valid object with keys
 * @param obj: object
 */
export const strictValidObjectWithKeys = (obj) =>
    strictValidObject(obj) && !!Object.keys(obj).length;
