'use client';

import Link from 'next/link';
import useUserStore from '@/zustand/userStore';
import { baseButtonClass, btnColor, btnSize, btnDisabled } from './buttonStyle';

// 공통 유틸리티 함수: 버튼 클래스 조합
function getButtonClasses({
  bgColor = 'orange',
  size = 'md',
  disabled,
  className,
}: {
  bgColor?: 'gray' | 'orange' | 'red';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}): string {
  return [
    baseButtonClass,
    btnColor[bgColor],
    btnSize[size],
    disabled && btnDisabled,
    className,
  ].filter(Boolean).join(' ');
}

// Button Props
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  bgColor?: 'gray' | 'orange' | 'red'; // 버튼 배경색
  size?: 'sm' | 'md' | 'lg'; // 버튼 크기
  needLogin?: boolean; // 로그인 필요 여부
  ownerId?: number; // 특정 사용자에게만 노출할 경우 사용자 id
}

// LinkButton Props
interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode; // 버튼 내부에 표시될 내용
  href: string; // 이동할 경로
  bgColor?: 'gray' | 'orange' | 'red'; // 버튼 배경색
  size?: 'sm' | 'md' | 'lg'; // 버튼 크기
  needLogin?: boolean; // 로그인 필요 여부
  ownerId?: number; // 특정 사용자에게만 노출할 경우 사용
  className?: string; // 추가 클래스
}

// Button 컴포넌트 정의
export const Button: React.FC<ButtonProps> = ({ 
  children, 
  bgColor, 
  size, 
  className, 
  needLogin, 
  ownerId, 
  disabled, 
  ...rest 
}) => {
  const { user } = useUserStore(); // 로그인 사용자 정보 가져오기

  // 로그인 필요 & 로그인 안 된 경우 버튼 미노출
  if (needLogin && !user) return null;
  // ownerId가 있고, 현재 로그인 사용자가 owner가 아니면 버튼 미노출
  if (ownerId && user?._id !== ownerId) return null;
  
  const classes = getButtonClasses({ bgColor, size, disabled, className });
  
  return (
    <button
      className={classes}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};

// LinkButton 컴포넌트 정의
export const LinkButton: React.FC<LinkButtonProps> = ({ 
  children, 
  href, 
  bgColor='orange', 
  size='md', 
  className, 
  needLogin, 
  ownerId, 
  ...rest 
}) => {
  const { user } = useUserStore(); // 로그인 사용자 정보 가져오기

  // 로그인 필요 & 로그인 안 된 경우 버튼 미노출
  if (needLogin && !user) return null;
  // ownerId가 있고, 현재 로그인 사용자가 owner가 아니면 버튼 미노출
  if (ownerId && user?._id !== ownerId) return null;
  
  const classes = getButtonClasses({ bgColor, size, className });
  
  return (
    <Link
      href={href}
      className={classes}
      {...rest}
    >
      {children}
    </Link>
  );
};