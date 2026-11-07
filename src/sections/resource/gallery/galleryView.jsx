import React, { useEffect, useState } from "react";
import { Grid, Card, CardMedia, Container, Box, Typography, Paper } from "@mui/material";
import Lightbox from "yet-another-react-lightbox";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import { fetchGallery } from "src/services/galleryCertificate";

export function Gallery() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [images, setImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchGallery(); // Fetch data from the API

        // Flatten the images to a single array and filter by type "gallery"
        const formattedImages = response.flatMap((item) =>
          item.type === "gallery"
            ? item.GalleryImages.map((imgUrl) => ({
                src: imgUrl,
                title: item.name,
                description: item.type,
              }))
            : []
        );

        setImages(formattedImages);
      } catch (error) {
        console.error("Error fetching gallery data:", error);
      }
    };

    fetchData();
  }, []);

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => {
    setIsOpen(false);
  };

  return (
    <Container maxWidth="xl">
      {images.length > 0 ? (
        <Grid container spacing={3} sx={{ padding: "20px" }}>
          {images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card
                onClick={() => openLightbox(index)}
                sx={{
                  height: "250px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  overflow: "hidden",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={image.src}
                  alt={image.title}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "60px 20px",
            backgroundColor: "#f8f9fa",
            borderRadius: "16px",
            border: "2px dashed #e0e0e0",
            minHeight: "400px",
            textAlign: "center",
            marginTop: "50px",
          }}
        >
          {/* Icon */}
          <Box
            sx={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              backgroundColor: "#e3f2fd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "24px",
              boxShadow: "0 4px 12px rgba(33, 150, 243, 0.15)",
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
              color: "#1976d2",
              marginBottom: "12px",
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            No Gallery Photos Available
          </Typography>
          
          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: "#666",
              maxWidth: "400px",
              lineHeight: 1.6,
              marginBottom: "32px",
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            Currently, there are no gallery photos available. Please check back later or contact the administrator for assistance.
          </Typography>
          
          {/* Decorative Elements */}
          <Box
            sx={{
              display: "flex",
              gap: "8px",
              marginTop: "16px",
            }}
          >
            {[...Array(3)].map((_, index) => (
              <Box
                key={index}
                sx={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#2196f3",
                  opacity: 0.6,
                  animation: "pulse 2s infinite",
                  animationDelay: `${index * 0.3}s`,
                  "@keyframes pulse": {
                    "0%": {
                      transform: "scale(1)",
                      opacity: 0.6,
                    },
                    "50%": {
                      transform: "scale(1.2)",
                      opacity: 1,
                    },
                    "100%": {
                      transform: "scale(1)",
                      opacity: 0.6,
                    },
                  },
                }}
              />
            ))}
          </Box>
        </Paper>
      )}

      {isOpen && (
        <Lightbox
          open={isOpen}
          close={closeLightbox}
          slides={images}
          index={currentIndex}
          on={{
            view: ({ index }) => setCurrentIndex(index),
          }}
          plugins={[Zoom, Thumbnails]}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 1.2,
            doubleTapDelay: 300,
            wheelZoomDistanceFactor: 300,
          }}
          thumbnails={{
            width: 100,
            height: 60,
            border: "2px solid #fff",
            borderRadius: "4px",
            gap: 10,
          }}
        />
      )}
    </Container>
  );
}
