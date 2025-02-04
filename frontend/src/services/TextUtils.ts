const capitalizeFirstLetter = (text: string) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

const removeAfterFirstComma = (text: string) => {
  if (!text) return text;
  const index = text.indexOf(',');
  return index === -1 ? text : text.substring(0, index);
};

export { capitalizeFirstLetter, removeAfterFirstComma };