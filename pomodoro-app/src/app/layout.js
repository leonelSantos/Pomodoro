import './styles/global.css';
import { PomodoroProvider } from './context/PomodoroContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

export const metadata = {
  title: 'FocusFlow - Pomodoro Timer',
  description: 'A minimal pomodoro timer app with time tracking',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PomodoroProvider>
          <ThemeProvider>
            <Layout>
              {children}
            </Layout>
          </ThemeProvider>
        </PomodoroProvider>
      </body>
    </html>
  );
}