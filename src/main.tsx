import { createRoot } from 'react-dom/client';
import App from './App';
import 'amfe-flexible';
import './global.css';
createRoot(document.getElementById('root') as HTMLElement).render(<App />);
