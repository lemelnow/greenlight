import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import axios from '../../../helpers/Axios';

export default function useActivateAccount(token) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation(
    () => axios.post('/verify_account/activate.json', { user: { token } }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('useSessions');
        toast.success(t('toast.success.user.account_activated'));
        navigate('/');
      },
      onError: () => {
        toast.error(t('toast.error.problem_completing_action'));
      },
    },
  );
}
