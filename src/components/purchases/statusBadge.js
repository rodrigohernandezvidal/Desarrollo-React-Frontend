import { Chip } from '@mui/material';

const statusColors = {
  INGRESADO: { bg: '#e8f5e9', text: '#2e7d32' },
  PENDIENTE: { bg: '#fff8e1', text: '#ff8f00' },
  RECHAZADO: { bg: '#ffebee', text: '#c62828' },
  SEPARADO: { bg: '#e3f2fd', text: '#1565c0' }
};

const StatusBadge = ({ status }) => {
  return (
    <Chip
      label={status}
      sx={{
        backgroundColor: statusColors[status]?.bg || '#f5f5f5',
        color: statusColors[status]?.text || '#616161',
        fontWeight: 'bold',
        minWidth: 100
      }}
    />
  );
};

export default StatusBadge;