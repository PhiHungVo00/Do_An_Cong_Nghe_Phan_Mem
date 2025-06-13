import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';

const validationSchema = yup.object({
  code: yup
    .string()
    .required('Vui lòng nhập mã xác thực')
    .matches(/^[0-9]{6}$/, 'Mã xác thực gồm 6 chữ số')
});

interface EmailVerificationProps {
  email: string;
  onVerify: (code: string) => Promise<void>;
  onResend: () => Promise<void>;
}

const EmailVerification: React.FC<EmailVerificationProps> = ({
  email,
  onVerify,
  onResend
}) => {
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      code: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setError(null);
        await onVerify(values.code);
      } catch (err) {
        setError('Mã xác thực không đúng. Vui lòng thử lại.');
      }
    },
  });

  const handleResend = async () => {
    try {
      setIsResending(true);
      setError(null);
      await onResend();
      setResendCount(prev => prev + 1);
    } catch (err) {
      setError('Không thể gửi lại mã. Vui lòng thử lại sau.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 400, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom align="center">
        Xác thực email
      </Typography>
      
      <Typography variant="body1" sx={{ mb: 3 }} align="center">
        Chúng tôi đã gửi mã xác thực đến email:
        <br />
        <strong>{email}</strong>
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="code"
          name="code"
          label="Nhập mã xác thực"
          value={formik.values.code}
          onChange={formik.handleChange}
          error={formik.touched.code && Boolean(formik.errors.code)}
          helperText={formik.touched.code && formik.errors.code}
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            disabled={isResending || resendCount >= 3}
            onClick={handleResend}
            sx={{ flex: 1 }}
          >
            {isResending ? (
              <CircularProgress size={24} />
            ) : (
              `Gửi lại mã${resendCount > 0 ? ` (${resendCount}/3)` : ''}`
            )}
          </Button>
          
          <Button
            type="submit"
            variant="contained"
            disabled={formik.isSubmitting}
            sx={{ flex: 1 }}
          >
            {formik.isSubmitting ? (
              <CircularProgress size={24} />
            ) : (
              'Xác thực'
            )}
          </Button>
        </Box>

        {resendCount >= 3 && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Bạn đã yêu cầu gửi lại mã quá nhiều lần. Vui lòng thử lại sau.
          </Alert>
        )}
      </form>
    </Paper>
  );
};

export default EmailVerification; 