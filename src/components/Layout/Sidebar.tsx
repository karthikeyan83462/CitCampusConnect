import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, Users, Utensils, Home, ShoppingBag, Settings } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useTheme } from '../../contexts/ThemeContext';
import type { RootState } from '../../store/store';
import styled from 'styled-components';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarContainer = styled.div<{ isOpen: boolean; isHovered: boolean }>`
  position: fixed;
  top: 4rem; /* Below header */
  left: 0;
  height: calc(100vh - 4rem); /* Full height minus header */
  width: ${props => props.isHovered ? '16rem' : '4rem'};
  background-color: ${props => props.theme.isDark ? '#1e293b' : 'white'};
  z-index: 50;
  display: flex;
  flex-direction: column;
  border-right: 1px solid ${props => props.theme.colors.border};
  transition: width 0.15s ease; /* Faster transition */
  overflow: hidden; /* Prevent content overflow */
  
  @media (max-width: 768px) {
    top: 0; /* Full height on mobile */
    height: 100vh;
    width: 16rem;
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  }
  
  @media (min-width: 769px) {
    transform: translateX(0);
  }
`;

const SidebarHeader = styled.div<{ isHovered: boolean }>`
  display: none; /* Hide header on desktop */
  
  @media (max-width: 768px) {
    display: flex;
    padding: 1rem 1.5rem;
    border-bottom: 1px solid ${props => props.theme.colors.border};
    align-items: center;
    justify-content: flex-end;
    min-height: 3.5rem;
  }
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
  padding: 0.5rem 0;
  overflow-y: auto;
  overflow-x: hidden; /* Prevent horizontal scroll */
`;

const MenuList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Gap between menu items */
`;

const MenuItem = styled.li`
  margin: 0;
`;

const MenuLink = styled(Link)<{ isActive: boolean; isHovered: boolean }>`
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem; /* Fixed padding */
  color: ${props => props.isActive ? props.theme.colors.text : props.theme.colors.textSecondary};
  text-decoration: none;
  font-weight: 500;
  justify-content: flex-start; /* Always left-aligned to keep icons in place */
  transition: all 0.15s ease; /* Faster transition */
  white-space: nowrap; /* Prevent text wrapping */
  width: 100%; /* Ensure full width for centering */
  position: relative; /* For absolute positioning of icons */
  
  ${props => props.isActive && `
    background-color: ${props.theme.isDark ? '#3b82f6' : '#f1f5f9'};
  `}
  
  &:hover {
    background-color: ${props => props.isActive ? (props.theme.isDark ? '#3b82f6' : '#f1f5f9') : (props.theme.isDark ? '#334155' : '#f8fafc')};
    color: ${props => props.theme.colors.text};
  }
`;

const MenuIcon = styled.div<{ isActive: boolean; isHovered: boolean }>`
  width: 1.25rem;
  height: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  ${props => props.isActive ? `
    color: ${props.theme.colors.text};
  ` : `
    color: ${props.theme.colors.textSecondary};
    
    ${MenuLink}:hover & {
      color: ${props.theme.colors.text};
    }
  `}
`;

const MenuText = styled.span<{ isHovered: boolean }>`
  font-size: 0.875rem;
  opacity: ${props => props.isHovered ? '1' : '0'}; /* Hidden on desktop when collapsed */
  transition: opacity 0.15s ease; /* Faster transition */
  white-space: nowrap; /* Prevent text wrapping */
  overflow: hidden; /* Hide overflow text */
  margin-left: 1.5rem;
  
  @media (max-width: 768px) {
    opacity: 1; /* Always visible on mobile */
  }
`;

const SidebarFooter = styled.div<{ isHovered: boolean }>`
  padding: ${props => props.isHovered ? '1rem 1.5rem' : '1rem 0.5rem'};
  border-top: 1px solid ${props => props.theme.colors.border};
  min-height: 4rem; /* Fixed height to prevent movement */
`;

const UserSection = styled.div<{ isHovered: boolean }>`
  display: flex;
  align-items: center;
  gap: ${props => props.isHovered ? '0.75rem' : '0'};
  padding: ${props => props.isHovered ? '0.75rem' : '0.75rem 0'};
  background-color: ${props => props.theme.isDark ? '#334155' : '#f8fafc'};
  border-radius: 0.5rem;
  justify-content: center; /* Always center the avatar */
  transition: gap 0.15s ease; /* Faster transition */
`;

const UserAvatar = styled.div<{ isHovered: boolean }>`
  width: ${props => props.isHovered ? '2.5rem' : '2rem'};
  height: ${props => props.isHovered ? '2.5rem' : '2rem'};
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: ${props => props.isHovered ? '1rem' : '0.875rem'};
  flex-shrink: 0;
  transition: width 0.15s ease, height 0.15s ease, font-size 0.15s ease;
`;

const UserInfo = styled.div<{ isHovered: boolean }>`
  flex: 1;
  min-width: 0;
  opacity: ${props => props.isHovered ? '1' : '0'};
  transition: opacity 0.15s ease; /* Faster transition */
  overflow: hidden; /* Hide overflow content */
  display: ${props => props.isHovered ? 'block' : 'none'}; /* Hide completely when collapsed */
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

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  toggleSidebar
}) => {
  const location = useLocation();
  const { user } = useSelector((state: RootState) => state.auth);
  const { isDark } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Clubs', path: '/clubs', icon: Users },
    { name: 'Canteen', path: '/canteen', icon: Utensils },
    { name: 'Hostel', path: '/hostel', icon: Home },
    { name: 'Marketplace', path: '/marketplace', icon: ShoppingBag },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleMouseEnter = () => {
    if (window.innerWidth > 768) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth > 768) {
      setIsHovered(false);
    }
  };

  return (
    <>
      <SidebarContainer 
        isOpen={isOpen} 
        isHovered={isHovered}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <SidebarHeader isHovered={isHovered}>
          <CloseButton onClick={toggleSidebar}>
            <X />
          </CloseButton>
        </SidebarHeader>

        <SidebarContent>
          <MenuList>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              const IconComponent = item.icon;
              return (
                <MenuItem key={item.path}>
                  <MenuLink to={item.path} isActive={isActive} isHovered={isHovered}>
                    <MenuIcon isActive={isActive} isHovered={isHovered}>
                      <IconComponent size={20} />
                    </MenuIcon>
                    <MenuText isHovered={isHovered}>{item.name}</MenuText>
                  </MenuLink>
                </MenuItem>
              );
            })}
          </MenuList>
        </SidebarContent>

        <SidebarFooter isHovered={isHovered}>
          <UserSection isHovered={isHovered}>
            <UserAvatar isHovered={isHovered}>{user?.full_name?.charAt(0)}</UserAvatar>
            <UserInfo isHovered={isHovered}>
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
