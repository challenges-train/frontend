import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Challenges.scss";

const ChallengeItem = ({ challenge, isAdmin, onDelete }) => (
  <li>
    {challenge.task}
    {isAdmin && <button onClick={() => onDelete(challenge.id)}>Löschen</button>}
  </li>
);

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, [isLoggedIn]);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get("https://challenges-mysql.onrender.com/api/v1/challenges");
      setChallenges(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      setError("Error fetching challenges");
      setLoading(false);
    }
  };

  const handleLogin = () => {
    if (username === "admin" && password === "zentrum") {
      setIsAdmin(true);
      setIsLoggedIn(true);
    } else if (username === "123" && password === "123") {
      setIsAdmin(false);
      setIsLoggedIn(true);
    } else {
      setError("Invalid username or password");
    }
  };

  const handlePostChallenge = async () => {
    try {
      const response = await axios.post(
        "https://challenges-mysql.onrender.com/api/v1/challenges",
        { task: newChallenge }
      );
      console.log("Challenge posted:", response.data);
      setNewChallenge("");
      fetchChallenges();
    } catch (error) {
      console.error("Error posting challenge:", error);
      setError("Error posting challenge");
    }
  };

  const handleDeleteChallenge = async (id) => {
    if (isAdmin) {
      try {
        const response = await axios.delete(`https://challenges-mysql.onrender.com/api/v1/challenges/${id}`);
        console.log("Challenge deleted:", response.data);
        fetchChallenges();
      } catch (error) {
        console.error("Error deleting challenge:", error);
        setError("Error deleting challenge");
      }
    } else {
      setError("Permission denied. Only admins can delete challenges.");
    }
  };

  return (
    <div className="challenges-container">
      <h2>Challenges</h2>

      {isLoggedIn ? (
        <>
          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}

          <div>
            <input type="text" value={newChallenge} onChange={(e) => setNewChallenge(e.target.value)} />
            <button onClick={handlePostChallenge}>Post Challenge</button>
          </div>

          <ul>
            {challenges.map((challenge) => (
              <ChallengeItem
                key={challenge.id}
                challenge={challenge}
                isAdmin={isAdmin}
                onDelete={handleDeleteChallenge}
              />
            ))}
          </ul>
        </>
      ) : (
        <div>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label>
          <button onClick={handleLogin}>Login</button>
          {error && <p>{error}</p>}
        </div>
      )}
    </div>
  );
};

export default Challenges;
