import React from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  Skeleton,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/hooks/useAuth';
import { getExchangeItems, addExchangeItem } from '@/services/localDbService';
import SectionHeader from '@/components/common/SectionHeader';
import type { ExchangeType, ItemCategory } from '@/types';

const CATEGORY_OPTIONS: { value: ItemCategory; label: string }[] = [
  { value: 'fashion', label: 'Fashion' },
  { value: 'books', label: 'Books' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'toys', label: 'Toys' },
  { value: 'sports', label: 'Sports' },
  { value: 'other', label: 'Other' },
];

const TYPE_COLOR: Record<ExchangeType, 'success' | 'primary' | 'secondary'> = {
  free: 'success',
  swap: 'primary',
  sell: 'secondary',
};

function ItemCardSkeleton() {
  return (
    <Card>
      <CardContent>
        <Skeleton variant="text" width="70%" height={28} />
        <Skeleton variant="text" width="100%" />
        <Skeleton variant="text" width="60%" />
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Skeleton variant="rounded" width={60} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </Box>
      </CardContent>
    </Card>
  );
}

function ExchangePage() {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [selectedType, setSelectedType] = React.useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const [newItemForm, setNewItemForm] = React.useState({
    title: '',
    description: '',
    category: 'other' as ItemCategory,
    type: 'free' as ExchangeType,
    location: currentUser?.location ?? '',
  });

  const { data: exchangeItems = [], isLoading } = useQuery({
    queryKey: ['exchangeItems'],
    queryFn: getExchangeItems,
  });

  const addItemMutation = useMutation({
    mutationFn: addExchangeItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exchangeItems'] });
      setIsDialogOpen(false);
      setNewItemForm({
        title: '',
        description: '',
        category: 'other',
        type: 'free',
        location: currentUser?.location ?? '',
      });
    },
  });

  const filteredItems = React.useMemo(() => {
    return exchangeItems.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesType = selectedType === 'all' || item.type === selectedType;
      return matchesSearch && matchesCategory && matchesType;
    });
  }, [exchangeItems, searchQuery, selectedCategory, selectedType]);

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = event.target;
    setNewItemForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewItem = () => {
    if (!currentUser) return;
    addItemMutation.mutate({
      ...newItemForm,
      authorId: currentUser.id,
      authorName: currentUser.name,
      images: [],
      status: 'available',
    });
  };

  return (
    <Box>
      <SectionHeader
        title="Exchange"
        subtitle="Swap, give, or find items from your community"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsDialogOpen(true)}
          >
            Post item
          </Button>
        }
      />

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          placeholder="Search items…"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          size="small"
          sx={{ minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" color="action" />
              </InputAdornment>
            ),
          }}
        />

        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label="Category"
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <MenuItem value="all">All categories</MenuItem>
            {CATEGORY_OPTIONS.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={selectedType}
          exclusive
          onChange={(_, newType) => newType && setSelectedType(newType)}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="free">Free</ToggleButton>
          <ToggleButton value="swap">Swap</ToggleButton>
          <ToggleButton value="sell">Sell</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Items grid */}
      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <ItemCardSkeleton />
            </Grid>
          ))}
        </Grid>
      ) : filteredItems.length === 0 ? (
        <Box sx={{ textAlign: 'center', py: 8 }}>
          <Typography color="text.secondary">No items match your filters.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {filteredItems.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, p: 2.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Chip
                      label={item.type}
                      size="small"
                      color={TYPE_COLOR[item.type]}
                      variant="outlined"
                    />
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <FavoriteIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {item.likes}
                      </Typography>
                    </Box>
                  </Box>

                  <Typography variant="h6" sx={{ mb: 0.5, fontSize: '1rem' }}>
                    {item.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      mb: 2,
                    }}
                  >
                    {item.description}
                  </Typography>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                      <Typography variant="caption" color="text.secondary">
                        {item.location}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">
                      by {item.authorName}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Add item dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Post an item</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: '16px !important' }}>
          {addItemMutation.isError && (
            <Alert severity="error">Failed to post item. Please try again.</Alert>
          )}
          <TextField
            label="Item title"
            name="title"
            value={newItemForm.title}
            onChange={handleFormChange}
            fullWidth
            required
          />
          <TextField
            label="Description"
            name="description"
            value={newItemForm.description}
            onChange={handleFormChange}
            fullWidth
            multiline
            rows={3}
            required
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={newItemForm.category}
                label="Category"
                onChange={(event) => handleFormChange({ target: { name: 'category', value: event.target.value } })}
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={newItemForm.type}
                label="Type"
                onChange={(event) => handleFormChange({ target: { name: 'type', value: event.target.value } })}
              >
                <MenuItem value="free">Free</MenuItem>
                <MenuItem value="swap">Swap</MenuItem>
                <MenuItem value="sell">Sell</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TextField
            label="Your location"
            name="location"
            value={newItemForm.location}
            onChange={handleFormChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setIsDialogOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitNewItem}
            disabled={!newItemForm.title || !newItemForm.description || addItemMutation.isPending}
          >
            {addItemMutation.isPending ? 'Posting…' : 'Post item'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default ExchangePage;
