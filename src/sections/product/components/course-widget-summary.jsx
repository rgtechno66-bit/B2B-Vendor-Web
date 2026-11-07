import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { varAlpha } from 'src/theme/styles';
import { Iconify } from 'src/components/iconify';
import {
  DUMMY_IMAGE,
  getProductDisplayImages,
  handleProductImageError,
} from 'src/utils/product-image';

// ----------------------------------------------------------------------

export function CourseWidgetSummaryData({
  sx,
  icon,
  image,
  title,
  total,
  color = 'warning',
  imageChangeInterval = 10000,
  randomImage = false,
  selected = false,
  ...other
}) {
  const theme = useTheme();
  const orange = theme.palette.color?.orangishRed || '#FF6600';

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageList = getProductDisplayImages(
    Array.isArray(image) ? image : image ? [image] : []
  );
  const hasMultipleImages = imageList.length > 1;
  const canRotate = imageList.length >= 1;

  useEffect(() => {
    if (!canRotate || !imageChangeInterval) return () => {};
    const interval = setInterval(() => {
      if (randomImage && imageList.length > 0) {
        setCurrentImageIndex(Math.floor(Math.random() * imageList.length));
      } else if (hasMultipleImages) {
        setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
      }
    }, imageChangeInterval);
    return () => clearInterval(interval);
  }, [imageList.length, canRotate, imageChangeInterval, randomImage, hasMultipleImages]);

  const currentImage = imageList[currentImageIndex] ?? imageList[0] ?? DUMMY_IMAGE;

  return (
    <Card
      sx={{
        position: 'relative',
        boxSizing: 'border-box',
        py: 2.5,
        px: 2,
        borderRadius: 1.5,
        background: selected ? '#111' : orange,
        color: '#fff',
        border: '2px solid transparent',
        boxShadow: selected
          ? '0 4px 14px rgba(0, 0, 0, 0.2)'
          : '0 2px 8px rgba(0, 0, 0, 0.08)',
        transform: selected ? 'translateY(-2px)' : 'none',
        transition: 'box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease, background 0.2s ease',
        '&:hover': {
          background: selected ? '#111' : orange,
          color: '#fff',
          border: selected ? '2px solid #111' : '2px solid #fff',
          boxShadow: selected
            ? '0 0 0 2px #fff, 0 6px 16px rgba(0, 0, 0, 0.25)'
            : '0 0 0 2px #FF6600, 0 6px 14px rgba(255, 102, 0, 0.28)',
          transform: 'translateY(-2px)',
        },
        ...sx,
      }}
      {...other}
    >
      {selected && (
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 3,
            width: 26,
            height: 26,
            borderRadius: '50%',
            bgcolor: '#fff',
            color: '#22c55e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
          }}
        >
          <Iconify icon="solar:verified-check-bold" width={20} sx={{ color: '#22c55e' }} />
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }}>
        <Tooltip title={title} arrow>
          <Box>
            <Box
              sx={{
                width: '100%',
                aspectRatio: '4 / 3',
                bgcolor: '#fff',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                borderRadius: 1,
                border: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              <img
                src={currentImage || DUMMY_IMAGE}
                alt={title || 'Course Image'}
                onError={handleProductImageError}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </Box>
            <Typography
              noWrap
              variant="subtitle2"
              component="div"
              sx={{
                fontWeight: 700,
                fontSize: 'clamp(0.75rem, 2.2vw, 0.9rem)',
                mt: 1,
                color: 'inherit',
                letterSpacing: 0.2,
                textAlign: 'center',
              }}
            >
              {title}
            </Typography>
          </Box>
        </Tooltip>
      </Box>
      <Box
        sx={{
          top: -44,
          width: 160,
          zIndex: -1,
          height: 160,
          right: -104,
          opacity: 0.12,
          borderRadius: 3,
          position: 'absolute',
          transform: 'rotate(40deg)',
          background: `linear-gradient(to right, ${theme.vars.palette[color].main} 0%, ${varAlpha(
            theme.vars.palette[color].mainChannel,
            0
          )} 100%)`,
        }}
      />
    </Card>
  );
}
