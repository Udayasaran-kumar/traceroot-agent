import { pool } from "../db/pool.js";
const orders = [];
export async function createOrder(customerId, amount) {
    const connection = await pool.connect();
    try {
        const order = {
            id: `order-${orders.length + 1}`,
            customerId,
            amount,
        };
        return await connection.query(() => {
            orders.push(order);
            return order;
        });
    }
    finally {
    }
}
export function getOrderCount() {
    return orders.length;
}
