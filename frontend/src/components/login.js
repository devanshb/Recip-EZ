import axios from "axios";
import {useState} from "react";
import './login.css';

export const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState("");

    const submit = async e => {
        e.preventDefault();

        const user = {
            username: username,
            password: password
          };

        try {
            const {data} = await axios.post('http://localhost:8000/token/', user ,{headers: {
                'Content-Type': 'application/json'
            }}, {withCredentials: true});

            if (data && data.access) {
                console.log(data)
                localStorage.clear();
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                axios.defaults.headers.common['Authorization'] = `Bearer ${data['access']}`;
                window.location.href = '/'
            }
            else {
                setError('Invalid username or password. Try again.');

            }
        }
        catch (error) {
            console.error('Error occurred while logging in:', error);
            setError('An error occurred while logging in. Please try again.');
        }


    }

    return(
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={submit}>
                <div className="Auth-form-content">
                <h3 className="Auth-form-title">Sign In</h3>
                <div className="form-group mt-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                    id="username"
                    className="form-control mt-1"
                    placeholder="Enter Username"
                    name="username"
                    type="text"
                    value={username}
                    required
                    onChange={e => setUsername(e.target.value)}
                    />
                </div>
                <div className="form-group mt-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control mt-1"
                    placeholder="Enter password"
                    value={password}
                    required
                    onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="d-grid gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
                {error && <p className="text-danger">{error}</p>}
                </div>
            </form>
        </div>

    )
}