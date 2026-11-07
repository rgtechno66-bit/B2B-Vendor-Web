import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export function CustomSearch({
  value = '',
  query,
  onSearch,
  placeholder = 'Search...',
  loading = false,
}) {
  // Support both `value` (ProductShopView) and legacy `query` prop
  const inputValue = value ?? query ?? '';

  const handleChange = (event) => {
    onSearch?.(event.target.value);
  };

  return (
    <TextField
      value={inputValue}
      onChange={handleChange}
      placeholder={placeholder}
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
          </InputAdornment>
        ),
      }}
      sx={{ maxWidth: 400, marginBottom: 2 }}
    />
  );
}
