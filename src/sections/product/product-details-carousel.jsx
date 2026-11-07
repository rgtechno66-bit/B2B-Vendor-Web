import { useEffect } from 'react';
import Box from '@mui/material/Box';
import { Image } from 'src/components/image';
import { Lightbox, useLightBox } from 'src/components/lightbox';
import {
  Carousel,
  useCarousel,
  CarouselThumb,
  CarouselThumbs,
  CarouselArrowNumberButtons,
} from 'src/components/carousel';
import {
  DUMMY_IMAGE,
  getProductDisplayImages,
  handleProductImageError,
  resolveProductImageUrl,
} from 'src/utils/product-image';

// ----------------------------------------------------------------------

export function ProductDetailsCarousel({ images }) {
  const carousel = useCarousel({
    thumbs: {
      slidesToShow: 'auto',
    },
  });

  const slides = getProductDisplayImages(images).map((img) => ({
    src: resolveProductImageUrl(img) || DUMMY_IMAGE,
  }));

  const lightbox = useLightBox(slides);

  useEffect(() => {
    if (lightbox.open) {
      carousel.mainApi?.scrollTo(lightbox.selected, true);
    }
  }, [carousel.mainApi, lightbox.open, lightbox.selected]);

  return (
    <>
      <div>
        <Box sx={{ mb: 2.5, position: 'relative' }}>
          <CarouselArrowNumberButtons
            {...carousel.arrows}
            options={carousel.options}
            totalSlides={carousel.dots.dotCount}
            selectedIndex={carousel.dots.selectedIndex + 1}
            sx={{ right: 16, bottom: 16, position: 'absolute' }}
          />

          <Carousel carousel={carousel} sx={{ borderRadius: 2, maxWidth: 200, mx: 'auto' }}>
            {slides.map((slide, index) => (
              <Image
                key={`${slide.src}-${index}`}
                alt="Product Image"
                src={slide.src || DUMMY_IMAGE}
                ratio="1/1"
                visibleByDefault
                disabledEffect
                onClick={() => lightbox.onOpen(slide.src || DUMMY_IMAGE)}
                onError={handleProductImageError}
                sx={{ cursor: 'zoom-in', width: 200, height: 200 }}
              />
            ))}
          </Carousel>
        </Box>

        <CarouselThumbs
          ref={carousel.thumbs.thumbsRef}
          options={carousel.options?.thumbs}
          slotProps={{ disableMask: true }}
          sx={{ width: 260, mx: 'auto' }}
        >
          {slides.map((item, index) => (
            <CarouselThumb
              key={`${item.src}-${index}`}
              index={index}
              src={item.src || DUMMY_IMAGE}
              selected={index === carousel.thumbs.selectedIndex}
              onClick={() => carousel.thumbs.onClickThumb(index)}
              onError={handleProductImageError}
              sx={{
                width: 50,
                height: 50,
                borderRadius: 1,
                border: '1px solid',
                borderColor: index === carousel.thumbs.selectedIndex ? 'primary.main' : 'grey.300',
                cursor: 'pointer',
              }}
            />
          ))}
        </CarouselThumbs>
      </div>

      <Lightbox
        index={lightbox.selected}
        slides={slides}
        open={lightbox.open}
        close={lightbox.onClose}
        onGetCurrentIndex={(index) => lightbox.setSelected(index)}
      />
    </>
  );
}
