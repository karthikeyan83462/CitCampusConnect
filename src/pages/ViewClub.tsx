import { useParams, useLocation } from 'react-router-dom';

const ViewClub = () => {
  const { clubId } = useParams();
  const search = new URLSearchParams(useLocation().search);
  const name = search.get('name');

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to {name}</h1>
      <p>This is a placeholder club page for Club ID: {clubId}</p>
    </div>
  );
};

export default ViewClub;
