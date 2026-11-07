import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  CircularProgress,
  Container,
  Box,
  Stack,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Iconify } from 'src/components/iconify';
import { getFaqData } from 'src/services/faqApi';
import parse from 'html-react-parser';

// Styled Container for FAQ
const FaqContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(12),
  maxWidth: 'lg',
}));

// Section Title Styling
const SectionTitle = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  fontWeight: 'bold',
  fontSize: '2rem',
  color: theme.palette.primary.main,
}));

// Accordion Styling
const StyledAccordion = styled(Accordion)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  border: '1px solid',
  borderColor: theme.palette.divider,
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[6],
    // borderColor: theme.palette.primary.main,
  },
}));

const AccordionSummaryStyled = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: "rgb(220,220,220)",
  color: theme.palette.text.primary,
  fontWeight: 'bold',
  padding: theme.spacing(2),
  '& .MuiAccordionSummary-content': {
    marginY: theme.spacing(1),
  },
}));

const AccordionDetailsStyled = styled(AccordionDetails)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: theme.spacing(3),
  fontSize: '1rem',
  color: theme.palette.text.secondary,
  lineHeight: 1.8,
}));

export function FaqsList() {
  const [faqs, setFaqs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getFaqData();
        const activeFaqs = data.data.filter(faq => faq.status === 'Active');
        setFaqs(activeFaqs);

      } catch (err) {
        console.error('Error fetching FAQ data:', err);
        setError('Failed to fetch FAQ data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <FaqContainer>
        <Box display="flex" justifyContent="center" alignItems="center">
          <CircularProgress />
        </Box>
      </FaqContainer>
    );
  }

  if (error) {
    return (
      <FaqContainer>
        <Typography variant="h6" color="error" textAlign="center">
          {error}
        </Typography>
      </FaqContainer>
    );
  }

  return (
    <FaqContainer>
      <SectionTitle variant="h3">
        Where Can We Help You?
      </SectionTitle>
      <Typography
        variant="body1"
        sx={{
          textAlign: 'center',
          mb: 5,
          color: 'text.secondary',
          fontSize: '1.1rem',
        }}
      >
        Find answers to the most common questions below. If you need further assistance, feel free to contact us.
      </Typography>
      <Stack spacing={2}>
        {faqs.map((faq) => (
          <StyledAccordion key={faq.id}>
            <AccordionSummaryStyled
              expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                {faq.question}
              </Typography>
            </AccordionSummaryStyled>
            <AccordionDetailsStyled>
              <Typography variant="body1">
                {parse(faq.answer || '<p>No Answer Available</p>')}
              </Typography>
            </AccordionDetailsStyled>
          </StyledAccordion>
        ))}
      </Stack>
    </FaqContainer>
  );
}
