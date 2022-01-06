export const getUserName = () => {
  const objUserInfo = new ActiveXObject("WScript.network");
  return objUserInfo.UserName;
};
