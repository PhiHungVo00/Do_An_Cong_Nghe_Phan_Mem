import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  icon: React.ReactNode;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, image, icon }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          paddingTop: '100%',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src={image}
          alt={name}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>
      <CardContent
        sx={{
          width: '100%',
          textAlign: 'center',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ color: 'primary.main', mb: 1 }}>
          {icon}
        </Box>
        <Typography
          variant="subtitle1"
          component="h3"
          sx={{
            fontWeight: 600,
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          {name}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CategoryCard; 