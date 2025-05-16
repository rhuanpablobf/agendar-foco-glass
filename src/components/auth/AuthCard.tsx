
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  title: string;
  description?: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const AuthCard = ({ title, description, footer, children, className }: AuthCardProps) => {
  return (
    <Card className={cn('w-[400px] shadow-glass-lg animate-fadeIn', className, 'glass-card')}>
      <CardHeader>
        <div className="flex justify-center mb-3">
          <div className="h-10 w-10 bg-accent rounded-md flex items-center justify-center">
            <span className="text-white font-bold text-lg">BS</span>
          </div>
        </div>
        <CardTitle className="text-center">{title}</CardTitle>
        {description && <CardDescription className="text-center">{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
};
