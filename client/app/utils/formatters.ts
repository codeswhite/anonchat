export const formatName = (name: string) => {
  if (name.length < 64) return name;
  // Cut hash
  return "אנונימי " + name.slice(0, 8);
};

export const formatDate = (date?: string) => {
  if (!date) return "";
  const dateObj = new Date(date);
  return dateObj.toLocaleString("he-IL");
};
