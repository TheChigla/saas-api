export const selectParams = (params?: string): string => {
  return params
    ? '-createdAt -updatedAt -__v ' + params
    : '-createdAt -updatedAt -__v';
};
