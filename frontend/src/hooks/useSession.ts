// src/hooks/useSession.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, signin, signup } from '@/services/authService';
import { useAuthStore } from '@/stores/auth';
import { notify } from '@/lib/notify';
import { extractApiError } from '@/lib/api-error';
import { useNavigate } from 'react-router-dom';
// (A) Lấy user hiện tại (nếu có cookie session)
export function useSession() {
  return useQuery({
    queryKey: ['me'],
    queryFn: getMe,
    retry: false, // nếu 401 thì đừng retry
  });
}

// (B) Đăng nhập
export function useSignin() {
  //invali dateQueries: làm mới lại dữ liệu của query đã cache
  const qc = useQueryClient();

  // Cập nhật trạng thái authenticated trong store
  const setAuth = useAuthStore((s) => s.setAuthenticated);

  return useMutation({
    mutationFn: signin,
    onSuccess: async (data) => {
      setAuth(true);
      notify.success(data.message || 'Signin successful!');
      await qc.invalidateQueries({ queryKey: ['me'] }); // tải user mới
    },
    onError: (err) => {
      const { message } = extractApiError(err);
      notify.error(message || 'Failed to signin 😢');
    },
  });
}

// (C) Đăng ký
export function useSignup() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: signup,
    onSuccess: async (data) => {
      notify.success(data.message || 'Signup successful! Please signin.');
      navigate('/signin');
    },
    onError: (err) => {
      const { message } = extractApiError(err);
      notify.error(message || 'Failed to signup 😢');
    },
  });
}
