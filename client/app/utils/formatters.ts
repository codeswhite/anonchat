import max from "lodash/max";
import min from "lodash/min";

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

export const formatPid = (str?: string) => {
  const pid = str && parseInt(str) || 0;
  return min([max([pid, 0]), 999999999]) || 0;
};
