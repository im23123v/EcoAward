export interface TextField {
  id: string;
  type: 'text';
  fieldName: string;
  left: number;
  top: number;
  fontSize: number;
  fontFamily: string;
  fill: string;
  fontWeight?: string;
  fontStyle?: string;
  textAlign?: 'left' | 'center' | 'right';
  underline?: boolean;
  opacity?: number;
  strokeColor?: string;
  strokeWidth?: number;
  shadow?: boolean;
}

export interface ImageElement {
  id: string;
  type: 'image';
  src: string;
  left: number;
  top: number;
  width: number;
  height: number;
  scaleX: number;
  scaleY: number;
  opacity?: number;
  rotation?: number;
}

export type CertificateElement = TextField | ImageElement;

export interface CertificateTemplate {
  id: string;
  name: string;
  file: File;
  url: string;
  textFields: TextField[];
  imageElements: ImageElement[];
}

export const STICKERS = [
  { id: 'star', name: 'Gold Star', emoji: '⭐', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2b50.svg' },
  { id: 'trophy', name: 'Trophy', emoji: '🏆', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3c6.svg' },
  { id: 'medal', name: 'Medal', emoji: '🏅', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f3c5.svg' },
  { id: 'ribbon', name: 'Ribbon', emoji: '🎀', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f380.svg' },
  { id: 'crown', name: 'Crown', emoji: '👑', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f451.svg' },
  { id: 'sparkles', name: 'Sparkles', emoji: '✨', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2728.svg' },
  { id: 'check', name: 'Check Mark', emoji: '✅', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2705.svg' },
  { id: 'leaf', name: 'Leaf', emoji: '🌿', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f33f.svg' },
  { id: 'tree', name: 'Tree', emoji: '🌳', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f333.svg' },
  { id: 'globe', name: 'Earth', emoji: '🌍', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f30d.svg' },
  { id: 'recycle', name: 'Recycle', emoji: '♻️', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/267b.svg' },
  { id: 'heart', name: 'Heart', emoji: '❤️', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/2764.svg' },
  { id: 'fire', name: 'Fire', emoji: '🔥', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f525.svg' },
  { id: 'rocket', name: 'Rocket', emoji: '🚀', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f680.svg' },
  { id: 'diamond', name: 'Diamond', emoji: '💎', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f48e.svg' },
  { id: 'hundred', name: '100', emoji: '💯', url: 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4af.svg' },
];

export const FONT_OPTIONS = [
  { value: "Arial", label: "Arial" },
  { value: "Times New Roman", label: "Times New Roman" },
  { value: "Georgia", label: "Georgia" },
  { value: "Courier New", label: "Courier New" },
  { value: "Verdana", label: "Verdana" },
  { value: "Trebuchet MS", label: "Trebuchet MS" },
  { value: "Palatino Linotype", label: "Palatino" },
  { value: "Impact", label: "Impact" },
  { value: "Comic Sans MS", label: "Comic Sans" },
  { value: "Lucida Console", label: "Lucida Console" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Plus Jakarta Sans", label: "Jakarta Sans" },
];

export const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

export const COLOR_PRESETS = [
  "#1a1a1a", "#ffffff", "#dc2626", "#16a34a", "#2563eb", 
  "#9333ea", "#ca8a04", "#0891b2", "#ec4899", "#f97316",
  "#000000", "#374151", "#6b7280", "#9ca3af", "#d1d5db",
];