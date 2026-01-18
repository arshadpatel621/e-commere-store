import Layout from '../components/Layout';

export default function PrivacyPage() {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <h1 className="text-4xl font-bold mb-8 text-text-main dark:text-white">Privacy Policy</h1>

                <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-6">
                    <p className="text-sm text-gray-500">Last Updated: January 18, 2026</p>

                    <p>
                        At Ramzan Fruits, we value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your personal information when you visit our website or use our services.
                    </p>

                    <h2 className="text-xl font-bold text-text-main dark:text-white mt-8 mb-4">1. Information We Collect</h2>
                    <p>
                        We may collect personal information such as your name, email address, phone number, and delivery address when you place an order or sign up for our services. We also collect non-personal information about your device and browsing usage to improve our website.
                    </p>

                    <h2 className="text-xl font-bold text-text-main dark:text-white mt-8 mb-4">2. How We Use Your Information</h2>
                    <p>
                        We use your information to:
                    </p>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Process and deliver your orders.</li>
                        <li>Communicate with you regarding your order status.</li>
                        <li>Improve our website and customer service.</li>
                        <li>Send promotional offers (only if you opt-in).</li>
                    </ul>

                    <h2 className="text-xl font-bold text-text-main dark:text-white mt-8 mb-4">3. Information Sharing</h2>
                    <p>
                        We do not sell or rent your personal information to third parties. We may share your data with trusted service providers who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential (e.g., delivery partners).
                    </p>

                    <h2 className="text-xl font-bold text-text-main dark:text-white mt-8 mb-4">4. Data Security</h2>
                    <p>
                        We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet is 100% secure.
                    </p>

                    <h2 className="text-xl font-bold text-text-main dark:text-white mt-8 mb-4">5. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at support@ramzanfruits.com.
                    </p>
                </div>
            </div>
        </Layout>
    );
}
