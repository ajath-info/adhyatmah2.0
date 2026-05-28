import React from 'react';
import PropTypes from 'prop-types';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useRouter } from '@bprogress/next';

// mui
import {
  styled,
  alpha,
  useMediaQuery,
  Fab,
  Box,
  ListItemText,
  List,
  Tooltip,
  ListItem,
  ListItemButton,
  ListItemIcon,
  useTheme,
  Collapse,
  Popover
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';

// icons
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { LuLayoutDashboard } from 'react-icons/lu';
import { FaRegBuilding } from 'react-icons/fa';
import { TbCategory2 } from 'react-icons/tb';
import { BsShop } from 'react-icons/bs';
import { BsCart3 } from 'react-icons/bs';
import { LuUsers } from 'react-icons/lu';
import { SlEnvolopeLetter } from 'react-icons/sl';
import { IoSettingsOutline } from 'react-icons/io5';
import { RiCoupon5Line } from 'react-icons/ri';
import { AiOutlineDollarCircle } from 'react-icons/ai';
import { BsCashCoin } from 'react-icons/bs';
import { PiShootingStarBold } from 'react-icons/pi';
import { IoChevronDown } from 'react-icons/io5';
import { GoDotFill, GoDot } from 'react-icons/go';

// components
import Scrollbar from 'src/components/scrollbar';

// Dashboard Side NevLinks
export const navlinks = [
  {
    id: 1,
    title: 'Dashboard',
    slug: 'dashboard',
    icon: <LuLayoutDashboard />
  },
  {
    id: 2,
    title: 'Categories',
    icon: <TbCategory2 />,
    isSearch: true,
    children: [
      {
        id: 15,
        title: 'Parent Categories',
        slug: 'categories',
        icon: <TbCategory2 />,
        isSearch: true
      },
      {
        id: 16,
        title: 'Sub Categories',
        slug: 'categories/sub-categories',
        icon: <TbCategory2 />,
        isSearch: true
      },
      {
        id: 17,
        title: 'Child Categories',
        slug: 'categories/child-categories',
        icon: <TbCategory2 />,
        isSearch: true
      }
    ]
  },

  {
    id: 4,
    title: 'Brands',
    slug: 'brands',
    icon: <FaRegBuilding />,
    isSearch: true
  },
  {
    id: 15,
    title: 'Attributes',
    slug: 'attributes',
    icon: <PiShootingStarBold />,
    isSearch: false
  },
  {
    id: 5,
    title: 'Products',
    slug: 'products',
    icon: <BsShop />,
    isSearch: true
  },

  {
    id: 6,
    title: 'Orders',
    slug: 'orders',
    icon: <BsCart3 />,
    isSearch: true
  },
  {
    id: 7,
    title: 'Pandit Services',
    slug: 'services',
    icon: <BsShop />,
    isSearch: true
  },
  {
    id: 8,
    title: 'Users',
    slug: 'users',
    icon: <LuUsers />,
    isSearch: true
  },
  {
    id: 9,
    title: 'Payouts',
    slug: 'payouts',
    icon: <BsCashCoin />,
    isSearch: false
  },
  {
    id: 10,
    title: 'Coupon codes',
    slug: 'coupon-codes',
    icon: <RiCoupon5Line />,
    isSearch: true
  },

  {
    id: 12,
    title: 'Currencies',
    slug: 'currencies',
    icon: <AiOutlineDollarCircle />,
    isSearch: true
  },

  {
    id: 13,
    title: 'Newsletter',
    slug: 'newsletter',
    icon: <SlEnvolopeLetter />,
    isSearch: false
  },
  {
    id: 14,
    title: 'Settings',
    slug: 'settings',
    icon: <IoSettingsOutline />,
    isSearch: false,
    children: [
      {
        id: 18,
        title: 'Profile',
        slug: 'settings',
        icon: <TbCategory2 />,
        isSearch: true
      },
      {
        id: 19,
        title: 'Main',
        slug: 'settings/main',
        icon: <TbCategory2 />,
        isSearch: true
      },
      {
        id: 20,
        title: 'General',
        slug: 'settings/general',
        icon: <TbCategory2 />,
        isSearch: true
      },
      {
        id: 21,
        title: 'Branding',
        slug: 'settings/branding',
        icon: <TbCategory2 />,
        isSearch: true
      },
      {
        id: 22,
        title: 'Home',
        slug: 'settings/home',
        icon: <TbCategory2 />,
        isSearch: true
      },
      {
        id: 23,
        title: 'Change Password',
        slug: 'settings/change-password',
        icon: <TbCategory2 />,
        isSearch: true
      }
    ]
  }
];

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen
  }),
  overflowX: 'hidden',
  borderRadius: 0,
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  }
});
const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  overflowX: 'hidden',
  width: `0px`,
  borderRadius: 0,
  [theme.breakpoints.up('md')]: {
    width: `calc(${theme.spacing(9)} + 1px)`
  },
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  }
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open'
})(({ theme, open }) => ({
  width: drawerWidth,
  zIndex: 11,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',

  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme)
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme)
  })
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}));

export default function Sidebar({ handleDrawerToggle, open }) {
  const theme = useTheme();

  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = React.useState('');
  const [initial, setInitial] = React.useState(false);
  const [expanded, setExpanded] = React.useState({});
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [hoveredItem, setHoveredItem] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  React.useEffect(() => {
    setActive(pathname);
    setInitial(true);
  }, [pathname]);
  const handleClick = (e, item) => {
    setHoveredItem(item.id);
    setAnchorEl(e.currentTarget);
  };

  return (
    <div>
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          '&.MuiDrawer-root': {
            '.MuiPaper-root': {
              overflow: { xs: 'hidden', md: 'unset' },
              zIndex: 998 + '!important'
            }
          }
        }}
      >
        <DrawerHeader />
        <Box
          sx={{
            position: 'absolute',
            right: -15,
            top: 85,
            zIndex: 9999999,
            display: { xs: 'none', md: 'flex' }
          }}
        >
          <Fab
            size="small"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            edge="start"
            sx={{
              bgcolor: theme.palette.background.paper,
              border: '1px solid' + theme.palette.divider,
              boxShadow: 'none',
              height: 25,
              minHeight: 25,
              width: 25,
              ':hover': {
                bgcolor: theme.palette.background.paper
              },
              svg: {
                color: theme.palette.text.primary
              }
            }}
          >
            {open ? <IoIosArrowBack /> : <IoIosArrowForward />}
          </Fab>
        </Box>
        <Scrollbar
          sx={{
            height: 1,
            '& .simplebar-content': {
              height: 1,
              display: 'flex',
              flexDirection: 'column'
            }
          }}
        >
          <List
            sx={{
              px: 1.5,
              gap: 1,
              display: 'flex',
              flexDirection: 'column',
              py: 2
            }}
          >
            {navlinks.map((item) => (
              <div key={item.id}>
                <ListItem
                  disablePadding
                  sx={{
                    display: 'block',
                    borderRadius: '8px',
                    border: `1px solid transparent`,
                    ...((((pathname.startsWith('/admin/' + item.slug) ||
                      Boolean(item.children?.some((v) => pathname.startsWith('/admin/' + v.slug)))) &&
                      initial) ||
                      (open && expanded[item.id])) && {
                      bgcolor: (theme) => alpha(theme.palette.primary.main, 0.2),
                      border: (theme) => `1px solid ${theme.palette.primary.main}`,
                      color: theme.palette.primary.main,
                      '& .MuiTypography-root': {
                        fontWeight: 600
                      }
                    })
                  }}
                >
                  <Tooltip title={open ? '' : item.title} placement="left" arrow leaveDelay={200}>
                    <ListItemButton
                      onClick={() => {
                        if (open && item.children) {
                          handleExpand(item.id);
                        } else if (!item.children) {
                          isMobile && handleDrawerToggle();
                        }
                      }}
                      {...(item.children
                        ? open
                          ? {
                              onClick: () => handleExpand(item.id)
                            }
                          : item.children && {
                              onMouseEnter: (e) => handleClick(e, item)
                            }
                        : {
                            onClick: () => {
                              if (isMobile) handleDrawerToggle();
                            },
                            component: Link,
                            href: '/admin/' + item.slug
                          })}
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 2.5,
                        borderRadius: '8px',
                        position: 'relative'
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 2 : 'auto',
                          justifyContent: 'center'
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>

                      <ListItemText
                        primary={item.title}
                        sx={{
                          overflow: 'hidden',
                          height: open ? 'auto' : 0,
                          textTransform: 'capitalize'
                        }}
                      />

                      {item.children && open && (
                        <ListItemIcon
                          sx={{
                            mr: 0,
                            transition: 'all 0.3s ease-in-out',
                            transform: expanded[item.id] ? 'rotate(0deg)' : 'rotate(-90deg)'
                          }}
                        >
                          <IoChevronDown />
                        </ListItemIcon>
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
                {item.children && (
                  <Collapse in={expanded[item.id] && open} timeout="auto" unmountOnExit>
                    <List
                      component="div"
                      disablePadding
                      sx={{
                        mt: 1,
                        overflow: 'hidden',
                        borderRadius: '8px',
                        bgcolor: 'background.paper',
                        border: (theme) => '1px solid' + theme.palette.divider
                      }}
                    >
                      {item.children.map((child) => (
                        <ListItemButton
                          key={child.id}
                          sx={{
                            pl: 1,
                            color: active === '/admin/' + child.slug ? 'primary.main' : 'text.primary',
                            svg: {
                              color: active === '/admin/' + child.slug ? 'primary.main' : 'text.primary'
                            },
                            span: {
                              fontWeight: active === '/admin/' + child.slug ? 600 : 400
                            }
                          }}
                          onClick={() => router.push('/admin/' + child.slug)}
                        >
                          <ListItemIcon>{active === '/admin/' + child.slug ? <GoDotFill /> : <GoDot />}</ListItemIcon>

                          <ListItemText primary={child.title} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
                {item.children && !open && hoveredItem === item.id && anchorEl && (
                  <Popover
                    open={hoveredItem === item.id}
                    anchorEl={anchorEl}
                    onClose={() => {
                      setHoveredItem(null);
                      setAnchorEl(null);
                    }}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'right'
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'left'
                    }}
                    PaperProps={{
                      onMouseEnter: () => {
                        setHoveredItem(item.id);
                      },
                      onMouseLeave: () => {
                        setHoveredItem(null);
                        setAnchorEl(null);
                      },
                      sx: {
                        minWidth: 200,
                        bgcolor: 'background.paper',
                        boxShadow: 3,
                        border: (theme) => '1px solid ' + theme.palette.divider,
                        borderRadius: 1,
                        pointerEvents: 'auto',
                        ml: 2
                      }
                    }}
                  >
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItemButton
                          key={child.id}
                          onClick={() => {
                            router.push('/admin/' + child.slug);
                            setHoveredItem(null);
                          }}
                          sx={{
                            pl: 2,
                            color: active === '/admin/' + child.slug ? 'primary.main' : 'text.primary',
                            '& svg': {
                              color: active === '/admin/' + child.slug ? 'primary.main' : 'text.primary'
                            },
                            '& span': {
                              fontWeight: active === '/admin/' + child.slug ? 600 : 400
                            }
                          }}
                        >
                          <ListItemText primary={child.title} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Popover>
                )}
              </div>
            ))}
          </List>
        </Scrollbar>
      </Drawer>
    </div>
  );
}
Sidebar.propTypes = {
  handleDrawerToggle: PropTypes.func.isRequired,

  open: PropTypes.bool.isRequired
};
