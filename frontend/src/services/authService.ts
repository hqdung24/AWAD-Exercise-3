import { http } from '@/lib/http';

export type Me = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export const getMe = async (): Promise<Me> => {
  const { data } = await http.get('/users/me');
  return data;
};

export const signin = async (payload: { email: string; password: string }) => {
  const { data } = await http.post('/users/signin', payload);
  // backend có thể trả về user + token; hoặc chỉ set cookie và trả user
  return data as { message: string };
};

export const signout = async () => {
  await http.post('/users/signout');
};
export const signup = async (payload: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}) => {
  const { data } = await http.post('/users/signup', payload);
  return data as { message: string };
};
