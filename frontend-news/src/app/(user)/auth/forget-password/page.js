// guard
import GuestGuard from '@/guards/guest';
//  components
import ForgetPasswordMain from '@/components/_main/auth/forget-password';

// Meta information
export const metadata = {
  title: 'Forgot Password | adhyatmah- Reset Your Password and Regain Access',
  description:
    'Forgot your password? Reset it with adhyatmahfor seamless access to your account. Regain control and enjoy hassle-free browsing, secure transactions, and personalized experiences. Get back on track with adhyatmahnow!',
  applicationName: 'adhyatmah',
  authors: 'adhyatmah',
  keywords:
    'forgot password, adhyatmah, reset password, adhyatmahpassword recovery, password reset, password recovery, account access, regain access, secure login, secure access, hassle-free login, personalized login, password recovery tool, forgotten password'
};

export default function ForgetPassword() {
  return (
    <GuestGuard>
      <ForgetPasswordMain />
    </GuestGuard>
  );
}
