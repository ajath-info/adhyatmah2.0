import { Menu, MenuItem } from '@mui/material';
import { useState } from 'react';
import Image from 'next/image';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'mr', label: 'Marathi' },
  { code: 'sa', label: 'Sanskrit' },
  { code: 'bn', label: 'Bengali' },
  { code: 'gu', label: 'Gujarati' },
  { code: 'or', label: 'Odia' },
  { code: 'ta', label: 'Tamil' },
  { code: 'te', label: 'Telugu' },
  { code: 'kn', label: 'Kannada' },
  { code: 'ml', label: 'Malayalam' }
];

export default function LanguageSwitcher() {
  const [lang, setLang] = useState('en');
  const [anchorEl, setAnchorEl] = useState(null);

  const handleOpen = (e) => setAnchorEl(e.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleChange = (value) => {
    setLang(value);
    handleClose();

    const interval = setInterval(() => {
      const googleSelect = document.querySelector('.goog-te-combo');
      if (googleSelect) {
        googleSelect.value = value;
        googleSelect.dispatchEvent(new Event('change'));
        clearInterval(interval);
      }
    }, 500);
  };

  return (
    <div className="notranslate" translate="no">

      {/* IMAGE BUTTON */}
      <div
        onClick={handleOpen}
        style={{
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <Image
  src="/images/adhyatmah-language-logo.png"
  alt="Language"
  width={36}
  height={46}
  style={{ display: 'block' }}
/>
      </div>

      {/* DROPDOWN MENU */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {languages.map((item) => (
          <MenuItem key={item.code} onClick={() => handleChange(item.code)}>
            {item.label}
          </MenuItem>
        ))}
      </Menu>

    </div>
  );
}