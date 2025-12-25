
export type CardTone = 'Heartfelt' | 'Funny' | 'Professional' | 'Poetic' | 'Short & Sweet';

export type CardFrameStyle = 'Classic' | 'Candy Cane' | 'Winter Frost' | 'Minimalist';

export interface CardState {
  recipient: string;
  sender: string;
  tone: CardTone;
  frameStyle: CardFrameStyle;
  message: string;
  imageUrl: string;
  isGeneratingText: boolean;
  isGeneratingImage: boolean;
}

export interface SnowflakeProps {
  id: number;
  size: number;
  left: number;
  duration: number;
  opacity: number;
  blur: number;
}
