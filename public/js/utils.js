export const isNumber = (value) => {
    if (typeof value === "number") return true;

    return !isNaN(value) && !isNaN(parseFloat(value));
};
