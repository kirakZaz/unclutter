import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import InventoryIcon from '@mui/icons-material/Inventory';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDonations, addDonation } from '@/services/localDbService';
import { useAuth } from '@/hooks/useAuth';
import SectionHeader from '@/components/common/SectionHeader';
import type { DonationUrgency } from '@/types';

const URGENCY_CONFIG: Record<DonationUrgency, { color: 'success' | 'warning' | 'error'; label: string }> = {
  low: { color: 'success', label: 'Low urgency' },
  medium: { color: 'warning', label: 'Needed' },
  high: { color: 'error', label: 'Urgent' },
};

function DonationsPage() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [formValues, setFormValues] = React.useState({
    title: '',
    description: '',
    category: '',
    quantity: 1,
    location: currentUser?.location ?? '',
    organization: '',
    urgency: 'low' as DonationUrgency,
  });

  const { data: donations = [], isLoading } = useQuery({
    queryKey: ['donations'],
    queryFn: getDonations,
  });

  const addDonationMutation = useMutation({
    mutationFn: addDonation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      setIsDialogOpen(false);
      setFormValues({
        title: '',
        description: '',
        category: '',
        quantity: 1,
        location: currentUser?.location ?? '',
        organization: '',
        urgency: 'low',
      });
    },
  });

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string | number } }
  ) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (!currentUser) return;
    addDonationMutation.mutate({
      ...formValues,
      authorId: currentUser.id,
      authorName: currentUser.name,
      status: 'available',
    });
  };

  return (
    <Box>
      <SectionHeader
        title="Donations"
        subtitle="Give items to people and organisations who need them most"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsDialogOpen(true)}
          >
            Post donation
          </Button>
        }
      />

      <Grid container spacing={2}>
        {isLoading
          ? Array.from({ length: 4 }).map((_, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card>
                  <CardContent>
                    <Skeleton variant="text" width="70%" height={28} />
                    <Skeleton variant="text" />
                    <Skeleton variant="text" width="50%" />
                  </CardContent>
                </Card>
              </Grid>
            ))
          : donations.map((donation) => {
              const urgencyConfig = URGENCY_CONFIG[donation.urgency];
              return (
                <Grid item xs={12} sm={6} key={donation.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                        <Chip
                          label={urgencyConfig.label}
                          color={urgencyConfig.color}
                          size="small"
                        />
                        <Chip label={donation.status} variant="outlined" size="small" />
                      </Box>

                      <Typography variant="h6" gutterBottom sx={{ fontSize: '1rem' }}>
                        {donation.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 2, lineHeight: 1.6 }}
                      >
                        {donation.description}
                      </Typography>

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <InventoryIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            Qty: {donation.quantity}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                          <Typography variant="caption" color="text.secondary">
                            {donation.location}
                          </Typography>
                        </Box>
                      </Box>

                      {donation.organization && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                          For: {donation.organization}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Typography variant="caption" color="text.secondary">
                          by {donation.authorName}
                        </Typography>
                        {donation.status === 'available' && (
                          <Button variant="outlined" size="small">
                            Claim
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
      </Grid>

      {/* Add donation dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Post a donation</DialogTitle>
        <DialogContent
          sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}
        >
          {addDonationMutation.isError && (
            <Alert severity="error">Failed to post. Please try again.</Alert>
          )}
          <TextField
            label="What are you donating?"
            name="title"
            value={formValues.title}
            onChange={handleFormChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={formValues.description}
            onChange={handleFormChange}
            fullWidth
            multiline
            rows={3}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Category"
              name="category"
              value={formValues.category}
              onChange={handleFormChange}
              fullWidth
            />
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formValues.quantity}
              onChange={handleFormChange}
              fullWidth
              inputProps={{ min: 1 }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Your location"
              name="location"
              value={formValues.location}
              onChange={handleFormChange}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Urgency</InputLabel>
              <Select
                name="urgency"
                value={formValues.urgency}
                label="Urgency"
                onChange={(event) => handleFormChange({ target: { name: 'urgency', value: event.target.value } })}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High / Urgent</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            label="Organisation (optional)"
            name="organization"
            value={formValues.organization}
            onChange={handleFormChange}
            fullWidth
            helperText="e.g. Food bank, local shelter, school"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setIsDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formValues.title || addDonationMutation.isPending}
          >
            {addDonationMutation.isPending ? 'Posting…' : 'Post donation'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DonationsPage;
