import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-background-dark border-t border-neutral-100 dark:border-neutral-800 pt-16 pb-8 transition-colors">
            <div className="max-w-[1440px] mx-auto px-4 md:px-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-text-main dark:text-white">
                            <span className="material-symbols-outlined text-[28px] text-primary">nutrition</span>
                            <span className="text-xl font-bold">ZestMart</span>
                        </div>
                        <p className="text-text-muted text-sm leading-relaxed">
                            Delivering freshness and zest to your doorstep. Your trusted partner for high-quality fruits.
                        </p>
                        <div className="flex gap-4 mt-2">
                            <a href="#" className="size-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-text-main dark:text-white hover:bg-primary hover:text-white transition-colors">
                                <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path></svg>
                            </a>
                            <a href="#" className="size-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-text-main dark:text-white hover:bg-primary hover:text-white transition-colors">
                                <svg aria-hidden="true" className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path clipRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465C9.673 2.013 10.03 2 12.484 2h.231zm-2.446 3.633c-2.464 0-2.775.01-3.696.052-1.1.048-1.7.247-2.1.403-.528.206-.902.45-1.296.844-.395.394-.638.768-.844 1.296-.156.4-.355 1-.403 2.1-.042.921-.052 1.232-.052 3.696s.01 2.775.052 3.696c.048 1.1.247 1.7.403 2.1.206.528.45.902.844 1.296.394.395.768.638 1.296.844.4.156 1 .355 2.1.403.921.042 1.232.052 3.696.052s2.775-.01 3.696-.052c1.1-.048 1.7-.247 2.1-.403.528-.206.902-.45 1.296-.844.394-.395.638-.768.844-1.296.156-.4.355-1 .403-2.1.042-.921.052-1.232.052-3.696s-.01-2.775-.052-3.696c-.048-1.1-.247-1.7-.403-2.1-.206-.528-.45-.902-.844-1.296-.395-.394-.768-.638-1.296-.844-.4-.156-1-.355-2.1-.403-.921-.042-1.232-.052-3.696-.052h-.232z" fillRule="evenodd"></path><path clipRule="evenodd" d="M12.574 7.203a5.373 5.373 0 100 10.745 5.373 5.373 0 000-10.745zm0 8.846a3.473 3.473 0 110-6.946 3.473 3.473 0 010 6.946z" fillRule="evenodd"></path><path clipRule="evenodd" d="M17.844 5.38a1.267 1.267 0 100 2.534 1.267 1.267 0 000-2.534z" fillRule="evenodd"></path></svg>
                            </a>
                        </div>
                    </div>
                    {/* Shop */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-text-main dark:text-white">Shop</h4>
                        <Link to="/shop" className="text-text-muted hover:text-primary text-sm">All Fruits</Link>
                        <Link to="/shop" className="text-text-muted hover:text-primary text-sm">Dates & Dry Fruits</Link>
                        <Link to="/shop" className="text-text-muted hover:text-primary text-sm">Gift Baskets</Link>
                        <Link to="/shop" className="text-text-muted hover:text-primary text-sm">Bulk Orders</Link>
                    </div>
                    {/* Company */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-text-main dark:text-white">Company</h4>
                        <Link to="/about" className="text-text-muted hover:text-primary text-sm">About Us</Link>
                        <Link to="/about" className="text-text-muted hover:text-primary text-sm">Contact</Link>
                        <Link to="/privacy" className="text-text-muted hover:text-primary text-sm">Privacy Policy</Link>
                        <Link to="/terms" className="text-text-muted hover:text-primary text-sm">Terms of Service</Link>
                    </div>
                    {/* Contact */}
                    <div className="flex flex-col gap-4">
                        <h4 className="font-bold text-text-main dark:text-white">Contact Us</h4>
                        <div className="flex items-start gap-3 text-text-muted text-sm">
                            <span className="material-symbols-outlined text-[20px] mt-0.5">location_on</span>
                            <span>Bidar old city 585401<br />fruit market road</span>
                        </div>
                        <div className="flex items-center gap-3 text-text-muted text-sm">
                            <span className="material-symbols-outlined text-[20px]">call</span>
                            <span>+971 50 123 4567</span>
                        </div>
                    </div>
                </div>
                <div className="border-t border-neutral-100 dark:border-neutral-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-text-muted">© 2024 ZestMart. All rights reserved.</p>
                    <div className="flex gap-4">
                        {/* Payment icons placeholder */}
                        <div className="h-6 w-10 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                        <div className="h-6 w-10 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                        <div className="h-6 w-10 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
