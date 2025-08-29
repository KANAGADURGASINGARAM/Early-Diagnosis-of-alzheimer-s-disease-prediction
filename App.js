import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState("");
  const [loading, setLoading] = useState(false);

  // For login
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // File change
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Upload
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error(error);
      alert("Error uploading file!");
    } finally {
      setLoading(false);
    }
  };

  // Login function (simple validation)
  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
    } else {
      alert("Invalid credentials! Try admin / 1234");
    }
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <div className="login-page">
          <h2>🔐 Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <br />
            <button type="submit">Login</button>
          </form>
        </div>
      ) : (
        <div className="predict-page">
          <h1>🧠 Alzheimer's Disease Prediction</h1>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Predicting..." : "Predict"}
          </button>
          {prediction && (
            <div className="result">
              <h2>Prediction:</h2>
              <p>{prediction}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
