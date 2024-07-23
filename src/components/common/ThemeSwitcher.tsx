import React from 'react';
import { useTheme } from '../../context';

const ThemeSwitcher: React.FC = () => {
  const { themePreference, setThemePreference } = useTheme();

  return (
    <div className='relative'>
      <select
        value={themePreference}
        onChange={e =>
          setThemePreference(e.target.value as 'light' | 'dark' | 'system')
        }
        className='py-3 bg-transparent focus:outline-none'
      >
        <option value='system'>System</option>
        <option value='light'>Light</option>
        <option value='dark'>Dark</option>
      </select>
    </div>
  );
};

export default ThemeSwitcher;
