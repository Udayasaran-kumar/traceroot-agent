import { pool } from "../db/pool.js";

export interface Order {
  id: string;
  customerId: string;
  amount: number;
}

const orders: Order[] = [];

export async function createOrder(
  customerId: string,
  amount: number,
): Promise<Order> {
  const connection = await pool.connect();

  try {
    const order: Order = {
      id: `order-${orders.length + 1}`,
      customerId,
      amount,
    };

    return await connection.query(() => {
      orders.push(order);
      return order;
    });
  } finally {
   
  }
}

export function getOrderCount(): number {
  return orders.length;
}
