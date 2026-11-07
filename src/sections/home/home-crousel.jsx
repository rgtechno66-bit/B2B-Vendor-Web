import { useLayoutEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

import { fetchBanner } from 'src/services/bannerApi';
import { toAbsoluteUploadUrl } from 'src/utils/product-image';
import {
  DEFAULT_BANNER_PLACEHOLDER_PATH,
  DEFAULT_HOME_BANNER_IMAGES,
} from 'src/constfile/dummyImage';

// Styled buttons for better UI
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#f0f0f0",
  color: '#000',
  borderRadius: '4px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  // height: "100px",
  transition: 'background-color 0.3s, transform 0.3s',
  '&:hover': {
    backgroundColor: "#ccc",
    transform: 'scale(1.05)',
  },
}));

const StyledSlider = styled(Slider)({
  // '.slick-dots': {
  //   display: 'flex !important', // Ensure dots are flex-aligned
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: '20px', // Add spacing between dots and carousel
  // },
  // '.slick-dots li': {
  //   margin: '0 8px', // Adjust spacing between dots
  // },
  '.slick-dots li button:before': {
    content: '""',
    width: '16px', // Increased size for the dot
    height: '16px', // Increased size for the dot
    borderRadius: '50%', // Makes the dot circular
    backgroundColor: '#000', // Default black color
    opacity: 0.5, // Slightly transparent for inactive dots
    transition: 'all 0.3s ease', // Smooth transition for active state
  },
  '.slick-dots li.slick-active button:before': {
    width: '18px', // Slightly larger size for the active dot
    height: '18px', // Slightly larger size for the active dot
    backgroundColor: '#fff', // Solid black color for the active dot
    opacity: 1, // Fully opaque for the active dot
    transform: 'scale(1.2)', // Add a slight zoom effect
  },
});


export function HomeCarousel({ sx, ...other }) {
  const sliderRef = useRef(null); // Ref for Slider if you need to control it

  const [carouselImages, setCarouselImages] = useState([]); // State for dynamic images
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [loadedImages, setLoadedImages] = useState({}); // Track per-image load status
  // Fetch banner images
  useLayoutEffect(() => {
    const getBannerData = async () => {
      try {
        const data = await fetchBanner();
        setLoadedImages({});
        // Check if `data` is empty or invalid
        if (!data || data.length === 0) {
          console.warn("No data received. Setting default Home banners.");
          setCarouselImages(DEFAULT_HOME_BANNER_IMAGES);
          return;
        }

     // Find the Home type banner and get all its images
     const homeBanner = data.find((item) => item.type === 'Home');
        
     if (homeBanner && Array.isArray(homeBanner.BannerImages) && homeBanner.BannerImages.length > 0) {
       setCarouselImages(homeBanner.BannerImages.map(toAbsoluteUploadUrl));
     } else {
       console.warn("No Home banner found or no images. Setting default Home banners.");
       setCarouselImages(DEFAULT_HOME_BANNER_IMAGES);
     }
      } catch (err) { // Renamed `error` to `err` to avoid shadowing
        console.error('Failed to fetch banner data:', err);
        // Show default slides instead of an error message
        setCarouselImages(DEFAULT_HOME_BANNER_IMAGES);
      } finally {
        setLoading(false);
      }
    };

    getBannerData();
  }, []);

  // Slider settings
  const settings = {
    dots: true,
    infinite: carouselImages.length > 1,
    speed: 100, // Transition speed in milliseconds (reduced for faster transitions)
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000, // Reduced autoplay speed for quicker progression
    arrows: false,
  };


  // Handle previous and next actions
  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  const markImageLoaded = (index) => {
    setLoadedImages((prev) => ({ ...prev, [index]: true }));
  };

  // Render carousel
  const renderCarousel = (
    <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
      <StyledSlider ref={sliderRef} {...settings}>
        {carouselImages.map((src, index) => (
          <Box key={index} sx={{ position: 'relative', width: '100%', height: '100%' }}>
            <img
              src={DEFAULT_BANNER_PLACEHOLDER_PATH}
              alt="Default banner"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />
            <img
              src={src}
              alt={`Carousel slide ${index + 1}`}
              onLoad={() => markImageLoaded(index)}
              onError={(e) => {
                e.currentTarget.src = DEFAULT_BANNER_PLACEHOLDER_PATH;
                markImageLoaded(index);
              }}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: loadedImages[index] ? 1 : 0,
                transition: 'opacity 0.25s ease-in-out',
              }}
            />
          </Box>
        ))}
      </StyledSlider>

      {/* Custom Next and Previous Buttons */}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '10px',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <StyledIconButton onClick={handlePrev}>
          <FaAngleLeft />
        </StyledIconButton>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          right: '10px',
          transform: 'translateY(-50%)',
          zIndex: 10,
        }}
      >
        <StyledIconButton onClick={handleNext}>
          <FaAngleRight />
        </StyledIconButton>
      </Box>
    </Box>
  );

  return (
    <Container
      component={m.div}
      sx={{
        overflow: 'hidden',
        width: "100%",
        ...sx,
      }}
      {...other}
    >
      {loading ? (
        <Box sx={{ width: '100%', height: 300 }}>
          <img
            src={DEFAULT_BANNER_PLACEHOLDER_PATH}
            alt="Default banner"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      ) : error ? (
        <Typography variant="h4" color="#fff" style={{ textAlign: 'center', color: '#000', fontWeight: 'bold', marginTop: '15px' }}>{error}</Typography>
      ) : (
        renderCarousel
      )}

    </Container>
  );
}
