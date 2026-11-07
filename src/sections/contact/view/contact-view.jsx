import Container from '@mui/material/Container';

import { _mapContact } from 'src/_mock';

import { ContactHero } from '../contact-hero';
import { ContactFormData } from '../contact-form-data';
import { Map } from '../map';

export function ContactView() {
  return (
    <div>
      <ContactHero />

      <ContactFormData />

      <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 } }}>
        <Map />
      </Container>
    </div>
  );
}
