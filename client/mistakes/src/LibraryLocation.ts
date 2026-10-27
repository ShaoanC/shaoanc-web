import { createContext, useContext } from 'react';

export const LibraryLocationContext = createContext<string | null>(null);
export const useLibraryLocation = () => useContext(LibraryLocationContext);
export const isLibraryPath = (path: string) => ['/', '/mistakes'].includes(path.split('?')[0]);
