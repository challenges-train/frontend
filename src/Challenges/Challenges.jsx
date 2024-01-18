import React, { useState, useEffect } from "react";
import axios from "axios";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchChallenges();
  }, []);

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
    try {
      if (isAdmin) {
        const response = await axios.delete(`https://challenges-mysql.onrender.com/api/v1/challenges/${id}`);
        console.log("Challenge deleted:", response.data);
        fetchChallenges();
      } else {
        console.error("User is not an admin");
        setError("User is not an admin");
      }
    } catch (error) {
      console.error("Error deleting challenge:", error);
      setError("Error deleting challenge");
    }
  };

  return (
    <div>
      <h2>Challenges</h2>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      <div>
        <input type="text" value={newChallenge} onChange={(e) => setNewChallenge(e.target.value)} />
        <button onClick={handlePostChallenge}>Post Challenge</button>
      </div>

      <ul>
        {challenges.map((challenge) => (
          <li key={challenge.id}>
            {challenge.task}
            {isAdmin && (
              <button onClick={() => handleDeleteChallenge(challenge.id)}>
                Delete Challenge
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Challenges;
