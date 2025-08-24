// auth.js
export const getLoggedInUser = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;
  const user = JSON.parse(storedUser);
  if (!user._id && user.id) user._id = user.id; // support _id or id
  return user;
};
