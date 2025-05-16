
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
  // Define predefined color options
  const colorOptions = [
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#3B82F6', // Blue
    '#10B981', // Green
    '#F97316', // Orange
    '#EF4444', // Red
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={`color-${label}`}>{label}</Label>
        <div className="text-xs text-muted-foreground">{value}</div>
      </div>
      
      <div className="flex space-x-2 items-center">
        <div 
          className="w-10 h-10 rounded-md border border-white/30 shadow-sm"
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
      
      <div className="flex flex-wrap gap-2 pt-1">
        {colorOptions.map((color) => (
          <button
            key={color}
            type="button"
            className={`w-6 h-6 rounded-md border transition-all ${
              value === color ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : 'border-white/20'
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onChange(color)}
            aria-label={`Select color ${color}`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;
