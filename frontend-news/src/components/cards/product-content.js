
import { Card, CardContent, Typography, Box } from '@mui/material';
import React from 'react';

function decodeHtml(html) {
  if (!html) return '';
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

export default function ProductContentCard({ content, name }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="h4" color="text.primary" gutterBottom>
          About {name}
        </Typography>
        <Box
          sx={{
            '& h1, & h2, & h3, & h4, & h5, & h6': {
              color: 'text.primary',
              marginBottom: 1
            },
            '& p, & span, & li': {
              color: 'text.secondary'
            },
            '& table': {
              width: '100%',
              borderCollapse: 'collapse',
              marginBottom: '10px'
            },
            '& th': {
              backgroundColor: '#f5a623',
              color: '#fff',
              padding: '10px 14px',
              textAlign: 'left',
              fontSize: '14px'
            },
            '& td': {
              padding: '8px 14px',
              fontSize: '14px',
              borderBottom: '1px solid #e0e0e0',
              color: '#333'
            },
            '& h2': {
              backgroundColor: '#b5451b',
              color: '#fff !important',
              padding: '10px 15px',
              fontSize: '16px',
              borderRadius: '4px 4px 0 0'
            }
          }}
          dangerouslySetInnerHTML={{ __html: decodeHtml(content) }}
        />
      </CardContent>
    </Card>
  );
}