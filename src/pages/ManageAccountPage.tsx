import { useParams } from 'react-router-dom';
import ManageAccount from '../features/ManageAccount';

const ManageAccountPage = () => {
  const { mode } = useParams();
  const validMode = mode === 'create' || mode === 'manage' ? mode : 'manage';

  return <ManageAccount mode={validMode} onClose={() => {}} />;
};

export default ManageAccountPage;