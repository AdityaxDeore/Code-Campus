import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      const url = isSignUp
        ? "http://localhost:5001/api/signup"
        : "http://localhost:5001/api/login";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        return;
      }

      localStorage.setItem("isAuthenticated", "true");

      navigate("/student-dashboard");
    } catch (err) {
      setError("Server error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        )}

        <br />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <br />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <br />

        <button type="submit" disabled={isLoading}>
          {isLoading
            ? "Processing..."
            : isSignUp
            ? "Create Account"
            : "Login"}
        </button>
      </form>

      <br />

      <button onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Already have account? Login" : "Create new account"}
      </button>
    </div>
  );
};

export default Login;