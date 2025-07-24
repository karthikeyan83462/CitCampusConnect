import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../contexts/ThemeContext';
import type { RootState } from '../../store/store';
import styled from 'styled-components';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 16rem;
  background-color: ${props => props.theme.isDark ? '#1e293b' : 'white'};
  z-index: 50;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${props => props.theme.colors.border};
  
  @media (max-width: 768px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
  
  @media (min-width: 769px) {
    transform: translateX(0);
  }
`;

const SidebarHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SidebarTitle = styled.h2`
  color: ${props => props.theme.colors.text};
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  color: ${props => props.theme.colors.textSecondary};
  border-radius: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  
  @media (min-width: 769px) {
    display: none;
  }
  
  &:hover {
    background-color: ${props => props.theme.isDark ? '#334155' : '#f1f5f9'};
    color: ${props => props.theme.isDark ? 'white' : '#334155'};
  }
`;

const SidebarContent = styled.div`
  flex: 1;
  padding: 1rem 0;
  overflow-y: auto;
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const MenuItem = styled.li`
  margin: 0;
`;

const MenuLink = styled(Link)<{ isActive: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: ${props => props.isActive ? props.theme.colors.text : props.theme.colors.textSecondary};
  text-decoration: none;
  font-weight: 500;
  
  ${props => props.isActive && `
    background-color: ${props.theme.isDark ? '#3b82f6' : '#f1f5f9'};
  `}
  
  &:hover {
    background-color: ${props => props.isActive ? (props.theme.isDark ? '#3b82f6' : '#f1f5f9') : (props.theme.isDark ? '#334155' : '#f8fafc')};
    color: ${props => props.theme.colors.text};
  }
`;

const MenuIcon = styled.div<{ isActive: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  
  ${props => props.isActive ? `
    color: ${props.theme.colors.text};
  ` : `
    color: ${props.theme.colors.textSecondary};
    
    ${MenuLink}:hover & {
      color: ${props.theme.colors.text};
    }
  `}
`;

const MenuText = styled.span`
  font-size: 0.875rem;
`;

const SidebarFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${props => props.theme.colors.border};
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: ${props => props.theme.isDark ? '#334155' : '#f8fafc'};
  border-radius: 0.5rem;
`;

const UserAvatar = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
`;

const UserInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const UserName = styled.p`
  color: ${props => props.theme.colors.text};
  font-weight: 600;
  font-size: 0.875rem;
  margin: 0 0 0.25rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const UserRole = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 0.75rem;
  margin: 0;
  text-transform: capitalize;
`;

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDark } = useTheme();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Clubs', path: '/clubs', icon: '👥' },
    { name: 'Canteen', path: '/canteen', icon: '🍽️' },
    { name: 'Hostel', path: '/hostel', icon: '🏠' },
    { name: 'Marketplace', path: '/marketplace', icon: '🛍️' },
    { name: 'Settings', path: '/settings', icon: '⚙️' },
  ];

  return (
    <>
      <SidebarContainer isOpen={isOpen}>
        <SidebarHeader>
          <SidebarTitle>Dashboard</SidebarTitle>
          <CloseButton onClick={toggleSidebar}>
            <X />
          </CloseButton>
        </SidebarHeader>

        <SidebarContent>
          <MenuList>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <MenuItem key={item.path}>
                  <MenuLink to={item.path} isActive={isActive}>
                    <MenuIcon isActive={isActive}>
                      {item.icon}
                    </MenuIcon>
                    <MenuText>{item.name}</MenuText>
                  </MenuLink>
                </MenuItem>
              );
            })}
          </MenuList>
        </SidebarContent>

        <SidebarFooter>
          <UserSection>
            <UserAvatar>{user?.full_name?.charAt(0)}</UserAvatar>
            <UserInfo>
              <UserName>{user?.full_name}</UserName>
              <UserRole>{user?.role}</UserRole>
            </UserInfo>
          </UserSection>
        </SidebarFooter>
      </SidebarContainer>
    </>
  );
};

export default Sidebar;
