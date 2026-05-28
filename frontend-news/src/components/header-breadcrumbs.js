//
'use client';
import { isString, last } from 'lodash';
import PropTypes from 'prop-types';
import Link from '@/utils/link';

// mui
import { Box, Button, Stack, Typography, alpha, useTheme, Breadcrumbs } from '@mui/material';
import { IoMdAdd } from 'react-icons/io';

// components
import { createGradient } from 'src/theme/palette';

function LinkItem({ link, admin }) {
  const { href, name, icon } = link;
  return (
    <Typography
      component={Link}
      key={name}
      href={href}
      passHref
      variant={admin ? 'subtitle1' : 'subtitle2'}
      sx={{
        lineHeight: 2,
        display: 'flex',
        alignItems: 'center',
        color: admin ? 'text.primary' : 'common.white',
        '& > div': { display: 'inherit' }
      }}
    >
      {icon && (
        <Box
          sx={{
            mr: 1,
            '& svg': {
              width: admin ? 30 : 20,
              height: admin ? 30 : 20,
              color: admin ? 'text.primary' : 'common.white'
            }
          }}
        >
          {icon}
        </Box>
      )}
      {name}
    </Typography>
  );
}

LinkItem.propTypes = {
  link: PropTypes.shape({
    href: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    icon: PropTypes.node
  }).isRequired,
  admin: PropTypes.bool.isRequired
};

function MBreadcrumbs({ links, admin, activeLast = false, ...other }) {
  const currentLink = last(links)?.name;

  const listDefault = links.map((link) => <LinkItem key={link.name} link={link} admin={admin} />);
  const listActiveLast = links.map((link) => (
    <div key={link.name}>
      {link.name !== currentLink ? (
        <LinkItem link={link} admin={admin} />
      ) : (
        <Typography
          variant={admin ? 'subtitle1' : 'subtitle2'}
          sx={{
            maxWidth: 260,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            color: (theme) => theme.palette.grey[400],
            textOverflow: 'ellipsis'
          }}
        >
          {currentLink}
        </Typography>
      )}
    </div>
  ));

  return (
    <Breadcrumbs separator="›" {...other}>
      {activeLast ? listDefault : listActiveLast}
    </Breadcrumbs>
  );
}

MBreadcrumbs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.node
    })
  ).isRequired,
  admin: PropTypes.bool.isRequired,
  icon: PropTypes.node,
  activeLast: PropTypes.bool
};

export default function HeaderBreadcrumbs({ ...props }) {
  const { links, action, icon, heading, moreLink = '' || [], sx, admin, ...other } = props;
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...sx,
        width: '100%',
        ...(admin && {
          mb: 3
        }),
        ...(!admin && {
          p: 3,
          mt: 3,
          color: 'common.white',
          position: 'relative',
          overflow: 'hidden',
          background: createGradient(theme.palette.primary.main, theme.palette.primary.dark),
          borderRadius: '8px',
          border: `1px solid ${theme.palette.primary.main}`,
          '&:before': {
            content: "''",
            position: 'absolute',
            top: '-23%',
            left: '20%',
            transform: 'translateX(-50%)',
            bgcolor: alpha(theme.palette.primary.light, 0.5),
            height: { xs: 60, md: 80 },
            width: { xs: 60, md: 80 },
            borderRadius: '50px',
            zIndex: 0
          },
          '&:after': {
            content: "''",
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            right: '-3%',
            bgcolor: alpha(theme.palette.primary.light, 0.5),
            height: { xs: 60, md: 80 },
            width: { xs: 60, md: 80 },
            borderRadius: '50px',
            zIndex: 0
          },
          '& .MuiBreadcrumbs-separator': {
            color: 'common.white'
          }
        })
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
          ...(!admin && {
            '&:before': {
              content: "''",
              position: 'absolute',
              bottom: '-30%',
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: alpha(theme.palette.primary.light, 0.5),
              height: { xs: 60, md: 80 },
              width: { xs: 60, md: 80 },
              borderRadius: '50px',
              zIndex: 0
            }
          })
        }}
      >
        <Box
          sx={{
            width: { sm: '50%', xs: '100%' }
          }}
        >
          <Typography variant="h3" gutterBottom sx={{ textTransform: 'capitalize', width: '80vw' }} noWrap>
            {heading}
          </Typography>

          <MBreadcrumbs icon={icon} admin={admin} links={links} {...other} />
        </Box>

        {action ? (
          action.href ? (
            <>
              <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  href={action.href}
                  startIcon={action.icon ? action.icon : <IoMdAdd size={20} />}
                >
                  {action.title}
                </Button>
              </Box>
            </>
          ) : (
            action
          )
        ) : null}
      </Stack>

      <Box>
        {isString(moreLink) ? (
          <Link href={moreLink} target="_blank" variant={'h1'} sx={{ color: 'common.white' }}>
            {moreLink}
          </Link>
        ) : (
          moreLink.map((href) => (
            <Link
              noWrap
              key={href}
              href={href}
              variant="subtitle2"
              target="_blank"
              sx={{ display: 'table', color: 'common.white' }}
            >
              {href}
            </Link>
          ))
        )}
      </Box>
    </Box>
  );
}
HeaderBreadcrumbs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      name: PropTypes.string,
      icon: PropTypes.node
    })
  ).isRequired,
  action: PropTypes.oneOfType([
    PropTypes.shape({
      href: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      icon: PropTypes.node
    }),
    PropTypes.node
  ]),
  icon: PropTypes.node,
  heading: PropTypes.string,
  moreLink: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
  sx: PropTypes.object,
  admin: PropTypes.bool,
  isUser: PropTypes.bool
};
