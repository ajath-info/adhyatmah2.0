	'use client';

	import PropTypes from 'prop-types';
	import { useEffect, useState, useCallback } from 'react';
	import { useSelector, useDispatch } from 'react-redux';
	import { useMutation } from '@tanstack/react-query';
	import { useRouter } from 'next/navigation';
	import useEmblaCarousel from 'embla-carousel-react';
	import { Box, Stack, IconButton, Tooltip, useMediaQuery } from '@mui/material';
	import { IoMdHeartEmpty, IoIosHeart } from 'react-icons/io';
	import BlurImage from '@/components/blur-image';
	import shape from '@/theme/shape';
	import { setWishlist } from 'src/redux/slices/wishlist';
	import * as api from 'src/services';
	import { toast } from 'react-hot-toast';

	/* ---------------- SLIDE ---------------- */

	function Slide({ item, onClickWishList, wishlist, isLoading, isMobile, id }) {
	const isInWishlist = wishlist?.includes(id);

	return (
	<Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
	{/* Wishlist */}
	<Stack
	sx={{
	position: 'absolute',
	top: isMobile ? 8 : 16,
	right: isMobile ? 8 : 16,
	zIndex: 2,
	bgcolor: 'background.paper',
	borderRadius: '50%',
	}}
	>
	<Tooltip title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}>
	<IconButton
	size={isMobile ? 'small' : 'medium'}
	onClick={onClickWishList}
	disabled={isLoading}
	color={isInWishlist ? 'primary' : 'default'}
	>
	{isInWishlist ? <IoIosHeart /> : <IoMdHeartEmpty />}
	</IconButton>
	</Tooltip>
	</Stack>

	{/* Image */}
	{item && (
	<BlurImage
	priority
	fill
	objectFit="cover"
	sizes="50%"
	src={item?.url || item?.src}
	alt="product-image"
	/>
	)}

	{/* Subtle overlay */}
	<Box
	sx={{
	position: 'absolute',
	inset: 0,
	bgcolor: 'rgba(0,0,0,0.05)',
	}}
	/>
	</Box>
	);
	}

	Slide.propTypes = {
	item: PropTypes.object.isRequired,
	onClickWishList: PropTypes.func.isRequired,
	wishlist: PropTypes.array.isRequired,
	isLoading: PropTypes.bool.isRequired,
	isMobile: PropTypes.bool.isRequired,
	id: PropTypes.string.isRequired,
	};

	/* ---------------- PRODUCT SLIDER ---------------- */

	export default function ProductDetailsSlider({ product, selectedVariant, isSimple, id }) {
	const router = useRouter();
	const dispatch = useDispatch();
	const isMobile = useMediaQuery('(max-width:600px)');

	const { wishlist } = useSelector((state) => state.wishlist);
	const { isAuthenticated } = useSelector((state) => state.user);

	const variantList = product?.variants;
	const selected =
	!isSimple && selectedVariant && variantList?.length
	? variantList.find((v) => v.name?.match(/^[^#]+/)?.[0] === selectedVariant)
	: variantList?.[0];

	const images =
	selected?.images?.length
	? [...(product?.images || []), ...selected.images]
	: product?.images || [];

	const [selectedIndex, setSelectedIndex] = useState(0);

	/* Main carousel */
	const [mainRef, mainApi] = useEmblaCarousel({ loop: true });

	/* Vertical thumbs */
	const [thumbRef, thumbApi] = useEmblaCarousel({
	axis: 'y',
	dragFree: true,
	containScroll: 'keepSnaps',
	});

	const scrollTo = useCallback(
	(index) => {
	if (!mainApi) return;
	mainApi.scrollTo(index);
	},
	[mainApi]
	);

	const onSelect = useCallback(() => {
	if (!mainApi || !thumbApi) return;
	const index = mainApi.selectedScrollSnap();
	setSelectedIndex(index);
	thumbApi.scrollTo(index);
	}, [mainApi, thumbApi]);

	useEffect(() => {
	if (!mainApi) return;
	mainApi.on('select', onSelect);
	onSelect();
	}, [mainApi, onSelect]);

	/* Wishlist */
	const [isLoading, setLoading] = useState(false);

	const { mutate } = useMutation({
	mutationFn: async (id) => {
	if (!isAuthenticated) throw new Error('User not authenticated');
	const res = await api.updateWishlist(id);
	if (!res?.success) throw new Error(res?.message);
	return res;
	},
	onSuccess: (res) => {
	dispatch(setWishlist(res?.data || []));
	toast.success(res?.message || 'Wishlist updated');
	},
	onError: (err) => toast.error(err?.message),
	onSettled: () => setLoading(false),
	});

	const onClickWishList = (e) => {
	e.stopPropagation();
	if (!isAuthenticated) {
	router.push('/auth/signin');
	return;
	}
	setLoading(true);
	mutate(id);
	};

	/* ---------------- RENDER ---------------- */

	return (
	<Stack
	direction="row"
	alignItems="center"
	gap={1.25}   // 10px (1.25 * 8 = 10px)
	px={0.25}    // 2px left & right
	>
	{/* LEFT – Vertical thumbnails */}
	<Box
	ref={thumbRef}
	sx={{
	width: 68,
	height: 420,
	overflow: 'hidden',
	display: 'flex',
	alignItems: 'center'
	}}
	>
	<Box
	sx={{
	display: 'flex',
	flexDirection: 'column',
	justifyContent: 'center',
	gap: 1    // 8px clean spacing
	}}
	>
	{images.map((item, index) => (
	<Box
	key={index}
	onClick={() => scrollTo(index)}
	sx={{
	width: 58,
	height: 58,
	borderRadius: 2,
	overflow: 'hidden',
	cursor: 'pointer',
	position: 'relative',
	border: selectedIndex === index
	  ? '2px solid #1976d2'
	  : '1px solid #e0e0e0',
	transition: 'all 0.2s ease',
	'&:hover': {
	  transform: 'scale(1.05)'
	}
	}}
	>
	<BlurImage
	priority
	fill
	objectFit="cover"
	objectPosition="center"
	sizes="50%"
	src={item?.url || item?.src}
	alt="product-image"
	/>

	</Box>
	))}
	</Box>
	</Box>

	{/* RIGHT – Main image */}
	<Box
	ref={mainRef}
	sx={{
	position: 'relative',
	overflow: 'hidden',
	flex: 1,                 
	maxWidth: 520,           
	border: '1px solid #e0e0e0',
	borderRadius: shape.borderRadiusMd,
	aspectRatio: '1 / 1',
	}}
	>

	<Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
	{images.map((item, index) => (
	<Box
	key={index}
	sx={{
	flex: '0 0 100%',
	minWidth: 0,
	height: '100%',
	position: 'relative',
	}}
	>
	<Slide
	item={item}
	id={id}
	wishlist={wishlist}
	isLoading={isLoading}
	onClickWishList={onClickWishList}
	isMobile={isMobile}
	/>
	</Box>
	))}
	</Box>
	</Box>
	</Stack>
	);
	}

	ProductDetailsSlider.propTypes = {
	product: PropTypes.object.isRequired,
	selectedVariant: PropTypes.string,
	isSimple: PropTypes.bool,
	id: PropTypes.string.isRequired,
	};