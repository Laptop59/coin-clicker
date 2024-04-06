// Utilty functions relating to selectors.

type ParentElement = Element | Document;

/**
 * This cache is used for repeating calls to the same selector.
 */
const cache: {[key: string]: Element} = {};

/**
 * Find the first element based on a selector.
 * @param selector Selector used to find.
 * @param node Optional node to search from instead of `document`.
 * @returns The first that satisifies the selector.\
 * Note: *If none are found, an error is thrown.*
 */
function selector(selector: string, node: ParentElement = document) {
    if (node === document && cache[selector]) return cache[selector];
    const elem = node.querySelector(selector);
    if (!elem) throw new Error("Could not find an element that satisifies this selector: " + selector);
    cache[selector] = elem;
    return elem;
}

/**
 * Find all elements based on a selector.
 * @param selector Selector used to find.
 * @param node Optional node to search from instead of `document`.
 * @returns All that satisifies the selector.
 */
function selectorAll(selector: string, node?: Element) {
    return (node ?? document).querySelectorAll(selector);
}

/**
 * Asserts a value
 * @param value Value to assert.
 * @returns The value itself. If the value is `falsy`, an error is thrown.
 */
function assert(value: any) {
    if (!value) throw new Error("Assertion failed: " + value);
    return value;
}

export { selector, selectorAll, assert };