import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
    children: ReactNode;
    hideHeader?: boolean;
    hideFooter?: boolean;
}

export default function Layout({ children, hideHeader = false, hideFooter = false }: LayoutProps) {
    return (
        <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-text-main dark:text-white antialiased selection:bg-primary/30">
            {!hideHeader && <Header />}
            <main className="flex-1 flex flex-col items-center w-full">
                {children}
            </main>
            {!hideFooter && <Footer />}
        </div>
    );
}
