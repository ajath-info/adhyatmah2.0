'use client';
import React from 'react';
import { FacebookShareButton, TwitterShareButton, LinkedinShareButton, WhatsappShareButton } from 'next-share';
import { IoLogoWhatsapp } from 'react-icons/io5';
import { FaFacebook } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import { FaLinkedin } from 'react-icons/fa';
import { Stack, IconButton } from '@mui/material';

export default function SocialShare() {
  const url = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <Stack direction="row" gap={0.5}>
      <WhatsappShareButton url={url} style={{ display: 'inline-flex' }}>
        <IconButton sx={{ color: '#42BC50' }} aria-label="whatsapp" component="span">
          <IoLogoWhatsapp size={24} />
        </IconButton>
      </WhatsappShareButton>

      <FacebookShareButton url={url} style={{ display: 'inline-flex' }}>
        <IconButton sx={{ color: '#1373EC' }} aria-label="facebook" component="span">
          <FaFacebook size={24} />
        </IconButton>
      </FacebookShareButton>

      <TwitterShareButton url={url} style={{ display: 'inline-flex' }}>
        <IconButton sx={{ color: 'text.primary' }} aria-label="twitter" component="span">
          <FaXTwitter size={24} />
        </IconButton>
      </TwitterShareButton>

      <LinkedinShareButton url={url} style={{ display: 'inline-flex' }}>
        <IconButton sx={{ color: '#0962B7' }} aria-label="linkedin" component="span">
          <FaLinkedin size={24} />
        </IconButton>
      </LinkedinShareButton>
    </Stack>
  );
}
