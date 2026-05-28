// import React from 'react';
// import { Typography, Grid, Box, Stack, Container } from '@mui/material';
// import CategoryCard from 'src/components/cards/category';

// export default function Categories(props) {
//   const { data, isHome } = props;

//   return (
//     <Container maxWidth="xl">
//       <Stack gap={3}>

//         {isHome && (
//           <Stack>
//             <Typography variant="h4" color="text.primary">
//               Categories
//             </Typography>
//             <Typography variant="body1" color="text.secondary">
//               Discover our most popular categories, carefully curated to help you find the best
//               products quickly and easily.
//             </Typography>
//           </Stack>
//         )}

//         <Box>
//           {isHome ? (
//             // ✅ Homepage — Circle layout horizontal scroll
//             <Box
//               sx={{
//                 display: 'flex',
//                 gap: { xs: 2, sm: 3 },
//                 overflowX: 'auto',
//                 overflowY: 'visible',
//                 pb: 2,
//                 pt: 1,
//                 '&::-webkit-scrollbar': { display: 'none' },
//                 msOverflowStyle: 'none',
//                 scrollbarWidth: 'none',
//               }}
//             >
//               {data.map((inner) => (
//                 <Box
//                   key={inner?.slug}
//                   sx={{
//                     flexShrink: 0,
//                     overflow: 'visible',
//                   }}
//                 >
//                   <CategoryCard
//                     category={inner}
//                     slug={props.slug}
//                     variant="circle"
//                   />
//                 </Box>
//               ))}

//               {!Boolean(data.length) && (
//                 <Typography variant="h3" color="error.main" textAlign="center">
//                   Categories not found
//                 </Typography>
//               )}
//             </Box>
//           ) : (
//             // ✅ Other pages — Square Grid layout
//             <Grid container spacing={2} alignItems="center">
//               {data.map((inner) => (
//                 <React.Fragment key={inner?.slug || Math.random()}>
//                   <Grid size={{ lg: 2, md: 3, sm: 4, xs: 4 }}>
//                     <CategoryCard
//                       category={inner}
//                       slug={props.slug}
//                       variant="square"
//                     />
//                   </Grid>
//                 </React.Fragment>
//               ))}

//               {!Boolean(data.length) && (
//                 <Typography variant="h3" color="error.main" textAlign="center">
//                   Categories not found
//                 </Typography>
//               )}
//             </Grid>
//           )}
//         </Box>

//       </Stack>
//     </Container>
//   );
// }


import React from 'react';
import { Typography, Grid, Box, Stack, Container } from '@mui/material';
import CategoryCard from 'src/components/cards/category';

export default function Categories(props) {
  const { data, isHome } = props;

  return (
    <Container maxWidth="xl">
      <Stack gap={3} sx={{ overflow: 'visible' }}>

        {isHome && (
          <Stack>
            <Typography variant="h4" color="text.primary">
              Categories
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Discover our most popular categories, carefully curated to help you find the best
              products quickly and easily.
            </Typography>
          </Stack>
        )}

        <Box sx={{ overflow: 'visible' }}>
          {isHome ? (
            // ✅ Homepage — Circle layout horizontal scroll
            <Box
              sx={{
                display: 'flex',
                gap: { xs: 2, sm: 3 },
                overflowX: 'auto',
                overflowY: 'visible',
                pb: 2,
                pt: 1,
                '&::-webkit-scrollbar': { display: 'none' },
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              {data.map((inner) => (
                <Box
                  key={inner?.slug}
                  sx={{
                    flexShrink: 0,
                    overflow: 'visible',
                  }}
                >
                  <CategoryCard
                    category={inner}
                    slug={props.slug}
                    variant="circle"
                  />
                </Box>
              ))}

              {!Boolean(data.length) && (
                <Typography variant="h3" color="error.main" textAlign="center">
                  Categories not found
                </Typography>
              )}
            </Box>
          ) : (
            // ✅ Other pages — Square Grid layout
            <Grid container spacing={2} alignItems="center">
              {data.map((inner) => (
                <React.Fragment key={inner?.slug || Math.random()}>
                  <Grid size={{ lg: 2, md: 3, sm: 4, xs: 4 }}>
                    <CategoryCard
                      category={inner}
                      slug={props.slug}
                      variant="square"
                    />
                  </Grid>
                </React.Fragment>
              ))}

              {!Boolean(data.length) && (
                <Typography variant="h3" color="error.main" textAlign="center">
                  Categories not found
                </Typography>
              )}
            </Grid>
          )}
        </Box>

      </Stack>
    </Container>
  );
}