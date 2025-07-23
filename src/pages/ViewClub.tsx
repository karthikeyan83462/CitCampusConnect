import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchClubMembers } from '../store/slices/clubSlice';

const ViewClub = () => {
  const { clubId } = useParams();
  const search = new URLSearchParams(useLocation().search);
  const name = search.get('name');

  const dispatch = useDispatch<AppDispatch>();
  const { clubMembers, loading } = useSelector((state: RootState) => state.clubs);

  useEffect(() => {
    if (clubId) {
      dispatch(fetchClubMembers(clubId));
    }
  }, [clubId, dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Welcome to {name}</h1>
      {loading ? (
        <p>Loading members...</p>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-3">Club Members</h2>
          {clubMembers.length === 0 ? (
            <p className="text-gray-500">No members found.</p>
          ) : (
            <ul className="space-y-3">
              {clubMembers.map((member) => (
                <li
                  key={member.id}
                  className="border border-gray-200 rounded-md px-4 py-2 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium">
                      {member.profile?.full_name || member.profile?.email}
                    </p>
                    <p className="text-sm text-gray-500">{member.profile?.email}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full capitalize">
                    {member.position}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ViewClub;
