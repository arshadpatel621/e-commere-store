import Layout from '../components/Layout';

export default function AboutPage() {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
                <h1 className="text-4xl font-bold mb-8 text-text-main dark:text-white">About Ramzan Fruits</h1>

                <div className="prose dark:prose-invert max-w-none text-lg text-gray-600 dark:text-gray-300 space-y-6">
                    <p>
                        Welcome to <strong>Ramzan Fruits</strong>, your trusted source for premium quality dates, fruits, and seasonal delights. We are dedicated to providing the freshest produce to bless your Iftar and Suhoor tables.
                    </p>
                    <p>
                        Established with a passion for quality and service, we source our fruits directly from the best farms to ensure you receive nothing but the best. Whether you are looking for Ajwa dates, fresh mangoes, or refreshing melons, we have it all.
                    </p>
                    <p>
                        Our commitment goes beyond just selling fruits; it's about being a part of your Ramzan traditions. We understand the importance of wholesome, healthy food during this holy month, and we strive to deliver that to your doorstep.
                    </p>

                    <h2 className="text-2xl font-bold text-text-main dark:text-white mt-12 mb-4">Our Location</h2>
                    <p>
                        Visit us at our main outlet:<br />
                        <strong>Bidar old city 585401 fruit market road</strong>
                    </p>

                    <h2 className="text-2xl font-bold text-text-main dark:text-white mt-8 mb-4">Contact Us</h2>
                    <p>
                        Have questions or bulk orders? Reach out to us anytime.<br />
                        Phone: +91 98765 43210 (Placeholder)<br />
                        Email: support@ramzanfruits.com
                    </p>
                </div>
            </div>
        </Layout>
    );
}
