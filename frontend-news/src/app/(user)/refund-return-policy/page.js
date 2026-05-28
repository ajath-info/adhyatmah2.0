// pages/refund-return-policy.js

import React from 'react';

// mui
import { Box, Grid, Container, Typography } from '@mui/material';

// components
import HeaderBreadcrumbs from '@/components/header-breadcrumbs';

const RefundReturnPolicy = () => {
  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <HeaderBreadcrumbs
        heading="Refund and return policy"
        links={[
          {
            name: 'Home',
            href: '/'
          },
          {
            name: 'Refund and return policy'
          }
        ]}
      />
      <Grid
        size={{ md: 12, xs: 12 }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: '20px 10px 0px',
        }}
      >
        <Box
          sx={{
            '& p': {
              mb: 2,
              lineHeight: 1.7,
            },
            '& h2': {
              mt: 4,
              mb: 2,
              fontSize: '1.5rem',
              fontWeight: 600,
            },
            '& h3': {
              mt: 3,
              mb: 1.5,
              fontSize: '1.25rem',
              fontWeight: 600,
            },
            '& h4': {
              mt: 2,
              mb: 1,
              fontSize: '1.1rem',
              fontWeight: 600,
            },
            '& ul': {
              pl: 3,            // ✅ left padding
              mb: 2,
            },
            '& li': {
              mb: 1,            // ✅ spacing between items
            },
          }}
        >
          <Typography variant="body1" paragraph>

            <p>Thank you for shopping at Adhyatmah website and Adhyatmah app.</p>
            <p>If, for any reason, You are not completely satisfied with a purchase We invite You to review our policy on refunds and returns. </p>
            <p>The following terms are applicable for any products that You purchased with Us.</p>
            <h2>Interpretation and Definitions</h2>
            <h3>Interpretation</h3>
            <p>The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.</p>
            <h3>Definitions</h3>
            <p>For the purposes of this Return and Refund Policy:</p>
            <ul>
              <li>
                <p><strong>Application</strong> means the software program provided by the Company downloaded by You on any electronic device, named Adhyatmah</p>
              </li>
              <li>
                <p><strong>Company</strong> (referred to as either &quot;the Company&quot;, &quot;We&quot;, &quot;Us&quot; or &quot;Our&quot; in this Agreement) refers to Adhyatmah.</p>
              </li>
              <li>
                <p><strong>Goods</strong> refer to the items offered for sale on the Service.</p>
              </li>
              <li>
                <p><strong>Orders</strong> mean a request by You to purchase Goods from Us.</p>
              </li>
              <li>
                <p><strong>Service</strong> refers to the Application or the Website or both.</p>
              </li>
              <li>
                <p><strong>Website</strong> refers to Adhyatmah, accessible from <a href="https://adhyatmah.com/" rel="external nofollow noopener" target="_blank">https://adhyatmah.com/</a></p>
              </li>
              <li>
                <p><strong>You</strong> means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable.</p>
              </li>
            </ul>
            <h2>Your Order Cancellation Rights</h2>
            <p>You are entitled to cancel Your Order within 7 days without giving any reason for doing so.</p>
            <p>The deadline for cancelling an Order is 2 days from the date on which You received the Goods or on which a third party you have appointed, who is not the carrier, takes possession of the product delivered.</p>
            <p>In order to exercise Your right of cancellation, You must inform Us of your decision by means of a clear statement. You can inform us of your decision by:</p>
            <ul>
              <li>
                <p>By email: info@adhyatmah.com</p>
              </li>
              <li>
                <p>By visiting this page on our website: <a href="https://adhyatmah.com/contact" rel="external nofollow noopener" target="_blank">https://adhyatmah.com/contact</a></p>
              </li>
            </ul>
            <p>We will reimburse You no later than 7 days from the day on which We receive the returned Goods. We will use the same means of payment as You used for the Order, and You will not incur any fees for such reimbursement.</p>
            <h2>Conditions for Returns</h2>
            <p>In order for the Goods to be eligible for a return, please make sure that:</p>
            <ul>
              <li>The Goods were purchased in the last 14 days</li>
              <li>The Goods are in the original packaging</li>
            </ul>
            <p>The following Goods cannot be returned:</p>
            <ul>
              <li>The supply of Goods made to Your specifications or clearly personalized.</li>
              <li>The supply of Goods which according to their nature are not suitable to be returned, deteriorate rapidly or where the date of expiry is over.</li>
              <li>The supply of Goods which are not suitable for return due to health protection or hygiene reasons and were unsealed after delivery.</li>
              <li>The supply of Goods which are, after delivery, according to their nature, inseparably mixed with other items.</li>
            </ul>
            <p>We reserve the right to refuse returns of any merchandise that does not meet the above return conditions in our sole discretion.</p>
            <p>Only regular priced Goods may be refunded. Unfortunately, Goods on sale cannot be refunded. This exclusion may not apply to You if it is not permitted by applicable law.</p>
            <h2>Returning Goods</h2>
            <p>You are responsible for the cost and risk of returning the Goods to Us. You should send the Goods at the following address:</p>
            <p>108, 1st floor, Tower A, Plot No. A-40, I-THUM TOWER, Sector 62 Noida, Uttar Pradesh- 201309<br />
              +919452872182<br />
              info@adhyatmah.com</p>
            <p>We cannot be held responsible for Goods damaged or lost in return shipment. Therefore, We recommend an insured and trackable mail service. We are unable to issue a refund without actual receipt of the Goods or proof of received return delivery.</p>
            <h2>Gifts</h2>
            <p>If the Goods were marked as a gift when purchased and then shipped directly to you, You'll receive a gift credit for the value of your return. Once the returned product is received, a gift certificate will be mailed to You.</p>
            <p>If the Goods weren't marked as a gift when purchased, or the gift giver had the Order shipped to themselves to give it to You later, We will send the refund to the gift giver.</p>
            <h3>Contact Us</h3>
            <p>If you have any questions about our Returns and Refunds Policy, please contact us:</p>
            <ul>
              <li>
                <p>By email: info@adhyatmah.com</p>
              </li>
              <li>
                <p>By visiting this page on our website: <a href="https://adhyatmah.com/contact" rel="external nofollow noopener" target="_blank">https://adhyatmah.com/contact</a></p>
              </li>
            </ul>
          </Typography>

          <Typography variant="body1" paragraph>
            This item cannot be returned. You have 48 hours after delivery to request a replacement for an item that is damaged, defective, inaccurate, or expired.
            If the item is incorrect, you can only request a replacement or return if it is sealed, unopened, unused, and in its original condition.
            Disclaimer	Every attempt is taken to ensure that all information is accurate. However, real product materials and packaging can include additional or different information. It is advised not to depend only on the data that is available.
          </Typography>
        </Box>
      </Grid>
    </Container>
  );
};

export default RefundReturnPolicy;