import React, { useState, useEffect } from "react";
import axios from "axios";

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [newChallenge, setNewChallenge] = useState("");
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get("https://challenges-mysql.onrender.com/api/v1/challenges");
      setChallenges(response.data.data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const handlePostChallenge = async () => {
    try {
      const response = await axios.post(
        "https://challenges-mysql.onrender.com/api/v1/challenges",
        { task: newChallenge },
       
      );
      console.log("Challenge posted:", response.data);
      setNewChallenge("");
      fetchChallenges();
    } catch (error) {
      console.error("Error posting challenge:", error);
    }
  };

  const handleDeleteChallenge = async (id) => {
    try {
      const response = await axios.delete(`https://challenges-mysql.onrender.com/api/v1/challenges/${id}`, {
        headers: { Authorization: isAdmin ? "Basic MTIzOjEyMw==" : "" }
      });
      console.log("Challenge deleted:", response.data);
      fetchChallenges();
    } catch (error) {
      console.error("Error deleting challenge:", error);
    }
  };


  return (
    <div>
      <h2>Challenges</h2>
  
        <div>
          <input type="text" value={newChallenge} onChange={(e) => setNewChallenge(e.target.value)} />
          <button onClick={handlePostChallenge}>Post Challenge</button>
        </div>
   


      <ul>
        {challenges.map((challenge) => (
          <li key={challenge.id}>
            {challenge.task}
            
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Challenges;
