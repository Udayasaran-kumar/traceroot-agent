class ConnectionPool {
    maxConnections = 5;
    activeConnections = 0;
    async connect() {
        if (this.activeConnections >= this.maxConnections) {
            throw new Error("Connection pool exhausted");
        }
        this.activeConnections += 1;
        let released = false;
        return {
            query: async (operation) => {
                return operation();
            },
            release: () => {
                if (!released) {
                    released = true;
                    this.activeConnections -= 1;
                }
            },
        };
    }
    getActiveConnections() {
        return this.activeConnections;
    }
    getMaxConnections() {
        return this.maxConnections;
    }
}
export const pool = new ConnectionPool();
