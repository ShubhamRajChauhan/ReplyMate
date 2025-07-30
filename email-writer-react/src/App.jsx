import { useState } from 'react'
import './App.css'
import { Box, Button, CircularProgress, Container, FormControl, InputLabel, MenuItem, Select, TextField, Typography, Paper } from '@mui/material';
import axios from 'axios';

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post("http://localhost:8080/api/email/generate", {
        emailContent,
        tone
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError('Failed to generate email reply. Please try again');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animated-bg">
      <Container maxWidth="md">
        <Typography variant='h3' component="h1" gutterBottom align="center" sx={{ fontWeight: 'bold', color: '#ffffff' }}>
          Email Reply Generator
        </Typography>

        <Paper elevation={6} sx={{ p: 4, borderRadius: 3, backgroundColor: '#ffffffee' }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant='outlined'
            label="Original Email Content"
            value={emailContent || ''}
            onChange={(e) => setEmailContent(e.target.value)}
            sx={{ mb: 3 }}
          />

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Tone (Optional)</InputLabel>
            <Select
              value={tone || ''}
              label="Tone (Optional)"
              onChange={(e) => setTone(e.target.value)}>
              <MenuItem value="">None</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
              <MenuItem value="casual">Casual</MenuItem>
              <MenuItem value="friendly">Friendly</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={!emailContent || loading}
            fullWidth
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#115293' },
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : "Generate Reply"}
          </Button>

          {error && (
            <Typography color='error' sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}

          {generatedReply && (
            <Box sx={{ mt: 4 }}>
              <Typography variant='h6' gutterBottom sx={{ fontWeight: 'medium', color: '#333' }}>
                Generated Reply:
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={6}
                variant='outlined'
                value={generatedReply || ''}
                inputProps={{ readOnly: true }}
                sx={{ backgroundColor: '#f0f4f8', borderRadius: 1 }}
              />

              <Button
                variant='outlined'
                sx={{
                  mt: 2,
                  borderColor: '#1976d2',
                  color: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#e3f2fd',
                    borderColor: '#115293',
                  }
                }}
                onClick={() => navigator.clipboard.writeText(generatedReply)}>
                Copy to Clipboard
              </Button>
            </Box>
          )}
        </Paper>
      </Container>
    </div>
  );
}

export default App;
