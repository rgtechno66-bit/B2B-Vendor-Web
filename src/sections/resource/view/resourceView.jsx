import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  Paper,
  Container,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { m } from 'framer-motion';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Lightbox from 'yet-another-react-lightbox';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import { fetchGallery } from 'src/services/galleryCertificate';
import { fetchBanner } from 'src/services/bannerApi';
import { DEFAULT_RESOURCE_IMAGE } from 'src/constfile/dummyImage';
import { toAbsoluteUploadUrl } from 'src/utils/product-image';

// Styled buttons for better UI
const StyledIconButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: '#f0f0f0',
  color: '#000',
  borderRadius: '4px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  transition: 'background-color 0.3s, transform 0.3s',
  '&:hover': {
    backgroundColor: '#ccc',
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

export function ResourceView() {
  const sliderRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [galleryImages, setGalleryImages] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGallery(); // Fetch data from the API

        // Filter and format the images for type "certificate"
        const formattedImages = response.flatMap((item) =>
          item.type === 'certificate'
            ? item.GalleryImages.map((imgUrl) => ({
                src: imgUrl,
                alt: item.name,
              }))
            : []
        );

        setGalleryImages(formattedImages);
      } catch (err) {
        console.error('Error fetching gallery data:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const getBannerData = async () => {
      try {
        const data = await fetchBanner();

        // Find the Resource type banner
        const resourceBanner = data.find((item) => item.type === 'Resource');

        if (
          resourceBanner &&
          Array.isArray(resourceBanner.BannerImages) &&
          resourceBanner.BannerImages.length > 0
        ) {
          setBannerImages(resourceBanner.BannerImages.map(toAbsoluteUploadUrl));
        } else {
          // Fallback to default image
          setBannerImages([DEFAULT_RESOURCE_IMAGE]);
        }
      } catch (err) {
        console.error('Failed to fetch banner data:', err);
        setError('Failed to load the resource banner.');
        // Fallback to default image on error
        setBannerImages([DEFAULT_RESOURCE_IMAGE]);
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
  const renderBanner = () => {
    if (bannerImages.length === 1) {
      // Single image - no carousel
      return (
        <img
          src={bannerImages[0]}
          alt="Resource Banner"
          onError={(e) => {
            e.currentTarget.src = DEFAULT_RESOURCE_IMAGE;
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
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
                alt={`Resource slide ${index + 1}`}
                onError={(e) => {
                  e.currentTarget.src = DEFAULT_RESOURCE_IMAGE;
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
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
    <div>
      {/* Banner Section */}
      <Container
        component={m.div}
        sx={{
          overflow: 'hidden',
          width: '100%',
        }}
      >
        {loading ? (
          <Box sx={{ width: '100%', height: 300 }}>
            <img
              src={DEFAULT_RESOURCE_IMAGE}
              alt="Default resource banner"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        ) : error ? (
          <Typography
            variant="h4"
            style={{ textAlign: 'center', color: '#000', fontWeight: 'bold', marginTop: '15px' }}
          >
            {error}
          </Typography>
        ) : (
          renderBanner()
        )}
      </Container>

      {/* Certificate Section */}
      <Box sx={{ padding: '20px' }}>
        <Typography variant="h4" sx={{ marginBottom: '20px' }}>
          Certificates Photos
        </Typography>

        {galleryImages.length > 0 ? (
          <Grid container spacing={6} justifyContent="center">
            {galleryImages.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  onClick={() => {
                    setCurrentIndex(index);
                    setIsOpen(true);
                  }}
                  sx={{
                    position: 'relative',
                    paddingTop: '75%', // Ensures a 4:3 aspect ratio (100% / 4 * 3 = 75%)
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={image.src}
                    alt={image.alt}
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover', // Ensures the image covers the card area while preserving aspect ratio
                    }}
                  />
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          // Empty State UI
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '60px 20px',
              backgroundColor: '#f8f9fa',
              borderRadius: '16px',
              border: '2px dashed #e0e0e0',
              minHeight: '400px',
              textAlign: 'center',
            }}
          >
            {/* Icon */}
            <Box
              sx={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                backgroundColor: '#e3f2fd',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.15)',
              }}
            >
              <svg
                width="60"
                height="60"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z"
                  fill="#2196f3"
                />
              </svg>
            </Box>

            {/* Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 600,
                color: '#1976d2',
                marginBottom: '12px',
                fontSize: { xs: '1.5rem', md: '2rem' },
              }}
            >
              No Certificate Photos Available
            </Typography>

            {/* Description */}
            <Typography
              variant="body1"
              sx={{
                color: '#666',
                maxWidth: '400px',
                lineHeight: 1.6,
                marginBottom: '32px',
                fontSize: { xs: '0.9rem', md: '1rem' },
              }}
            >
              Currently, there are no certificate photos available. Please check back later or
              contact the administrator for assistance.
            </Typography>

            {/* Decorative Elements */}
            <Box
              sx={{
                display: 'flex',
                gap: '8px',
                marginTop: '16px',
              }}
            >
              {[...Array(3)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: '#2196f3',
                    opacity: 0.6,
                    animation: 'pulse 2s infinite',
                    animationDelay: `${index * 0.3}s`,
                    '@keyframes pulse': {
                      '0%': {
                        transform: 'scale(1)',
                        opacity: 0.6,
                      },
                      '50%': {
                        transform: 'scale(1.2)',
                        opacity: 1,
                      },
                      '100%': {
                        transform: 'scale(1)',
                        opacity: 0.6,
                      },
                    },
                  }}
                />
              ))}
            </Box>
          </Paper>
        )}
      </Box>

      {/* Lightbox */}
      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={galleryImages}
          index={currentIndex}
          plugins={[Thumbnails, Zoom]}
          thumbnails={{ width: 100 }}
        />
      )}
    </div>
  );
}
