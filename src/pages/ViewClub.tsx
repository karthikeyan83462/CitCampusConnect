import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Users, User, Crown, Shield, Star } from 'lucide-react';
import { AppDispatch, RootState } from '../store/store';
import { fetchClubMembers } from '../store/slices/clubSlice';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const ViewClubContainer = styled.div`
  background-color: ${props => props.theme.colors.surface};
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
  
  @media (min-width: 640px) {
    padding: 2rem;
  }
`;

const Header = styled.div`
  margin-bottom: 1rem;
`;

const ClubTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  line-height: 1.2;
  
  @media (min-width: 640px) {
    font-size: 2.5rem;
  }
`;

const LoadingText = styled.p`
  color: #64748b;
  font-size: 1.125rem;
  text-align: center;
  padding: 2rem;
`;

const MembersContainer = styled.div`
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.5rem;
`;

const MembersTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const TitleIcon = styled(Users)`
  width: 1.5rem;
  height: 1.5rem;
  color: #3b82f6;
`;

const EmptyMessage = styled.p`
  color: #64748b;
  text-align: center;
  padding: 2rem;
`;

const MembersList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MemberItem = styled.li`
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const MemberInfo = styled.div``;

const MemberName = styled.p`
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.25rem 0;
`;

const MemberEmail = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0;
`;

const PositionBadge = styled.span<{ position: string }>`
  background-color: #dbeafe;
  color: #1e40af;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-weight: 500;
  text-transform: capitalize;
  
  ${props => {
    switch (props.position) {
      case 'head':
        return 'background-color: #fef3c7; color: #d97706;';
      case 'secretary':
        return 'background-color: #dcfce7; color: #166534;';
      case 'treasurer':
        return 'background-color: #fef2f2; color: #dc2626;';
      case 'event_manager':
        return 'background-color: #f3e8ff; color: #7c3aed;';
      default:
        return 'background-color: #dbeafe; color: #1e40af;';
    }
  }}
`;

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
    <ViewClubContainer>
      <Header>
        <ClubTitle>Welcome to {name}</ClubTitle>
      </Header>
      
      {loading ? (
        <LoadingText>Loading members...</LoadingText>
      ) : (
        <MembersContainer>
          <MembersTitle>
            <TitleIcon />
            Club Members
          </MembersTitle>
          
          {clubMembers.length === 0 ? (
            <EmptyMessage>No members found.</EmptyMessage>
          ) : (
            <MembersList>
              {clubMembers.map((member) => (
                <MemberItem key={member.id}>
                  <MemberInfo>
                    <MemberName>
                      {member.profile?.full_name || member.profile?.email}
                    </MemberName>
                    <MemberEmail>{member.profile?.email}</MemberEmail>
                  </MemberInfo>
                  <PositionBadge position={member.position}>
                    {member.position}
                  </PositionBadge>
                </MemberItem>
              ))}
            </MembersList>
          )}
        </MembersContainer>
      )}
    </ViewClubContainer>
  );
};

export default ViewClub;
