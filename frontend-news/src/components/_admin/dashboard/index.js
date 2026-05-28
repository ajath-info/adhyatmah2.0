'use client';
import React from 'react';
import PropTypes from 'prop-types';
// mui
import { Grid, Box } from '@mui/material';
// components
import DashboardCard from 'src/components/cards/dashboard-card';
import LowStockProducts from '@/components/_admin/dashboard/low-stock-products';
import VendorServices from '@/components/_admin/dashboard/vendor-services';
import OrderChart from 'src/components/charts/order';
import SaleChart from '@/components/charts/sale';
import IncomeChart from '@/components/charts/income';
import BestSelling from './best-selling';
// icon
import { PiUsersThree } from 'react-icons/pi';
import { BiSolidShoppingBags } from 'react-icons/bi';
import { GrWorkshop } from 'react-icons/gr';
import { LuFileClock } from 'react-icons/lu';
import { FiFileText } from 'react-icons/fi';
// api
import * as api from 'src/services';
import { useQuery } from '@tanstack/react-query';
Dashboard.propTypes = { isVendor: PropTypes.bool };
export default function Dashboard({ isVendor }) {
  const { data: dashboard, isPending: isLoading } = useQuery({
    queryKey: [isVendor ? 'vendor-analytics' : 'dashboard-analytics'],
    queryFn: api[isVendor ? 'vendorDashboardAnalytics' : 'adminDashboardAnalytics'],
    refetchInterval: 30000
  });
  const data = dashboard?.data || {};
  const daily_earning = data?.dailyEarning;
  const daily_bookings = data?.dailyBookings;
  const daily_orders = data?.dailyOrders;
  const daily_users = data?.totalUsers;
  const totalServices = data?.totalServices;
  const totalProducts = data?.totalProducts;
  const booking_report = data?.bookingReport;
  const sales_report = data?.salesReport;
  const income_report = data?.incomeReport;
  const commission_report = data?.commissionReport;
  const bookings_report = data?.bookingsReport;
  const orders_report = data?.ordersReport;
  const mostBookedServices = data?.mostBookedServices;
  const bestSellingProducts = data?.bestSellingProducts;
  const totalVendors = data?.totalVendors;
  const totalPendingBookings = data?.totalPendingBookings;
  const totalPendingOrders = data?.totalPendingOrders;

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ md: isVendor ? 3 : 4, sm: 6, xs: 12 }}>
          <DashboardCard
            color="primary"
            isAmount
            icon={<span style={{ fontSize: '24px', fontWeight: 'bold' }}>₹</span>}
            title="Daily Earning"
            value={daily_earning}
            isLoading={isLoading}
            showCurrencyConversion={true}
          />
        </Grid>
        <Grid size={{ md: isVendor ? 3 : 4, sm: 6, xs: 12 }}>
          <DashboardCard
            color="secondary"
            title={isVendor ? "Daily Bookings" : "Daily Orders"}
            value={isVendor ? daily_bookings : daily_orders}
            icon={<FiFileText size={24} />}
            isLoading={isLoading}
          />
        </Grid>
        {!isVendor && (
          <Grid size={{ md: 4, sm: 6, xs: 12 }}>
            <DashboardCard
              color="warning"
              title="Total Users"
              value={daily_users}
              icon={<PiUsersThree size={30} />}
              isLoading={isLoading}
            />
          </Grid>
        )}

        <Grid size={{ md: isVendor ? 3 : 4, sm: 6, xs: 12 }}>
          <DashboardCard
            color="error"
            title={isVendor ? "Total Services" : "Total Products"}
            value={isVendor ? totalServices : totalProducts}
            icon={<BiSolidShoppingBags size={24} />}
            isLoading={isLoading}
          />
        </Grid>
        {!isVendor && (
          <Grid size={{ xs: 12, sm: isVendor ? 12 : 6, md: 4 }}>
            <DashboardCard
              color="success"
              title="Total Pandits"
              value={totalVendors}
              icon={<GrWorkshop size={24} />}
              isLoading={isLoading}
            />
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 6, md: isVendor ? 3 : 4 }}>
          <DashboardCard
            color="#01838F"
            title={isVendor ? "Pending Bookings" : "Pending Orders"}
            value={isVendor ? totalPendingBookings : totalPendingOrders}
            icon={<LuFileClock size={24} />}
            isLoading={isLoading}
          />
        </Grid>

        <Grid size={{ lg: 7, md: 7, xs: 12 }}>
          <SaleChart data={isVendor ? booking_report : sales_report} isLoading={isLoading} />
        </Grid>
        <Grid size={{ lg: 5, md: 5, xs: 12 }}>
          <OrderChart data={isVendor ? bookings_report : orders_report} isLoading={isLoading} />
        </Grid>
        {!isVendor && (
          <Grid size={{ lg: 4, md: 4, xs: 12 }}>
            <BestSelling data={bestSellingProducts} loading={isLoading} isVendor={isVendor} />
          </Grid>
        )}
        {!isVendor && (
          <Grid size={{ lg: 8, md: 8, xs: 12 }}>
            <IncomeChart
              income={income_report}
              commission={commission_report}
              isVendor={isVendor}
              isLoading={isLoading}
            />
          </Grid>
        )}
        <Grid size={12}>
          {isVendor ? (
            <VendorServices isVendor={isVendor} />
          ) : (
            <LowStockProducts isVendor={isVendor} />
          )}
        </Grid>
      </Grid>
    </Box>
  );
}
