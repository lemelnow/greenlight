import { useQuery } from 'react-query';
import { useSearchParams } from 'react-router-dom';
import axios from '../../../../helpers/Axios';

export default function useVerifiedUsers(input, page) {
  const [searchParams] = useSearchParams();

  const params = {
    'sort[column]': searchParams.get('sort[column]'),
    'sort[direction]': searchParams.get('sort[direction]'),
    search: input,
    page,
  };

  return useQuery(
    ['getAdminUsers', { ...params }],
    () => axios.get('/admin/users/verified.json', { params }).then((resp) => resp.data),
    {
      keepPreviousData: true,
    },
  );
}
