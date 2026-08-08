import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async () => {
        try {
            const response = await login({
                email,
                password,
            });

            localStorage.setItem("accessToken", response.data.accessToken);
            localStorage.setItem("refreshToken", response.data.refreshToken);

            dispatch(loginSuccess(response.data.user));

            navigate("/dashboard");

            console.log(response.data);
        } catch (error) {
            console.error(error);
            alert("Login failed.");
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">

                    <div className="card p-4">

                        <h3 className="mb-4 text-center">
                            Login
                        </h3>

                        <input
                            type="email"
                            className="form-control mb-3"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            className="form-control mb-3"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <button
                            className="btn btn-primary w-100"
                            onClick={handleLogin}
                        >
                            Login
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}

export default Login;