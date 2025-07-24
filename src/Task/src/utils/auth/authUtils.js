
export const isAuthenticated = () => {
  return !!localStorage.getItem('auth_token');
};

export const getStoredUser = () => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

export const getAuthToken = () => {
  return localStorage.getItem('auth_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};


export const storeAuthData = (data) => {
  localStorage.setItem('auth_token', data.token);
  localStorage.setItem('refresh_token', data.refreshToken);
  localStorage.setItem('user_data', JSON.stringify(data.user));
};


export const clearAuthData = () => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_data');
}; 