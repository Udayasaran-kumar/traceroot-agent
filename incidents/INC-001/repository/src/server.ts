import { createServer } from "node:http";
import { createOrder } from "./orders/service.js";

const PORT = 3001;

const server = createServer(async (request, response) => {
  try {
    if (request.method === "GET" && request.url === "/health") {
      response.writeHead(200, {
        "content-type": "application/json",
      });

      response.end(
        JSON.stringify({
          status: "ok",
        }),
      );

      return;
    }

    if (request.method === "POST" && request.url === "/orders") {
      const order = await createOrder("customer-1", 100);

      response.writeHead(201, {
        "content-type": "application/json",
      });

      response.end(JSON.stringify(order));

      return;
    }

    response.writeHead(404);
    response.end();
  } catch (error) {
    console.error(error);

    response.writeHead(500, {
      "content-type": "application/json",
    });

    response.end(
      JSON.stringify({
        error: "Internal Server Error",
      }),
    );
  }
});

server.listen(PORT, () => {
  console.log(`Orders API listening on port ${PORT}`);
});
