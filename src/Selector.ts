// Utilty functions relating to selectors.

/**
 * Find the first element based on a selector.
 * @param selector Selector used to find.
 * @param node Optional node to search from instead of `document`.
 * @returns The first that satisifies the selector.\
 * Note: *If none are found, an error is thrown.*
 */
function selector(selector: string, node?: Element) {
    const elem = (node ?? document).querySelector(selector);
    if (!elem) throw new Error("Could not find an element that satisifies this selector: " + selector);
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