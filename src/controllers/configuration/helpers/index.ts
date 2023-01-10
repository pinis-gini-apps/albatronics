export const isValidTypeId = (typesIds: number[]) => {
    const inRange = (currentValue: number) => (currentValue < 35 && currentValue >= 0);
    if (!typesIds.every(inRange)) return false;
    return true;
};

export const isValidDataType = (dataTypes: number[]) => {
    const inRange = (currentValue: number) => (currentValue < 24 && currentValue >= 0);
    if (!dataTypes.every(inRange)) return false;
    return true;
};