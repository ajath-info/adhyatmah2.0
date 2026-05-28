import { merge } from 'lodash';
import PropTypes from 'prop-types';
// chart
import ReactApexChart from 'react-apexcharts';
// mui
import { Card, CardHeader, Skeleton, Box } from '@mui/material';
// components
import BaseOptionChart from './chart-options';
import { useTheme } from '@mui/material/styles';
export default function Order({ data, isLoading }) {
  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart('donut'), {
    labels: ['Pending', 'Accepted', 'Ongoing', 'Upcoming', 'Completed', 'Cancelled'],
    legend: {
      position: 'bottom',
      horizontalAlign: 'center'
    },
    colors: [
      theme.palette.warning.main,
      theme.palette.info.main,
      theme.palette.primary.main,
      theme.palette.secondary.main,
      theme.palette.success.main,
      theme.palette.error.main
    ],
    stroke: { colors: [theme.palette.background.paper] },
    dataLabels: {
      enabled: false,
      dropShadow: { enabled: false },
      formatter: function (val) {
        return val.toFixed(0) + '%';
      }
    },
    plotOptions: {
      pie: {
        donut: { labels: { show: true }, size: '85%' },
        expandOnClick: true,
        offsetX: 0
      }
    }
  });

  return (
    <Card
      sx={{
        pb: 2,
        '& .apexcharts-canvas': {
          margin: '0 auto'
        }
      }}
    >
      <CardHeader
        title={<>{isLoading ? <Skeleton variant="text" height={28} width={180} /> : ' Order Report'}</>}
        sx={{ pb: 3 }}
      />
      {isLoading ? (
        <Box maxWidth="365px" width="100%" mx="auto">
          <Skeleton variant="circular" width={190} height={190} sx={{ mx: 'auto', mb: 2.4 }} />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',
              mt: 1,
              px: 3
            }}
          >
            <Skeleton variant="text" sx={{ width: '30%' }} />
            <Skeleton variant="text" sx={{ width: '30%' }} />
            <Skeleton variant="text" sx={{ width: '30%' }} />
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-around',

              mb: 1.6,
              px: 3
            }}
          >
            <Skeleton variant="text" sx={{ width: '30%' }} />
            <Skeleton variant="text" sx={{ width: '30%' }} />
          </Box>
        </Box>
      ) : (
        <ReactApexChart type="donut" series={data} options={chartOptions} width="365px" />
      )}
    </Card>
  );
}
Order.propTypes = {
  data: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired
};
