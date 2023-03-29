import { useState } from 'react';

export const useTooltip = () => {
  const [open, setOpen] = useState(false);
  const handleOpenTooltip = () => {
    setOpen(true);
  };
  const handleCloseTooltip = () => {
    setOpen(false);
  };
  return {
    open,
    handleOpenTooltip,
    handleCloseTooltip,
  };
};
