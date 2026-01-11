
export interface JokeSource {
  simdiki: string[];
  eski: string[];
}

export interface AllowedSources {
  [key: string]: string;
}

export type Theme = 'light' | 'dark' | 'oled';
export type View = 'home' | 'old' | 'ai' | 'help' | 'install' | 'pp' ;

export const SupportedLanguages = ['tr', 'en', 'uz', 'az', 'de', 'fr', 'zh', 'ru', 'pt', 'hi', 'es', 'ja', 'id', 'ar'] as const;
export type Language = typeof SupportedLanguages[number];

export interface Settings {
  theme: Theme;
  secondaryColor: string;
  font: string;
  language: Language;
  jokeSourceUrl: string;
  notificationsEnabled: boolean;
  notificationTime: string;
}

export interface AIMessage {
    role: 'user' | 'model' | 'system';
    content: string;
    timestamp: string;
}
