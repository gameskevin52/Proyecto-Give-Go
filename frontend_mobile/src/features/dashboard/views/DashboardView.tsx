import React from 'react';
import { useAuth } from '../../../store/auth/AuthContext';
import { AdminDashboardView } from '../../admin/views/AdminDashboardView';
import { OrgDashboardView } from '../../organization/views/OrgDashboardView';
import { BeneficiaryDashboardView } from '../../beneficiary/views/BeneficiaryDashboardView';
import { VolunteerDashboardView } from '../../volunteer/views/VolunteerDashboardView';

interface DashboardViewProps {
  navigation: any;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ navigation }) => {
  const { user } = useAuth();
  const role = (user?.rol || 'voluntario').toLowerCase();

  if (role === 'admin') {
    return <AdminDashboardView navigation={navigation} />;
  }

  if (role === 'organizacion') {
    return <OrgDashboardView navigation={navigation} />;
  }

  if (role === 'beneficiario') {
    return <BeneficiaryDashboardView navigation={navigation} />;
  }

  return <VolunteerDashboardView navigation={navigation} />;
};

export default DashboardView;
