// services/Login.js

const login = async (data) => {
  console.log('Login data:', data);
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: data.email,
      password: data.password
    })
  });

  const responseData = await response.json();
console.log(responseData);
  if (responseData.type === 'success') {
    localStorage.setItem('user', JSON.stringify(responseData.user));

    await fetch('/api/set-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: responseData.token })
    });
  }

  return responseData;
};

export default login;
