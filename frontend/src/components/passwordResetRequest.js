// PasswordResetRequest.js
import axios from "axios";
import { useState } from "react";

export const PasswordResetRequest = () => {
    const [email, setEmail] = useState("");
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://backend-url/password-reset-request/", { email });
            console.log(response.data.message);
        } catch (error) {
            console.error(error.response.data.error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button type="submit">Send Password Reset Email</button>
        </form>
    );
};
