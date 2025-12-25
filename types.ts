
export type CardTone = 'Heartfelt' | 'Funny' | 'Professional' | 'Poetic' | 'Short & Sweet';

export type CardFrameStyle = 'Classic' | 'Candy Cane' | 'Winter Frost' | 'Forest Pine' | 'Midnight Sleigh' | 'Santa’s Workshop';

export type SealType = 'Reindeer' | 'Snowflake' | 'Tree' | 'Star' | 'Heart' | 'None';

export interface CardState {
  recipient: string;
  sender: string;
  tone: CardTone;
  frameStyle: CardFrameStyle;
  sealType: SealType;
  message: string;
  imageUrl: string;
  audioBase64?: string;
  isGeneratingText: boolean;
  isGeneratingImage: boolean;
  isGeneratingAudio: boolean;
  isExporting: boolean;
}

export interface SnowflakeProps {
  id: number;
  size: number;
  left: number;
  duration: number;
  opacity: number;
  blur: number;
}
