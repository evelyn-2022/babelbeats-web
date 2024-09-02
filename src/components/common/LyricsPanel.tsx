import React, { useState } from 'react';
import { LyricsSearch } from '../../components';

const LyricsPanel: React.FC = () => {
  const [lyrics, setLyrics] = useState<string>('');
  return (
    <div className='w-full h-full'>
      {lyrics ? (
        <div>Lyrics</div>
      ) : (
        <LyricsSearch lyrics={lyrics} setLyrics={setLyrics} />
      )}
    </div>
  );
};

export default LyricsPanel;
