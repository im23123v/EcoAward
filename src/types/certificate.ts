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
}

export type CertificateElement = TextField | ImageElement;

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
];

export const FONT_SIZES = [16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72];
