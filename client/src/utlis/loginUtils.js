// export const emailToUsername = (email) => {
//     return email.split('@')[0];
// };

// export const saveAuthToken = (token, email) => {
//     localStorage.setItem('authToken', token);
//     localStorage.setItem('email', email);
//     localStorage.setItem('username', emailToUsername(email));
// };

// export const isLoggedin = () => {  
//     const token = localStorage.getItem('authToken');
//     return !!token;
// };

// export const logout = () => {
//     localStorage.removeItem('authToken');
//     localStorage.removeItem('email');
//     localStorage.removeItem('username');
// };

export const saveAuthToken = (token, username, email) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("username", username);
  localStorage.setItem("email", email);
};

export const isLoggedin = () => {
  return !!localStorage.getItem("authToken");
};

export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("email");
  localStorage.removeItem("username");
};