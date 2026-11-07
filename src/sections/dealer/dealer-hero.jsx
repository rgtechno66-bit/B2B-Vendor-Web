import { useEffect, useState, useRef } from "react";
import { m } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import Box from "@mui/material/Box";
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { Typography } from '@mui/material';

import { fetchBanner } from "src/services/bannerApi";
import { DEFAULT_DEALER_IMAGE } from "src/constfile/dummyImage";
import { toAbsoluteUploadUrl } from "src/utils/product-image";

// Styled buttons for better UI
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: "#f0f0f0",
  color: '#000',
  borderRadius: '4px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s, transform 0.3s',
  '&:hover': {
    backgroundColor: "#ccc",
    transform: 'scale(1.05)',
  },
}));

const StyledSlider = styled(Slider)({
  '.slick-dots li button:before': {
    content: '""',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    backgroundColor: '#000',
    opacity: 0.5,
    transition: 'all 0.3s ease',
  },
  '.slick-dots li.slick-active button:before': {
    width: '18px',
    height: '18px',
    backgroundColor: '#fff',
    opacity: 1,
    transform: 'scale(1.2)',
  },
});

export function DealerHero() {
  const sliderRef = useRef(null);
  const [bannerImages, setBannerImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const getBannerData = async () => {
      try {
        const data = await fetchBanner();

        // Find the Dealer type banner
        const dealerBanner = data.find((item) => item.type === "Dealer");

        if (dealerBanner && Array.isArray(dealerBanner.BannerImages) && dealerBanner.BannerImages.length > 0) {
          setBannerImages(dealerBanner.BannerImages.map(toAbsoluteUploadUrl));
        } else {
          // Fallback to default image
          setBannerImages([DEFAULT_DEALER_IMAGE]);
        }
      } catch (err) {
        console.error("Failed to fetch banner data:", err);
        setError("Failed to load the dealer banner.");
        // Fallback to default image on error
        setBannerImages([DEFAULT_DEALER_IMAGE]);
      } finally {
        setLoading(false);
      }
    };

    getBannerData();
  }, []);

  // Slider settings
  const settings = {
    dots: bannerImages.length > 1,
    infinite: bannerImages.length > 1,
    speed: 100,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: bannerImages.length > 1,
    autoplaySpeed: 2000,
    arrows: false,
  };

  // Handle previous and next actions
  const handlePrev = () => {
    sliderRef.current.slickPrev();
  };

  const handleNext = () => {
    sliderRef.current.slickNext();
  };

  // Render carousel or single image
  const renderContent = () => {
    if (bannerImages.length === 1) {
      // Single image - no carousel
      return (
        <img
          src={bannerImages[0]}
          alt="Dealer Banner"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_DEALER_IMAGE;
          }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      );
    }

    // Multiple images - carousel
    return (
      <Box sx={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
        <StyledSlider ref={sliderRef} {...settings}>
          {bannerImages.map((src, index) => (
            <Box key={index}>
              <img
                src={src}
                alt={`Dealer slide ${index + 1}`}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_DEALER_IMAGE;
                }}
                style={{ 
                  width: '100%',
                  height: '100%', 
                  objectFit: 'cover' 
                }}
              />
            </Box>
          ))}
        </StyledSlider>

        {/* Custom Next and Previous Buttons - Only show if more than 1 image */}
        {bannerImages.length > 1 && (
          <>
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
          </>
        )}
      </Box>
    );
  };

  return (
    <Container
      component={m.div}
      sx={{
        overflow: 'hidden',
        width: "100%",
      }}
    >
      {loading ? (
        <Box sx={{ width: '100%', height: 300 }}>
          <img
            src={DEFAULT_DEALER_IMAGE}
            alt="Default dealer banner"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>
      ) : error ? (
        <Typography variant="h4" style={{ textAlign: 'center', color: '#000', fontWeight: 'bold', marginTop: '15px' }}>
          {error}
        </Typography>
      ) : (
        renderContent()
      )}
    </Container>
  );
}
