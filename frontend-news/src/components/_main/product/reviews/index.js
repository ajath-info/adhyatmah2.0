import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from '@bprogress/next';
import PropTypes from 'prop-types';
// mui
import { Collapse, Grid, Card } from '@mui/material';
// components
import ReviewForm from '@/components/forms/review-form';
import ReviewOverview from '@/components/_main/product/reviews/overview';
import ReviewsList from 'src/components/lists/reviews';
import NoDataFoundIllustration from '@/illustrations/data-not-found';

ProductReview.propTypes = {
  pid: PropTypes.string.isRequired,
  reviews: PropTypes.array.isRequired,
  totalRating: PropTypes.number.isRequired,
  totalReviews: PropTypes.number.isRequired,
  reviewsSummery: PropTypes.object.isRequired
};

export default function ProductReview({ ...props }) {
  const { pid, reviews, totalRating, totalReviews, reviewsSummery } = props;
  const router = useRouter();
  const [count, setCount] = useState(0);
  const [state, setstate] = useState([]);
  const [reviewBox, setReviewBox] = useState(false);
  const { isAuthenticated } = useSelector(({ user }) => user);
  const handleOpenReviewBox = () => {
    isAuthenticated ? setReviewBox((prev) => !prev) : router.push('/auth/sign-in?redirect=' + router.asPath);
  };
  const handleCloseReviewBox = () => {
    setReviewBox(false);
    setTimeout(() => {
      setCount(count + 1);
    }, 500);
  };

  return (
    <Grid container spacing={3}>
      <Grid size={{ md: 8, xs: 12 }}>
        <Collapse in={reviewBox}>
          <Card sx={{ mb: 3 }}>
            <ReviewForm
              onAddingReview={(v) => setstate([v, ...state])}
              pid={pid}
              onClose={handleCloseReviewBox}
              id="move_add_review"
              onClickCancel={() => setReviewBox(false)}
            />
          </Card>
        </Collapse>
        <Collapse in={!reviewBox}>
          <Card>
            {[...state, ...reviews]?.length ? (
              <ReviewsList reviews={[...state, ...reviews]} />
            ) : (
              <NoDataFoundIllustration />
            )}
          </Card>
        </Collapse>
      </Grid>
      <Grid size={{ md: 4, xs: 12 }}>
        <Card sx={{ position: 'sticky', top: 156 }}>
          <ReviewOverview
            totalRating={totalRating}
            totalReviews={totalReviews}
            reviews={[...state, ...reviews]}
            onOpen={handleOpenReviewBox}
            reviewsSummery={reviewsSummery}
          />
        </Card>
      </Grid>
    </Grid>
  );
}
