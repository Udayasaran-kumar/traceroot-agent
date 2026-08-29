import assert from "node:assert/strict";
import { test } from "node:test";
import { pool } from "../src/db/pool.js";
import { createOrder, getOrderCount, } from "../src/orders/service.js";
test("creates an order and releases the database connection", async () => {
    const before = pool.getActiveConnections();
    const order = await createOrder("customer-1", 100);
    assert.equal(order.customerId, "customer-1");
    assert.equal(order.amount, 100);
    const after = pool.getActiveConnections();
    assert.equal(after, before);
});
test("multiple orders do not exhaust the connection pool", async () => {
    const startingCount = getOrderCount();
    for (let i = 0; i < 20; i += 1) {
        await createOrder(`customer-${i}`, 100 + i);
    }
    assert.equal(getOrderCount(), startingCount + 20);
    assert.equal(pool.getActiveConnections(), 0);
});
