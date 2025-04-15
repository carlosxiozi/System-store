

const Login = async (data) => {
        const response = await fetch('https://sistema-tiendasss-1.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: data.email,
                password: data.password
            })
        });
        const responseData = await response.json();
        return responseData
};

export default Login;
