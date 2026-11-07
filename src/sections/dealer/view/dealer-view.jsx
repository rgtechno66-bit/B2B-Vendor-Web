import Container from '@mui/material/Container';
import { _mapContact } from 'src/_mock';
import { DealerHero } from '../dealer-hero';
import { DealerMap } from '../dealer-map';

export function DealerView() {
    return (
        <div>
            <DealerHero />
            <Container maxWidth="xl">
            <DealerMap/>
            </Container>
        </div>
    );
}
