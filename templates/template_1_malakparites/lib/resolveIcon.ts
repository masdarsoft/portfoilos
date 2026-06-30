import * as LucideIcons from 'lucide-react';

/**
 * Client-safe helper to resolve a string icon name to a Lucide icon component.
 * If the input is already a component/function, it returns it directly.
 */
export function getIconComponent(iconName: any): any {
  if (!iconName) return LucideIcons.Sparkles;
  
  if (typeof iconName !== 'string') {
    return iconName;
  }

  // Normalize string name (e.g. "air-vent" or "airvent" -> "AirVent")
  const cleanName = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  const resolved = (LucideIcons as any)[cleanName] || (LucideIcons as any)[iconName];
  return resolved || LucideIcons.Sparkles;
}
