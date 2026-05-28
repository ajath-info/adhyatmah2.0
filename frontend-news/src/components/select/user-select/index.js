'use client';
import React from 'react';
import { usePathname } from 'next/navigation';
import { useRouter } from '@bprogress/next';
// mui
import { Avatar, IconButton, Box, alpha } from '@mui/material';
import { FiUser } from 'react-icons/fi';

// components
import MenuPopover from 'src/components/popover';
import { PATH_PAGE } from 'src/routes/paths';
import { UserList } from 'src/components/lists';
import BlurImageAvatar from '@/components/avatar';
// redux
import { useSelector } from 'react-redux';

function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

export default function UserSelect() {
  const { user, isAuthenticated } = useSelector(({ user }) => user);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPath = getKeyByValue(PATH_PAGE.auth, pathname);
  const isHomePath = pathname.slice(3) === '';
  const anchorRef = React.useRef(null);
  const [openUser, setOpen] = React.useState(false);

  const handleOpenUser = () => {
    if (!isAuthenticated) {
      router.push('/auth/sign-in');
    } else {
      setOpen(true);
    }
  };
  const handleCloseUser = () => {
    setOpen(false);
  };
  return (
    <Box>
      {!isAuthenticated ? (
        <IconButton
          name="user-select"
          onClick={() => router.push(`/auth/sign-in${isAuthPath || isHomePath ? '' : `?redirect=${pathname}`}`)}
          color="primary"
          sx={{
            outlineWidth: 1,
            outlineColor: 'primary',
            outlineStyle: 'solid',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1)
          }}
        >
          <FiUser />
        </IconButton>
      ) : (
        <>
          <IconButton ref={anchorRef} onClick={handleOpenUser} name="user-select" sx={{ p: 0 }}>
            {user?.cover?.url ? (
              <BlurImageAvatar priority alt={user.firstName} src={user?.cover?.url} layout="fill" objectFit="cover" />
            ) : !isAuthenticated ? (
              <Avatar src="/broken-image.jpg" />
            ) : (
              <Avatar size="small">{user?.firstName?.slice(0, 1)?.toUpperCase()}</Avatar>
            )}
          </IconButton>

          <MenuPopover open={openUser} onClose={handleCloseUser} anchorEl={anchorRef.current} sx={{ width: 300 }}>
            <UserList
              openUser={openUser}
              isAuthenticated={isAuthenticated}
              user={user}
              setOpen={() => setOpen(false)}
            />
          </MenuPopover>
        </>
      )}
    </Box>
  );
}
