import React, { useState } from 'react';
import { Box, TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

const SearchFilter = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term); // Trigger search operation on every change
  };

  const handleIconClick = () => {
    onSearch(searchTerm);
  };

  return (
    <Box sx={{ padding: '1rem' }}>
      <TextField
        label="Search"
        value={searchTerm}
        onChange={handleSearchChange}
        fullWidth
        margin="normal"
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleIconClick}>
                <SearchIcon color="primary" />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchFilter;
