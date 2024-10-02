import { Outlet, useParams } from 'react-router-dom';
import ContainerNavbar from '../../components/ContainerNavbar';

const ContainerInside = () => {
  const { id } = useParams();

  return (
    <>
      {id !== undefined && <ContainerNavbar id={id} />}
      <Outlet />
    </>
  );
};

export default ContainerInside;
