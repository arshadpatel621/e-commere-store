import { createContext, useContext, useState, type ReactNode, type FC } from 'react';

export interface CartItem {
    id: string;
    name: string;
    price: number;
    unit: string;
    image: string;
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void;
    clearCart: () => void;
    totalAmount: number;
    itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [items, setItems] = useState<CartItem[]>([
        // Initial mock data based on the shopping cart HTML
        {
            id: "1",
            name: "Premium Ajwa Dates",
            price: 850.00,
            unit: "/ pack",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPx8bOOxqfJOLLECcCoKvPocFvQ2dBV2FpH9c4zlp9xUpTLOSU6rWZJlSQsuQAlGjLg1BNhnkNTcSf-EaDB-3bhy8S6g-_nVj5LEXiP1yiCagsZvzV3qT5joXA_je8oAyaK-0S0dHPeA8lmmu99FqzoNPsvaITarftxicQaZkSifQA2OYpP_lp-cs8ud-u3lduknNaFFFQYsLTQYvUGH66fqL1hkuWivCdykuXHJFN7wHMQC80EXtlPwckf342C710SnA7FwtXJfU8",
            quantity: 2
        },
        {
            id: "2",
            name: "Large Watermelon (Whole)",
            price: 120.00,
            unit: "/ unit",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxB-jMoCSEpXw_0SbV2zNnIkOU2k6NNTBT0WgmvhYhzofQ38sRKmnfFNI3PCtdFjErwLR46boJyPRRXbBdPCWouHBsE60Ky3wcSkb9Yo0SMy64sF56IbKhzw6sMBO737OTjKEuZp-eftJhAXteq5YHuFKFjOYS6ddcl1qx-YFXh53oikzEBDn2kK9zJgwPePcaCLn5XDJfk1kmlM32Kj6mpyG0ZcvMX8yXw1NA2bqYvD5UmNjYZKcQgH4GlG3dN4ZgFPIf5F7TGRmY",
            quantity: 1
        },
        {
            id: "3",
            name: "Fresh Fruit Chaat Mix",
            price: 150.00,
            unit: "/ bowl",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjXbWbKcQv_-1TQB-dRVv908BWSyj8wyOJOPpX6k9t3-I8BsgFNY4f3FVBu_vvekKKBOId7QgBmZyYnpBE7RV6B7xrfWCt5A8eEANufF1r5QSVOQOM_8sa6Lhs0TICEWW-GDJ4g0520rL2eaLYwfTdKdCXNucHStl2-56VKfd4-aesZ6cmQ6KDTEmIo4tXDJwndMGDFAiOJQ1qrF7S2KwSUVH04WizTEI3H0eAEMh4j1gOtgfmLqM5X4LYzkbj7cKA-UVtfKTalLFL",
            quantity: 1
        }
    ]);

    const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(item => item.id === newItem.id);
            if (existingItem) {
                return currentItems.map(item =>
                    item.id === newItem.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...currentItems, { ...newItem, quantity: 1 }];
        });
    };

    const removeItem = (id: string) => {
        setItems(currentItems => currentItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, delta: number) => {
        setItems(currentItems => currentItems.map(item => {
            if (item.id === id) {
                const newQuantity = Math.max(0, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }).filter(item => item.quantity > 0)); // Remove if quantity becomes 0
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalAmount, itemCount }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
