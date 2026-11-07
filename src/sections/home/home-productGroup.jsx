import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    CircularProgress,
    Box,
    Grid,
    Button,
    LinearProgress,
    useTheme,
} from '@mui/material';
import { AiOutlineWarning } from 'react-icons/ai';
import { CourseWidgetSummary } from './cards/course-widget-summary';
import { getCategoryDisplayImages } from 'src/utils/product-image';

/** Change only this to update category image rotation interval (milliseconds). */
const CATEGORY_IMAGE_CHANGE_INTERVAL_MS = 5000;

// Data from Redux only — categories from categoryListing (Nav fetches), images from product
export function HomeProductGroup() {
    const navigate = useNavigate();
    const theme = useTheme();
    const [showAll, setShowAll] = useState(false);
    const { data: categoriesFromRedux = [], loading: categoryLoading } = useSelector((state) => state.categoryListing);

    const toggleShowAll = () => {
        if (showAll) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setShowAll(!showAll);
    };

    const categories = Array.isArray(categoriesFromRedux) ? categoriesFromRedux : [];

    if (categoryLoading && categories.length === 0) {
        return <LoadingScreen />;
    }

    if (!Array.isArray(categories) || categories.length === 0) {
        return (
            <Container className='containerCss' style={{ textAlign: 'center', marginTop: '50px' }}>
                <Box
                    sx={{
                        backgroundColor: '#807f7fc2',
                        borderRadius: '8px',
                        padding: '30px',
                        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                        transition: 'transform 0.3s ease',
                        '&:hover': { transform: 'scale(1.02)' },
                    }}
                >
                    <AiOutlineWarning style={{ fontSize: '48px', color: '#f44336' }} />
                    <Typography variant="h4" color="#fff" style={{ fontWeight: 'bold', marginTop: '15px' }}>
                        No categories found.
                    </Typography>
                    <Typography variant="body1" color="#fff" style={{ marginTop: '10px' }}>
                        Please try again later.
                    </Typography>
                </Box>
            </Container>
        );
    }

    const ITEMS_PER_ROW = 6;
    const VISIBLE_ITEMS = 3 * ITEMS_PER_ROW;
    const displayedGroups = showAll ? categories : categories.slice(0, VISIBLE_ITEMS);

    const handleProductClick = (categoryName) => {
        navigate(`/product?category=${encodeURIComponent(categoryName)}`);
    };

    const getImageForCategory = (category) => getCategoryDisplayImages(category?.images);

    return (
        <Container className='containerCss' sx={{ bgcolor: theme.palette.color.lightGrey }}>
            <Box className="Latest_PRG" sx={{ mb: 2 }}>
                <Box>
                    <Typography
                        variant="h3"
                        component="h1"
                        sx={{
                            fontSize: { xs: '1rem', sm: '1.2rem', md: '2rem' },
                            fontWeight: '600',
                            color: '#FFF',
                            lineHeight: 1.2,
                            letterSpacing: '0.5px',
                            textTransform: 'uppercase',
                            borderBottom: '3px solid rgb(255, 255, 255)',
                            display: 'inline-block',
                            paddingBottom: '5px',
                        }}
                    >
                        Categories
                    </Typography>
                </Box>
            </Box>
            <div>
                <Grid container spacing={3}>
                    {displayedGroups.map((category, index) => (
                        <Grid item xs={6} sm={4} md={3} lg={2} xl={2} key={category.id ?? index}>
                            <Box
                                sx={{
                                    cursor: 'pointer',
                                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                                    '&:hover': { transform: 'scale(1.02)' },
                                }}
                                onClick={() => handleProductClick(category.name)}
                            >
                                <CourseWidgetSummary
                                    title={category.name}
                                    image={getImageForCategory(category)}
                                    imageChangeInterval={CATEGORY_IMAGE_CHANGE_INTERVAL_MS}
                                />
                            </Box>
                        </Grid>
                    ))}
                </Grid>

                {categories.length > VISIBLE_ITEMS && (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                            marginTop: '20px',
                            width: '300px',
                            marginX: 'auto',
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ marginBottom: '10px', fontWeight: 500, color: '#FFFF', textAlign: 'center' }}
                        >
                            You&apos;ve viewed {displayedGroups.length} of {categories.length} categories
                        </Typography>

                        <LinearProgress
                            variant="determinate"
                            value={(displayedGroups.length / categories.length) * 100}
                            sx={{ height: 6, width: '100%', borderRadius: 3, marginBottom: '15px' }}
                        />

                        <Button
                            onClick={toggleShowAll}
                            sx={{
                                width: '100%',
                                backgroundColor: '#000',
                                color: '#fff',
                                fontSize: '14px',
                                fontWeight: 'bold',
                                padding: '10px 0',
                                textTransform: 'uppercase',
                                border: '1px solid #e0e0e0',
                                borderRadius: '4px',
                                boxShadow: 'none',
                                '&:hover': { backgroundColor: '#000', boxShadow: 'none' },
                            }}
                        >
                            {showAll ? 'Show Less' : 'Load More'}
                        </Button>
                    </Box>
                )}
            </div>
        </Container>
    );
}

const LoadingScreen = () => (
    <div className='loadingScreen' style={{ textAlign: 'center', marginTop: '50px' }}>
        <CircularProgress />
        <p>Loading categories...</p>
    </div>
);
