import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import { signOut, clearUser } from '../../store/slices/authSlice';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from './ThemeToggle';
import type { AppDispatch, RootState } from '../../store/store';
import styled from 'styled-components';

interface NavbarProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const NavbarContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem;
  background-color: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  z-index: 40;
  backdrop-filter: blur(8px);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const MenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#334155' : '#f1f5f9'};
    color: ${props => props.theme.colors.text};
  }
`;

const LogoLink = styled(Link)`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.theme.colors.text};
  text-decoration: none;
  
  &:hover {
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background-color: ${props => props.theme.isDark ? '#334155' : '#f8fafc'};
  
  @media (max-width: 640px) {
    display: none;
  }
`;

const UserAvatar = styled.div`
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
`;

const UserDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  font-size: 0.875rem;
`;

const UserRole = styled.span`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
`;

const SignOutButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  
  &:hover {
    background-color: #dc2626;
  }
`;

const MobileMenuButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  
  @media (min-width: 641px) {
    display: none;
  }
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#334155' : '#f1f5f9'};
    color: ${props => props.theme.colors.text};
  }
`;

const MenuIcon = styled(Menu)`
  width: 1.25rem;
  height: 1.25rem;
`;

const XIcon = styled(X)`
  width: 1.25rem;
  height: 1.25rem;
`;

const LogOutIcon = styled(LogOut)`
  width: 1rem;
  height: 1rem;
`;

const SignOutText = styled.span`
  display: none;
  
  @media (min-width: 640px) {
    display: inline;
  }
`;

const Navbar: React.FC<NavbarProps> = ({ isSidebarOpen, toggleSidebar }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleSignOut = async () => {
    try {
      // Try to dispatch the signOut action
      await dispatch(signOut()).unwrap();
      // Navigate to auth page after successful sign out
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      // If sign out fails (e.g., no Supabase connection), clear user state manually
      dispatch(clearUser());
      // Navigate to auth page
      navigate('/auth');
    }
  };

  return (
    <NavbarContainer>
      <LeftSection>
        <MobileMenuButton onClick={toggleSidebar} aria-label="Toggle sidebar">
          {isSidebarOpen ? <XIcon /> : <MenuIcon />}
        </MobileMenuButton>
        <LogoLink to="/dashboard">
          CampusConnect
        </LogoLink>
      </LeftSection>
      
      <RightSection>
        <ThemeToggle />
        <UserInfo>
          <UserAvatar>{user?.full_name?.charAt(0)}</UserAvatar>
          <UserDetails>
            <UserName title={user?.full_name}>{user?.full_name}</UserName>
            <UserRole title={user?.role?.replace('_', ' ')}>{user?.role?.replace('_', ' ')}</UserRole>
          </UserDetails>
        </UserInfo>
        <SignOutButton onClick={handleSignOut}>
          <LogOutIcon />
          <SignOutText>Sign Out</SignOutText>
        </SignOutButton>
      </RightSection>
    </NavbarContainer>
  );
};

export default Navbar;