import emailjs from '@emailjs/browser';

// REPLACE THESE WITH YOUR ACTUAL EMAILJS KEYS
const EMAILJS_SERVICE_ID = 'service_zgqy5zb';
const EMAILJS_TEMPLATE_ID = 'template_8d0mfkp';
const EMAILJS_PUBLIC_KEY = '7F56qZ0tGhsV32tOf';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    unit: string;
}

interface OrderEmailData {
    order_id: string;
    customer_name: string;
    total_amount: number;
    items: OrderItem[];
}

export const sendOrderEmail = async (data: OrderEmailData) => {
    try {
        // Create a nice list of items
        const productList = data.items
            .map(item => `- ${item.name} (${item.quantity} ${item.unit})`)
            .join('\n');

        const emailMessage = `Hello Sir,

A new order is coming! 🚀

Order ID: ${data.order_id}
Customer: ${data.customer_name}
Total Amount: ₹${data.total_amount}

Products Ordered:
${productList}

Please check the admin dashboard for full details.

Best regards,
ZestMart Team`;

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                order_id: data.order_id,
                to_name: 'Admin',
                customer_name: data.customer_name,
                total_amount: data.total_amount,
                items_count: data.items.length,
                message: emailMessage,
            },
            EMAILJS_PUBLIC_KEY
        );
        console.log('Email sent successfully!', response.status, response.text);
    } catch (error) {
        console.error('Failed to send email:', error);
        alert('Email Failed to Send. Error: ' + JSON.stringify(error));
    }
};

interface DeliveryAssignmentData {
    deliveryBoyEmail: string;
    deliveryBoyName: string;
    orderId: string;
}

export const sendDeliveryAssignmentEmail = async (data: DeliveryAssignmentData) => {
    try {
        const emailMessage = `Hello ${data.deliveryBoyName},

A new order has been assigned to you! 📦

Order ID: ${data.orderId}
Status: Processing

Please check your dashboard and complete the delivery on time.

Best regards,
ZestMart Team`;

        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            {
                order_id: data.orderId,
                to_email: data.deliveryBoyEmail,
                to_name: data.deliveryBoyName,
                message: emailMessage,
                subject: `New Assignment: Order #${data.orderId}`
            },
            EMAILJS_PUBLIC_KEY
        );
        console.log('Assignment email sent successfully!', response.status, response.text);
    } catch (error) {
        console.error('Failed to send assignment email:', error);
        // Don't alert here to avoid disrupting the admin flow too much, just log
    }
};
