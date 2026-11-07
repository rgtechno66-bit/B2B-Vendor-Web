import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { varAlpha } from 'src/theme/styles';
import {
  DUMMY_IMAGE,
  getProductDisplayImages,
  handleProductImageError,
} from 'src/utils/product-image';

// ----------------------------------------------------------------------

export function CourseWidgetSummary({ sx, icon, image, title, total, color = 'warning', imageChangeInterval , ...other }) {

  const theme = useTheme();

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const imageList = getProductDisplayImages(
    Array.isArray(image) ? image : (image ? [image] : [])
  );
  const isMultipleImages = imageList.length > 1;

  useEffect(() => {
    if (!isMultipleImages || !imageChangeInterval) return () => {};
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, imageChangeInterval);
    return () => clearInterval(interval);
  }, [imageList.length, isMultipleImages, imageChangeInterval]);

  const currentImage = imageList[currentImageIndex] || imageList[0] || DUMMY_IMAGE;


  return (
    <Card
      sx={{
        border: `1px solid #fff`, // Set the border color to dark red
        py: 3,
        pl: 3,
        pr: 2.5,
        background: theme.palette.color.rgBackground,
        color: "#fff",
        borderRadius: 1, // Optional: Adds rounded corners
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
        transition: 'all 0.3s ease', // Smooth transition for hover effects
        '&:hover': {
          background: '#FFFF',
          color: '#000',
          boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', // Enhance shadow on hover
          transform: 'scale(1.02)', // Slight scale effect on hover
        },
        ...sx,
      }}
      {...other}
    >
      <Box sx={{ flexGrow: 1 }}>
        <Tooltip title={title} arrow>
       <Box>
        <div
        style={{
          width: '100%', // Full responsive width
          aspectRatio: '4 / 3', // Maintain aspect ratio
          backgroundColor: '#fff', // Optional background
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden', // Prevent image overflow
          border: '1px solid #ccc', // Optional border for visual alignment
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
      </div>
      

          <Typography
            noWrap
            variant="subtitle2"
            component="div"
            sx={{
              fontWeight: 'bold', // Makes the text bold
              fontSize: 'clamp(0.8rem, 2.5vw, 1rem)', // Auto-resizing font size
              transition: 'color 0.3s ease, transform 0.3s ease', // Smooth hover effect
              cursor: 'pointer', // Pointer to indicate interactivity
              '&:hover': {
                color: "#000",
                transform: 'scale(1.05)', // Slightly enlarge text on hover
              },
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
