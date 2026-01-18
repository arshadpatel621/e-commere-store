import Layout from '../components/Layout';

export default function TermsPage() {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <h1 className="text-4xl font-bold mb-8 text-text-main dark:text-white">Terms of Service</h1>

                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
                    <p className="text-sm text-gray-500">Last Updated: January 18, 2026</p>

                    <p>
                        Welcome to Ramzan Fruits. By accessing or using our website, you agree to be bound by these Terms of Service. Please read them carefully.
                    </p>

                    <h2 className="text-xl font-bold text-text-main dark:text-white mt-8 mb-4">1. Acceptance of Terms</h2>
                    <p>
                        By using our services, you agree to comply with and be legally bound by these terms. If you do not agree to these terms, you may not access or use these services.
                    </p>

                    <h2 className="text-xl font-bold text-text-main dark:text-white mt-8 mb-4">2. Orders and Pricing</h2>
                    <p>
                        All orders are subject to acceptance and availability. Prices for our products are subject to change without notice. We reserve the right to refuse service to anyone for any reason at any time.
                    </p>

                    <h2 className="text-xl font-bold text-text-main dark:text-white mt-8 mb-4">3. Delivery</h2>
                    <p>
                        We aim to deliver within the estimated timeframes, but delays may occur due to unforeseen circumstances. We are not liable for any delays in delivery.
                    </p>

                    <h2 className="text-xl font-bold text-text-main dark:text-white mt-8 mb-4">4. Returns and Refunds</h2>
                    <p>
                        Due to the perishable nature of our products, we generally do not accept returns. However, if you receive damaged or incorrect items, please contact us immediately for a resolution.
                    </p>

                    <h2 className="text-xl font-bold text-text-main dark:text-white mt-8 mb-4">5. Governing Law</h2>
                    <p>
                        These Terms shall be governed by and defined following the laws of India. Ramzan Fruits and yourself irrevocably consent that the courts of India shall have exclusive jurisdiction to resolve any dispute which may arise in connection with these terms.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
