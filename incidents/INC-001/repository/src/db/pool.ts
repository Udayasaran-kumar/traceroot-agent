export interface DbConnection {
  query<T>(operation: () => T): Promise<T>;
  release(): void;
}

class ConnectionPool {
  private readonly maxConnections = 5;
  private activeConnections = 0;

  async connect(): Promise<DbConnection> {
    if (this.activeConnections >= this.maxConnections) {
      throw new Error("Connection pool exhausted");
    }

    this.activeConnections += 1;

    let released = false;

    return {
      query: async <T>(operation: () => T): Promise<T> => {
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

  getActiveConnections(): number {
    return this.activeConnections;
  }
  getMaxConnections(): number {
    return this.maxConnections;
  }
}

export const pool = new ConnectionPool();
