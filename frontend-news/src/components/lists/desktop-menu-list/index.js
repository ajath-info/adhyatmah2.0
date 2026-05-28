'use client';
import * as React from 'react';
import { Box, List, ListItemButton, ListItemIcon, ListItemText, Collapse, Avatar } from '@mui/material';
import { MdExpandLess } from 'react-icons/md';
import { useRouter } from 'next/navigation';

export default function NestedList({ data, isLoading, onClose }) {
  const router = useRouter();
  const [openParent, setOpenParent] = React.useState(null);
  const [openChildren, setOpenChildren] = React.useState({});

  const handleParentToggle = (key) => {
    setOpenParent((prev) => (prev === key ? null : key));
  };

  const handleChildToggle = (key) => {
    setOpenChildren((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <Box>
      <List sx={{ width: 280, bgcolor: 'background.paper', px: '16px' }} component="nav">
        {(isLoading ? [] : data)?.map((parentCategory, i) => {
          const parentKey = `parent-${i}`;
          return (
            <Box key={parentCategory.slug}>
              {/* Parent Item */}
              <ListItemButton
                onClick={() => {
                  if (parentCategory.subCategories?.length > 0) {
                    handleParentToggle(parentKey);
                  } else {
                    router.push('/products/' + parentCategory.slug);
                    onClose?.();
                  }
                }}
                sx={{
                  backdropFilter: openParent === parentKey ? 'blur(6px)' : 'none',
                  backgroundColor: openParent === parentKey ? 'rgba(200, 200, 200, 0.2)' : 'transparent',
                  transition: 'all 0.3s ease',
                  borderRadius: '4px',
                  px: '12px',
                  alignItems: 'flex-start',
                  py: '8px'
                }}
              >
                <ListItemIcon sx={{ minWidth: 40, mt: '2px' }}>
                  <Avatar src={parentCategory.cover.url} />
                </ListItemIcon>
                <ListItemText
                  primary={parentCategory.name}
                  primaryTypographyProps={{
                    fontSize: 14,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    lineHeight: 1.3
                  }}
                />
                {parentCategory.subCategories?.length > 0 && (
                  <Box
                    sx={{
                      transform: openParent === parentKey ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      flexShrink: 0,
                      mt: '2px'
                    }}
                  >
                    <MdExpandLess />
                  </Box>
                )}
              </ListItemButton>

              {/* Parent Collapse */}
              <Collapse in={openParent === parentKey} timeout="auto" unmountOnExit>
                <Box sx={{ ml: 2, pl: 2, position: 'relative', overflow: 'visible', mt: '4px' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '24px',
                      left: 2,
                      width: '2px',
                      height: '100%',
                      bgcolor: '#edeff2',
                      zIndex: 0
                    }}
                  />
                  {parentCategory.subCategories.map((subCategory, j) => {
                    const hasGrandchildren = subCategory.childCategories?.length > 0;
                    const childKey = `${parentKey}-child-${j}`;

                    return (
                      <Box
                        key={subCategory.slug || subCategory.name || j}
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          position: 'relative',
                          ml: 0,
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            zIndex: 1,
                            left: -14,
                            top: 12,
                            width: 12,
                            height: 12,
                            backgroundColor: '#edeff2',
                            mask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23ccc' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat`,
                            WebkitMask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23ccc' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat`
                          }
                        }}
                      >
                        {/* Child Item */}
                        <ListItemButton
                          onClick={() => {
                            if (hasGrandchildren) {
                              handleChildToggle(childKey);
                            } else {
                              router.push('/products/' + parentCategory.slug + '/' + subCategory.slug);
                              onClose?.();
                            }
                          }}
                          sx={{
                            px: '12px',
                            minHeight: '36px',
                            alignItems: 'flex-start',
                            py: '6px',
                            backdropFilter: openChildren[childKey] ? 'blur(6px)' : 'none',
                            backgroundColor: openChildren[childKey] ? 'rgba(200, 200, 200, 0.2)' : 'transparent',
                            transition: 'all 0.3s ease',
                            borderRadius: '4px'
                          }}
                        >
                          <ListItemText
                            primary={subCategory.name}
                            primaryTypographyProps={{
                              fontSize: 13,
                              whiteSpace: 'normal',
                              wordBreak: 'break-word',
                              lineHeight: 1.3
                            }}
                          />
                          {hasGrandchildren && (
                            <Box
                              sx={{
                                transform: openChildren[childKey] ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                                display: 'flex',
                                alignItems: 'center',
                                flexShrink: 0,
                                mt: '2px'
                              }}
                            >
                              <MdExpandLess />
                            </Box>
                          )}
                        </ListItemButton>

                        {/* Child Collapse */}
                        {hasGrandchildren && (
                          <Collapse in={openChildren[childKey]} timeout="auto" unmountOnExit>
                            <Box
                              sx={{
                                pl: 2,
                                position: 'relative',
                                overflow: 'visible',
                                mt: '4px',
                                '&::before': {
                                  content: '""',
                                  position: 'absolute',
                                  zIndex: 1,
                                  left: -14,
                                  top: 12,
                                  width: 12,
                                  height: 12,
                                  backgroundColor: '#edeff2',
                                  mask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23ccc' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat`,
                                  WebkitMask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23ccc' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat`
                                }
                              }}
                            >
                              <Box
                                sx={{
                                  position: 'absolute',
                                  bottom: '24px',
                                  left: 10,
                                  width: '2px',
                                  height: '100%',
                                  bgcolor: '#edeff2'
                                }}
                              />
                              {subCategory.childCategories.map((childCategory, k) => (
                                <Box
                                  key={childCategory.slug || childCategory.name || k}
                                  sx={{
                                    ml: 0,
                                    position: 'relative',
                                    '&::before': {
                                      content: '""',
                                      position: 'absolute',
                                      zIndex: 1,
                                      left: -6,
                                      top: 12,
                                      width: 12,
                                      height: 12,
                                      backgroundColor: '#edeff2',
                                      mask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23ccc' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat`,
                                      WebkitMask: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' viewBox='0 0 14 14'%3E%3Cpath d='M1 1v4a8 8 0 0 0 8 8h4' stroke='%23ccc' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") center / contain no-repeat`
                                    }
                                  }}
                                >
                                  <ListItemButton
                                    onClick={() => {
                                      router.push(
                                        '/products/' +
                                          parentCategory.slug +
                                          '/' +
                                          subCategory.slug +
                                          '/' +
                                          childCategory.slug
                                      );
                                      onClose?.();
                                    }}
                                    sx={{
                                      px: '12px',
                                      minHeight: '36px',
                                      alignItems: 'flex-start',
                                      py: '6px'
                                    }}
                                  >
                                    <ListItemText
                                      primary={childCategory.name}
                                      primaryTypographyProps={{
                                        fontSize: 13,
                                        whiteSpace: 'normal',
                                        wordBreak: 'break-word',
                                        lineHeight: 1.3
                                      }}
                                    />
                                  </ListItemButton>
                                </Box>
                              ))}
                            </Box>
                          </Collapse>
                        )}
                      </Box>
                    );
                  })}
                </Box>
              </Collapse>
            </Box>
          );
        })}
      </List>
    </Box>
  );
}