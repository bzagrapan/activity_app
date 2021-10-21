export const createMenuItemObject = (text, on_click, on_click_parameter) => {
    return {
        text: text,
        on_click: on_click,
        on_click_parameter: on_click_parameter,
    };
};

export function isStringEmpty(text) {
    if (text == null) {
        return true;
    }
    if (text.trim().length === 0) {
        return true;
    }
    return false;
}
