import { Stack, Box, Typography, Grid, Container } from '@mui/material';
import PoojaCard from 'src/components/cards/service/PoojaCard';
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

// SEO
export const metadata = {

    title:
        'Online Pooja Service Near You | Verified Puja Experts',

    description:
        'Book pandit online for puja, havan, grah shanti, and rituals near you. Get experienced pandits for home services with easy booking and personalized assistance.',

};

const allServices = [
    {
        id: '1',
        name: 'Rudrabhishek Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 2800,
        image: { url: '/images/poojaas/rudrabhishek-puja.jpeg' }
    },
    {
        id: '2',
        name: 'Satyanarayan Puja',
        price: 2100,
        originalPrice: 2351,
        duration: '2-3 Hrs',
        views: 1500,
        image: { url: '/images/poojaas/satyanarayan-puja.jpeg' }
    },
    {
        id: '3',
        name: 'Mool Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/mool-puja.png' }
    },
    {
        id: '4',
        name: 'Bhoomi Neev Puja',
        price: 2100,
        originalPrice: 2351,
        duration: '1-2 Hrs',
        views: 1200,
        image: { url: '/images/poojaas/bhoomi-neev-puja.png' }
    },
    {
        id: '5',
        name: 'Griha Pravesh Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/griha-pravesh.png' }
    },
    {
        id: '6',
        name: 'Griha Vastu Shanti Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 2100,
        image: { url: '/images/poojaas/griha-vastu-shanti-puja.png' }
    },
    {
        id: '7',
        name: 'Namkaran Puja',
        price: 3100,
        originalPrice: 3501,
        duration: '2-3 Hrs',
        views: 980,
        image: { url: '/images/poojaas/namkaran-puja.png' }
    },
    {
        id: '8',
        name: 'Annaprashan Sanskar Puja',
        price: 2100,
        originalPrice: 2351,
        duration: '2-3 Hrs',
        views: 760,
        image: { url: '/images/poojaas/annaprashan-sanskar-puja.png' }
    },
    {
        id: '9',
        name: 'Navratri Puja',
        price: 3100,
        originalPrice: 3501,
        duration: '2-3 Hrs',
        views: 1400,
        image: { url: '/images/poojaas/navratri-puja.png' }
    },
    {
        id: '10',
        name: 'Dhanteras Puja',
        price: 2100,
        originalPrice: 2351,
        duration: '2-3 Hrs',
        views: 3200,
        image: { url: '/images/poojaas/dhanteras-puja.png' }
    },
    {
        id: '11',
        name: 'Diwali Puja',
        price: 3100,
        originalPrice: 3501,
        duration: '2-3 Hrs',
        views: 4100,
        image: { url: '/images/poojaas/diwali-puja.png' }
    },
    {
        id: '12',
        name: 'Engagement Puja',
        price: 3100,
        originalPrice: 3501,
        duration: '2-3 Hrs',
        views: 1700,
        image: { url: '/images/poojaas/engagement-puja.png' }
    },
    {
        id: '13',
        name: 'Tilak Puja',
        price: 3100,
        originalPrice: 3501,
        duration: '2-3 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/tilak-puja.png' }
    },
    {
        id: '14',
        name: 'Vivah Puja',
        price: 21000,
        originalPrice: 25501,
        duration: '4-5 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/vivah-puja.png' }
    },
    {
        id: '15',
        name: 'Sunderkand Path',
        price: 1100,
        originalPrice: 1243,
        duration: '1-2 Hrs',
        views: 2200,
        image: { url: '/images/poojaas/sunderkand-path-mool-path.png' }
    },
    {
        id: '16',
        name: 'Saraswati Puja',
        price: 1100,
        originalPrice: 1301,
        duration: '3-4 Hrs',
        views: 1900,
        image: { url: '/images/poojaas/saraswati-puja.png' }
    },
    {
        id: '17',
        name: 'Vishwakarma Puja',
        price: 1100,
        originalPrice: 1301,
        duration: '2-3 Hrs',
        views: 1300,
        image: { url: '/images/poojaas/vishwakarma-puja.png' }
    },
    {
        id: '18',
        name: 'Krishna Janmashtami Puja',
        price: 2100,
        originalPrice: 2351,
        duration: '3-4 Hrs',
        views: 2600,
        image: { url: '/images/poojaas/krishna-janmashtami-puja.png' }
    },
    {
        id: '19',
        name: 'Hanuman Janmotsav',
        price: 2100,
        originalPrice: 2351,
        duration: '3-4 Hrs',
        views: 1800,
        image: { url: '/images/poojaas/hanuman-janmotsav.png' }
    },
    {
        id: '20',
        name: 'Ram Navami Puja',
        price: 2100,
        originalPrice: 2351,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/ram-navami-puja.png' }
    },
    {
        id: '21',
        name: 'Akshaya Tritiya Puja',
        price: 2100,
        originalPrice: 2351,
        duration: '3-4 Hrs',
        views: 2400,
        image: { url: '/images/poojaas/akshaya-tritiya-puja.png' }
    },
    {
        id: '22',
        name: 'Holika Puja',
        price: 2100,
        originalPrice: 2351,
        duration: '2-3 Hrs',
        views: 2900,
        image: { url: '/images/poojaas/holika-puja.png' }
    },
    {
        id: '23',
        name: 'Govardhan Puja',
        price: 2100,
        originalPrice: 2351,
        duration: '3-4 Hrs',
        views: 1600,
        image: { url: '/images/poojaas/govardhan-puja.png' }
    },
    {
        id: '24',
        name: 'Mahalakshmi Puja',
        price: 1100,
        originalPrice: 1301,
        duration: '3-4 Hrs',
        views: 3100,
        image: { url: '/images/poojaas/mahalakshmi-puja.png' }
    },
    {
        id: '25',
        name: 'Haritalika Teej Vrat Puja',
        price: 2100,
        originalPrice: 2351,
        duration: '2-3 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/haritalika-teej-vrat-puja.png' }
    },
    {
        id: '26',
        name: 'Navagraha Shanti Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 2800,
        image: { url: '/images/poojaas/navagraha-shanti-puja.png' }
    },
    {
        id: '27',
        name: 'Budh (Mercury) Graha Shanti Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/budh-graha-shanti-puja.png' }
    },
    {
        id: '28',
        name: 'Shukra (Venus) Graha Shanti Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/shukra-graha-shanti-puja.png' }
    },
    {
        id: '29',
        name: 'Chandra (Moon) Graha Shanti Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/chandra-graha-shanti-puja.png' }
    },
    {
        id: '30',
        name: 'Brihaspati (Jupiter) Graha Shanti Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/brihaspati-graha-shanti-puja.png' }
    },
    {
        id: '31',
        name: 'Surya (Sun) Graha Shanti Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/surya-graha-shanti-puja.png' }
    },
    {
        id: '32',
        name: 'Mangal (Mars) Graha Shanti Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/mangal-graha-shanti-puja.png' }
    },
    {
        id: '33',
        name: 'Rahu Graha Shanti Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/rahu-graha-shanti-puja.png' }
    },
    {
        id: '34',
        name: 'Ketu Graha Shanti Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/ketu-graha-shanti-puja.png' }
    },
    {
        id: '35',
        name: 'Shani Graha Shanti Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/shani-graha-shanti-puja.png' }
    },
    {
        id: '36',
        name: 'Pitru Dosh Nivaran Puja',
        price: 11000,
        originalPrice: 13501,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/pitru-dosh-nivaran-puja.png' }
    },

    {
        id: '37',
        name: 'Santan Gopal Mantra Chant',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/santan-gopal-mantra-jaap.png' }
    },

    {
        id: '38',
        name: 'Kalsarpa Dosha Nivaran Puja',
        price: 11000,
        originalPrice: 13501,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/kalsarpa-dosha-nivaran-puja.png' }
    },
    {
        id: '39',
        name: 'Ganesh Puja',
        price: 2100,
        originalPrice: 2351,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/ganesh-puja.png' }
    },
    {
        id: '40',
        name: 'Janeu, Yajnopaveet (Upanayana Sanskar)',
        price: 5100,
        originalPrice: 5801,
        duration: '4-6 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/janeu-yajnopaveet.png' }
    },
    {
        id: '41',
        name: 'Business Opening Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/business-opening-puja.png' }
    },
    {
        id: '42',
        name: 'Manglik Dosha Nivaran Puja (KumbhArk Marriage)',
        price: 21000,
        originalPrice: 25501,
        duration: '4-5 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/manglik-dosha-nivaran-puja.png' }
    },
    {
        id: '43',
        name: 'Shanti Puja (Poorvajon ke lie)',
        price: 11000,
        originalPrice: 13501,
        duration: '4-6 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/shanti-puja.png' }
    },
    {
        id: '44',
        name: 'Marriage Anniversary Puja',
        price: 2100,
        originalPrice: 2351,
        duration: '2-3 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/marriage-anniversary-puja.png' }
    },
    {
        id: '45',
        name: 'Varshik Shradh Puja',
        price: 3100,
        originalPrice: 3501,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/varshik-shradh-puja.png' }
    },
    {
        id: '46',
        name: 'Godh Bharai',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/godh-bharai.png' }
    },
    {
        id: '47',
        name: 'Kuber Upasana Puja',
        price: 11000,
        originalPrice: 13501,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/kuber-upasana-puja.png' }
    },
    {
        id: '48',
        name: 'Birthday Puja',
        price: 2100,
        originalPrice: 2351,
        duration: '2-3 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/birthday-puja.png' }
    },
    {
        id: '49',
        name: 'Shuddhikaran Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/shuddhikaran-puja.png' }
    },
    {
        id: '50',
        name: 'Pind Daan',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/pind-daan.png' }
    },
    {
        id: '51',
        name: 'Pitru Paksha Shraddha Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/pitru-paksha-shradhya-puja.png' }
    },
    {
        id: '52',
        name: 'Tripindi Shraddha Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/tripindi-shraddha-puja.png' }
    },
    {
        id: '53',
        name: 'Bharani Shraddha Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/bharani-shraddha-puja.png' }
    },
    {
        id: '54',
        name: 'Rin Mukti Puja',
        price: 5100,
        originalPrice: 5801,
        duration: '3-4 Hrs',
        views: 3000,
        image: { url: '/images/poojaas/rin-mukti-puja.png' }
    },
];


export default function ServicesPage() {
    return (
        <Container maxWidth="xl">  

            {/* ── BANNER ── */}
            <HeaderBreadcrumbs
                heading="Puja Services"
                links={[
                    { name: 'Home', href: '/' },
                    { name: 'Services' }
                ]}
                sx={{ mb: 3 }}
            />

            <Stack gap={4}>
                
                {/* ── CARDS GRID ── */}
                <Grid container spacing={2.5}>
                    {allServices.map((service, i) => (
                        <Grid size={{ lg: 3, md: 4, sm: 6, xs: 12 }} key={'service-' + i}>
                            <PoojaCard service={service} isLoading={false} />
                        </Grid>
                    ))}
                </Grid>
            </Stack>

        </Container>
    );
}