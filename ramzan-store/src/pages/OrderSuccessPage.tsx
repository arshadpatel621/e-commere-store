import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function OrderSuccessPage() {
    return (
        <Layout>
            <div className="flex-grow w-full px-6 py-8 lg:px-40 lg:py-12">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
                    <div className="lg:col-span-7 flex flex-col gap-8">
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-3 text-primary mb-2">
                                <span className="material-symbols-outlined text-6xl fill-1">check_circle</span>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-text-dark dark:text-white">
                                Order Confirmed!
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
                                Thank you for shopping with us. Your fresh fruits for Iftar are being carefully selected and packed.
                            </p>
                        </div>

                        <div className="bg-white dark:bg-[#1A2E22] rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-[#2C4034]">
                            <h3 className="text-lg font-bold mb-6 dark:text-white">Delivery Status</h3>
                            <div className="grid grid-cols-[40px_1fr] gap-x-3">
                                <div className="flex flex-col items-center gap-1 pt-1">
                                    <div className="text-primary">
                                        <span className="material-symbols-outlined text-[28px] fill-1">check_circle</span>
                                    </div>
                                    <div className="w-[2px] bg-primary h-full min-h-8"></div>
                                </div>
                                <div className="flex flex-col pb-8">
                                    <p className="text-base font-bold text-text-dark dark:text-white">Order Placed</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">We have received your order.</p>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="bg-primary size-7 rounded-full flex items-center justify-center text-background-dark shadow-lg shadow-primary/40 z-10">
                                        <span className="material-symbols-outlined text-[18px]">package_2</span>
                                    </div>
                                    <div className="w-[2px] bg-gray-200 dark:bg-gray-700 h-full min-h-8"></div>
                                </div>
                                <div className="flex flex-col pb-8 pt-0.5">
                                    <p className="text-base font-bold text-primary">Processing</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">We are preparing your items.</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 pt-2">
                            <Link to="/shop" className="flex-1 bg-white dark:bg-[#1A2E22] border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#233b2d] text-text-dark dark:text-white h-12 rounded-xl font-bold text-base transition-all flex items-center justify-center">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    <div className="lg:col-span-12 lg:col-start-8 xl:col-span-5 flex flex-col gap-6">
                        {/* Optional summary or image could go here */}
                        <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 flex items-end p-6">
                                <p className="text-white font-medium">Fresh seasonal fruits picked for your family.</p>
                            </div>
                            <div className="w-full h-full bg-center bg-cover transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBOGn2T5JjuzNLMIO1qTywjZuKbd-hJe57Uh98u6VDT1vYyNRXumAsQe3IHuZVMINCfycIxGa-dJvD6UZDThJBqRs2jBh9sNH74qiiBmyHs6OlmzzunrA8Yhqu2mxQ4fFpFUPU8l_iyERQ7_j6MzPr8b6yyfrhYeE51gJjxsI4IVWjevRXMx-QGddQ2el5vhHXapxyVF3wh_eDHYIrs7Iusfu_gLWnK_t0DlkmHEQ9jvET1te3wbsF54310B8K4uSmack5Gkbllhv4m')` }}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
