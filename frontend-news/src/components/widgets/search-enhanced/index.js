'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

// mui
import { Box, TextField, Button, Menu, MenuItem, Typography, InputAdornment, Paper, Stack } from '@mui/material';
import { IoSearchOutline } from 'react-icons/io5';
import { HiChevronDown } from 'react-icons/hi2';

const COLLECTION_OPTIONS = [
  { value: 'all', label: 'All Collection' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'fashion', label: 'Fashion' },
  { value: 'home-garden', label: 'Home & Garden' },
  { value: 'books', label: 'Books' },
  { value: 'festivals', label: 'Festival Collection' },
  { value: 'new-arrivals', label: 'New Arrivals' },
  { value: 'bestsellers', label: 'Bestsellers' }
];

export default function SearchEnhanced() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCollection, setSelectedCollection] = React.useState('all');
  const [collectionAnchor, setCollectionAnchor] = React.useState(null);
  const collectionOpen = Boolean(collectionAnchor);

  const handleCollectionClick = (event) => {
    setCollectionAnchor(event.currentTarget);
  };

  const handleCollectionClose = (collectionValue = null) => {
    if (collectionValue) {
      setSelectedCollection(collectionValue);
    }
    setCollectionAnchor(null);
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      try {
        // Use the correct API endpoint with GET method
        const params = new URLSearchParams({
          q: searchQuery.trim()
        });

        if (selectedCollection !== 'all') {
          params.append('collection', selectedCollection);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?${params.toString()}`);

        if (response.ok) {
          // API call successful, redirect to products page
          router.push(`/products?${params.toString()}`);
        } else {
          // API call failed, still redirect
          router.push(`/products?${params.toString()}`);
        }
      } catch (error) {
        console.error('Search error:', error);
        // Fallback to simple navigation even if API fails
        const params = new URLSearchParams({
          q: searchQuery.trim()
        });

        if (selectedCollection !== 'all') {
          params.append('collection', selectedCollection);
        }

        router.push(`/products?${params.toString()}`);
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const selectedCollectionLabel =
    COLLECTION_OPTIONS.find((option) => option.value === selectedCollection)?.label || 'All Collection';

  return (
    <Paper
      elevation={0}
      sx={{
        display: 'flex',
        alignItems: 'center',
        border: 1,
        borderColor: 'divider',
        borderRadius: 6,
        overflow: 'hidden',
        bgcolor: '#f5f5f5',
        width: { xs: '100%', md: '100%' },
        maxWidth: 600,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}
    >
      {/* Collection Dropdown */}

      <Menu anchorEl={collectionAnchor} open={collectionOpen} onClose={() => handleCollectionClose()}>
        {COLLECTION_OPTIONS.map((option) => (
          <MenuItem
            key={option.value}
            onClick={() => handleCollectionClose(option.value)}
            selected={selectedCollection === option.value}
          >
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {/* Search Input */}
      <TextField
        px={5}
        variant="outlined"
        placeholder="Search our product"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        sx={{
          flex: 1,
          '& .MuiOutlinedInput-root': {
            border: 'none',
            '& fieldset': {
              border: 'none'
            },
            '&:hover fieldset': {
              border: 'none'
            },
            '&.Mui-focused fieldset': {
              border: 'none'
            }
          },
          '& .MuiInputBase-input': {
            padding: '16px 12px',
            fontSize: '0.95rem'
          }
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Box sx={{ color: 'text.secondary', mr: 1 }}>
                <IoSearchOutline size={20} />
              </Box>
            </InputAdornment>
          )
        }}
      />
      {/* <Button
        onClick={handleCollectionClick}
        endIcon={<HiChevronDown />}
        sx={{
          minWidth: 140,
          height: '56px',
          marginRight: 2,
          borderRadius: 0,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'grey.50',
          color: 'text.secondary',
          fontSize: '0.875rem',
          fontWeight: 500,
          '&:hover': {
            bgcolor: 'grey.100'
          }
        }}
      >
        {selectedCollectionLabel}
      </Button> */}
      {/* Search Button */}
      <Button
        onClick={handleSearch}
        variant="contained"
        sx={{
          height: '56px',
          marginRight: 1,
          minWidth: 80,
          borderRadius: 0,
          bgcolor: '#F9A34A',
          color: 'white',
          fontWeight: 600,
          fontSize: '0.95rem',
          borderRadius: '8px 8px ',
          px: 2,
          '&:hover': {
            bgcolor: '#e6953d'
          },
          '&:active': {
            bgcolor: '#d6852d'
          }
        }}
      >
        <IoSearchOutline size={20} />
      </Button>
    </Paper>
  );
}
