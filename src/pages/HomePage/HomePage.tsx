import { useState, useEffect } from 'react';
import { Navbar, MySpotifyPlayer } from '../../components';
import { getTokens } from '../../utils';

const HomePage: React.FC = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    // Fetch or retrieve the Spotify access token here
    // This could be from a login flow, an API call, or local storage
    const token = getTokens('SpotifyToken'); // Replace with the logic to get the actual token
    const accessToken = token?.accessToken;
    if (!accessToken) return;

    setAccessToken(accessToken);
  }, []);

  return (
    <div className='flex flex-col md:px-6'>
      <Navbar />
      <h1>Home Page</h1>
      {accessToken ? (
        <MySpotifyPlayer accessToken={accessToken} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HomePage;
