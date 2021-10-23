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

export const isActivityOkByFilters = (activity, filters) => {
    let isTypeOk = true;
    let isPriceOk = true;
    let areParticipantsOk = true;

    if (!isStringEmpty(filters.activity_type) && filters.activity_type !== activity.type) {
        isTypeOk = false;
    }

    if (!isStringEmpty(filters.price.min) && activity.price < parseFloat(filters.price.min)) {
        isPriceOk = false;
    }

    if (!isStringEmpty(filters.price.max) && activity.price > parseFloat(filters.price.max)) {
        isPriceOk = false;
    }

    if (!isStringEmpty(filters.participants.min) && activity.participants < parseFloat(filters.participants.min)) {
        areParticipantsOk = false;
    }

    if (!isStringEmpty(filters.participants.max) && activity.participants > parseFloat(filters.participants.max)) {
        areParticipantsOk = false;
    }

    return isTypeOk && isPriceOk && areParticipantsOk ? true : false;
};
