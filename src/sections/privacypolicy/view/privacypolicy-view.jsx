import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { fetchPrivacyPolicy } from 'src/services/privacyPolicyApi';
import parse from 'html-react-parser';
import { Box } from '@mui/material';

export function PrivacyPolicyView() {
    const [privacyData, setPrivacyData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchPrivacyPolicy();
                setPrivacyData(data);
            } catch (err) {
                console.error('Error fetching privacy policy data:', err);
                setError('Failed to fetch privacy policy data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Container sx={{ py: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#000' }}>
                Privacy Policy
            </Typography>
            <Box
                sx={{
                    textAlign: 'justify',
                    lineHeight: 1.8,
                    fontSize: {
                        xs: '0.9rem',
                        sm: '1rem',
                        md: '1.1rem',
                    },
                    '& h1, & h2, & h3, & h4, & h5, & h6': {
                        color: '#000',
                        fontWeight: 'bold',
                        marginTop: '2rem',
                        marginBottom: '1rem',
                    },
                    '& p': {
                        marginBottom: '1rem',
                        color: '#333',
                    },
                    '& ul, & ol': {
                        paddingLeft: '2rem',
                        marginBottom: '1rem',
                    },
                    '& li': {
                        marginBottom: '0.5rem',
                        color: '#333',
                    },
                    '& strong': {
                        fontWeight: 'bold',
                        color: '#000',
                    },
                    '& em': {
                        fontStyle: 'italic',
                    },
                    '& a': {
                        color: '#7c4dff',
                        textDecoration: 'underline',
                        '&:hover': {
                            color: '#6a3dd8',
                        },
                    },
                }}
            >
                {privacyData?.content ? (
                    <div>{parse(privacyData.content)}</div>
                ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="h6" color="text.secondary">
                            No Privacy Policy content available at the moment.
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Please check back later or contact our support team for more information.
                        </Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
}
