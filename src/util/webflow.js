/**
 * Handles the Webflow editor view.
 * @param {function} onEditorView - Callback function to execute when in editor view.
 * @returns {boolean} - Returns true if in editor view, false otherwise.
 */
export function handleEditor(onEditorView = null) {
  if (Webflow.env("editor") !== undefined) {
    if (onEditorView !== null) onEditorView();
    console.log("Webflow Editor View");
    return true;
  } else {
    return false;
  }
}

/**
 * Resets the Webflow environment.
 */
export function resetWebflow() {
  // check if it actuallw works
  window.Webflow && window.Webflow.destroy();
  window.Webflow && window.Webflow.ready();
  window.Webflow && window.Webflow.require("ix2").init();
}
