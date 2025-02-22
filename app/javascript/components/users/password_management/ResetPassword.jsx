import React, { useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import { useParams } from 'react-router-dom';
import useVerifyToken from '../../../hooks/mutations/users/useVerifyToken';
import ResetPwdForm from './forms/ResetPwdForm';
import Logo from '../../shared_components/Logo';

export default function ResetPassword() {
  const { token } = useParams();
  const verifyTokenAPI = useVerifyToken(token);

  useEffect(() => {
    verifyTokenAPI.mutate();
  }, []);

  if (verifyTokenAPI.isIdle || verifyTokenAPI.isLoading) return null;

  return (
    <div className="vertical-center">
      <div className="text-center pb-4">
        <Logo />
      </div>
      <Card className="col-xl-3 col-lg-4 col-md-6 col-8 mx-auto p-4 border-0 card-shadow">
        <ResetPwdForm token={token} />
      </Card>
    </div>
  );
}
