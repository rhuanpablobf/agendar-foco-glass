
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ 
  label, 
  value, 
  onChange 
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={`color-${label}`}>{label}</Label>
        <div className="text-xs text-muted-foreground">{value}</div>
      </div>
      
      <div className="flex space-x-2 items-center">
        <div 
          className="w-8 h-8 rounded-md border border-white/30"
          style={{ backgroundColor: value }}
        />
        <Input
          id={`color-${label}`}
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 cursor-pointer"
        />
      </div>
    </div>
  );
};

export default ColorPicker;
