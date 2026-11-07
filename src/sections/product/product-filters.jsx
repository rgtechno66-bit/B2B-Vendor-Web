import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Radio from '@mui/material/Radio';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputBase, { inputBaseClasses } from '@mui/material/InputBase';
import Slider from '@mui/material/Slider';
import Divider from '@mui/material/Divider';

import { varAlpha } from 'src/theme/styles';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import { ColorPicker } from 'src/components/color-utils';
import { Button } from '@mui/material';

// ----------------------------------------------------------------------

export function ProductFilters({ open, onOpen, onClose, canReset, filters, options }) {
  const location = useLocation();

  const navigate = useNavigate();

  const handleResetClick = () => {
    filters.onResetState(); // First function to reset the filters
    navigate('/product');   // Second function to navigate to /product
  };
  // Extract query params and apply them to filters on component mount
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get('category') || 'all';
    const subGroup1 = queryParams.get('subGroup1') || 'all';
    const subGroup2 = queryParams.get('subGroup2') || 'all';

    const nextState = { category, subGroup1, subGroup2 };
    const { category: currentCategory, subGroup1: currentSubGroup1, subGroup2: currentSubGroup2 } = filters.state;

    if (
      currentCategory === nextState.category
      && currentSubGroup1 === nextState.subGroup1
      && currentSubGroup2 === nextState.subGroup2
    ) {
      return;
    }

    filters.setState(nextState);
  }, [location.search]);

  const marksLabel = [...Array(21)].map((_, index) => {
    const value = index * 10000;
    const firstValue = index === 0 ? `$${value}` : `${value}`;
    return { value, label: index % 4 ? '' : firstValue };
  });

  const handleFilterGender = useCallback(
    (newValue) => {
      const checked = filters.state.gender.includes(newValue)
        ? filters.state.gender.filter((value) => value !== newValue)
        : [...filters.state.gender, newValue];

      filters.setState({ gender: checked });
    },
    [filters]
  );

  const handleFilterCategory = useCallback(
    (newValue) => {
      filters.setState({ category: newValue });
      filters.setState({ subGroup1: 'all' });
      filters.setState({ subGroup2: 'all' });
    },
    [filters]
  );

  const handleFiltersubGroup1 = useCallback(
    (newValue) => {
      filters.setState({ subGroup1: newValue });
      // filters.setState({ category: 'all' });
      filters.setState({ subGroup2: 'all' });
    },
    [filters]
  );

  const handleFiltersubGroup2 = useCallback(
    (newValue) => {
      filters.setState({ subGroup2: newValue });
    },
    [filters]
  );

  const handleFilterColors = useCallback(
    (newValue) => {
      filters.setState({ colors: newValue });
    },
    [filters]
  );

  const handleFilterPriceRange = useCallback(
    (event, newValue) => {
      filters.setState({ priceRange: newValue });
    },
    [filters]
  );

  const handleFilterRating = useCallback(
    (newValue) => {
      filters.setState({ rating: newValue });
    },
    [filters]
  );


  const renderHead = (
    <div>
      <Box display="flex" alignItems="center" sx={{ py: 2, pr: 1, pl: 2.5 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Filters
        </Typography>

        <Tooltip title="Reset">
          <IconButton onClick={handleResetClick}>
            <Badge color="error" variant="dot" invisible={!canReset}>
              <Iconify icon="solar:restart-bold" />
            </Badge>
          </IconButton>
        </Tooltip>

        <IconButton onClick={onClose}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      </Box>

      <Divider sx={{ borderStyle: 'dashed' }} />
    </div>
  );

  const renderGender = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Gender
      </Typography>
      {options.genders.map((option) => (
        <FormControlLabel
          key={option.value}
          control={
            <Checkbox
              checked={filters.state.gender.includes(option.label)}
              onClick={() => handleFilterGender(option.label)}
            />
          }
          label={option.label}
        />
      ))}
    </Box>
  );

  const renderCategory = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Category
      </Typography>
      {options.categories.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Radio
              checked={option === filters.state.category}
              onClick={() => {
                handleFilterCategory(option);
                // Update the URL here when a category is selected
                const url = new URLSearchParams(location.search);
                url.set('category', option);
                // Optionally reset subGroup1 and subGroup2 when category is changed
                url.delete('subGroup1');
                url.delete('subGroup2');
                url.delete('page');
                url.set('limit', '20');
                window.history.replaceState({}, '', `${location.pathname}?${url}`); // Update the URL without reloading
              }}
            />
          }
          label={option}
          sx={{ ...(option === 'all' && { textTransform: 'capitalize' }) }}
        />
      ))}
    </Box>
  );


  const rendersubGroup1 = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Subgroup 1
      </Typography>
      {options.subGroups1.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Radio
              checked={option === filters.state.subGroup1}
              onClick={() => {
                handleFiltersubGroup1(option);
                // Update URL with selected subgroup1
                const url = new URLSearchParams(location.search);
                url.set('subGroup1', option);
                url.delete('page');
                url.set('limit', '20');
                window.history.replaceState({}, '', `${location.pathname}?${url}`);
              }}
            />
          }
          label={option}
          sx={{ ...(option === 'all' && { textTransform: 'capitalize' }) }}
        />
      ))}
    </Box>
  );



  const rendersubGroup2 = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        subGroup2
      </Typography>
      {options.subGroups2.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Radio
              checked={option === filters.state.subGroup2}
              onClick={() => {
                handleFiltersubGroup2(option);
                // Update the URL here when a category is selected
                const url = new URLSearchParams(location.search);
                url.set('subGroup2', option);
                url.delete('page');
                url.set('limit', '20');
                window.history.replaceState({}, '', `${location.pathname}?${url}`); // Update the URL without reloading
              }}
            />
          }
          label={option}
          sx={{ ...(option === 'all' && { textTransform: 'capitalize' }) }}
        />
      ))}
    </Box>
  );


  const renderColor = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        Color
      </Typography>
      <ColorPicker
        selected={filters.state.colors}
        onSelectColor={(colors) => handleFilterColors(colors)}
        colors={options.colors}
        limit={6}
      />
    </Box>
  );

  const renderPrice = (
    <Box display="flex" flexDirection="column">
      <Typography variant="subtitle2">Price</Typography>

      <Box gap={5} display="flex" sx={{ my: 2 }}>
        <InputRange type="min" value={filters.state.priceRange} onFilters={filters.setState} />
        <InputRange type="max" value={filters.state.priceRange} onFilters={filters.setState} />
      </Box>

      <Slider
        value={filters.state.priceRange}
        onChange={handleFilterPriceRange}
        step={1000}
        min={0}
        max={200000}
        marks={marksLabel}
        getAriaValueText={(value) => `$${value}`}
        valueLabelFormat={(value) => `$${value}`}
        sx={{ alignSelf: 'center', width: `calc(100% - 24px)` }}
      />
    </Box>
  );

  return (

    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{ backdrop: { invisible: true } }}
      PaperProps={{ sx: { width: 320 } }}
    >
      {renderHead}

      <Scrollbar sx={{ px: 2.5, py: 3 }}>
        <Stack spacing={3}>
          {/*
            {renderGender}
            {renderColor}
            */}
          {renderCategory}
          {rendersubGroup1}
          {rendersubGroup2}
          {/*
              {renderPrice}
              */}
        </Stack>
      </Scrollbar>
    </Drawer>

  );
}

// ----------------------------------------------------------------------

function InputRange({ type, value, onFilters }) {
  const min = value[0];
  const max = value[1];

  const handleBlurInputRange = useCallback(() => {
    if (min < 0) {
      onFilters({ priceRange: [0, max] });
    }
    if (min > 200000) {
      onFilters({ priceRange: [200000, max] });
    }
    if (max < 0) {
      onFilters({ priceRange: [min, 0] });
    }
    if (max > 200000) {
      onFilters({ priceRange: [min, 200000] });
    }
  }, [max, min, onFilters]);

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: 1 }}>
      <Typography
        variant="caption"
        sx={{
          flexShrink: 0,
          color: 'text.disabled',
          textTransform: 'capitalize',
          fontWeight: 'fontWeightSemiBold',
        }}
      >
        {`${type} ($)`}
      </Typography>

      <InputBase
        fullWidth
        value={type === 'min' ? min : max}
        onChange={(event) =>
          type === 'min'
            ? onFilters({ priceRange: [Number(event.target.value), max] })
            : onFilters({ priceRange: [min, Number(event.target.value)] })
        }
        onBlur={handleBlurInputRange}
        inputProps={{
          step: 1000,
          min: 0,
          max: 200000,
          type: 'number',
          'aria-labelledby': 'input-slider',
        }}
        sx={{
          // maxWidth: 48,
          maxWidth: 70,
          borderRadius: 0.75,
          bgcolor: (theme) => varAlpha(theme.vars.palette.grey['500Channel'], 0.08),
          [`& .${inputBaseClasses.input}`]: {
            pr: 1,
            py: 0.75,
            textAlign: 'right',
            typography: 'body2',
          },
        }}
      />
    </Stack>
  );
}
