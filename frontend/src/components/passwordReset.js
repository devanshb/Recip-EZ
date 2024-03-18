// PasswordReset.js
import axios from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

export const PasswordReset = () => {
    const { uidb64, token } = useParams();
    const [password, setPassword] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://backend-url/password-reset/${uidb64}/${token}/`, { password });
            console.log(response.data.message);
        } catch (error) {
            console.error(error.response.data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Reset Password</button>
        </form>
    );
};
