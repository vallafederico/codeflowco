function isArrowFunction(str) {
  const arrowFunctionRegex =
    /^(\s*[(]?[a-zA-Z0-9\s,]*[)]?\s*=>\s*{?\s*[\s\S]*}?)/;
  return arrowFunctionRegex.test(str);
}

/**
 * Evaluates the configuration data of a given selector and returns an object with the resulting values.
 *
 * @param {string} selector - The CSS selector of the element containing the configuration data.
 * @param {Object} [defaults={}] - The default values to use if the configuration data is not found or is invalid.
 * @returns {Object} An object with the resulting configuration values.
 */
export function evalConfig(selector, defaults = {}) {
  const data = document.querySelector(selector);
  if (!data) return { ...defaults };

  const out = { ...data.dataset };

  for (const item in out) {
    const value = out[item];

    if (value === "" || value === " ") {
      // remove empties
      // out[item] = value;
    } else if (!isNaN(value)) {
      // compute numbers
      out[item] = +value;
    } else if (value === "true" || value === "false") {
      // compute boolean
      if (value === "true") {
        out[item] = true;
      } else out[item] = false;
    } else if (isArrowFunction(value)) {
      // console.log("arrow function", value);
      out[item] = new Function(`return ${value};`)();
    } else {
      // copy if string
      out[item] = value;
      //console.log("to be found", item, out[item], "type:", typeof out[item]);
    }
  }

  return { ...defaults, ...out };
}
