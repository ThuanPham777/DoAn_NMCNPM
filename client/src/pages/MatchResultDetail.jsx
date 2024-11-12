import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const MatchResultDetail = () => {
  const { id } = useParams();
  const [match, setMatch] = useState(null);

  useEffect(() => {
    fetch('/assets/data/rounds.json')
      .then((response) => response.json())
      .then((jsonData) => {
        const matchData = jsonData
          .flatMap((round) => round.matches)
          .find((match) => match.id === parseInt(id));
        setMatch(matchData);
      })
      .catch((error) => console.error('Error loading data:', error));
  }, [id]);

  if (!match) return <div>Loading...</div>;

  return (
    <div className='match-detail'>
      <h1 className='text-2xl font-bold mb-4'>
        {match.team1} vs {match.team2}
      </h1>
      <div className='flex items-center justify-center mb-6'>
        <img
          src={`/assets/logos/${match.team1}.png`}
          alt={match.team1}
          className='w-20 h-20 mx-4'
        />
        <h2 className='text-3xl font-bold mx-4'>{match.score}</h2>
        <img
          src={`/assets/logos/${match.team2}.png`}
          alt={match.team2}
          className='w-20 h-20 mx-4'
        />
      </div>
      {/* Add events display here, e.g., goals, cards */}
    </div>
  );
};

export default MatchResultDetail;
