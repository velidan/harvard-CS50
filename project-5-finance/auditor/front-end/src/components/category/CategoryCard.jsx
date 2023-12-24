import * as React from "react";
import Card from "@mui/material/Card";

import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";

import Typography from "@mui/material/Typography";

export function CategoryCard(props) {
  const { thumbnailUrl, title, description } = props;
  return (
    <Card className="category-card">
      {thumbnailUrl ? (
        <CardMedia sx={{ height: 140 }} image={thumbnailUrl} title={title} />
      ) : (
        <div className="category-card-image-placeholder" />
      )}
      <CardContent>
        <Typography
          className="text-center"
          gutterBottom
          variant="h5"
          component="div"
        >
          {title}
        </Typography>
        <Typography
          className="text-center"
          variant="body2"
          color="text.secondary"
        >
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}
