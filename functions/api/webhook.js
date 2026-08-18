/**
 * Cloudflare Pages Functions - 专属 Webhook 边缘接收网关 (Edge Gateway)
 * 路由：https://825412.xyz/api/webhook
 * 全球边缘毫秒级响应，永不 503，无外部第三方频次限制
 */
export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const method = request.method;

  // 1. 处理 CORS 预检请求
  if (method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // 2. 提取 Headers 报文头
  const headers = {};
  for (const [key, value] of request.headers.entries()) {
    headers[key] = value;
  }

  // 3. 提取 Body 报文载荷
  let body = null;
  const contentType = request.headers.get("content-type") || "";
  if (method !== "GET" && method !== "HEAD") {
    if (contentType.includes("application/json")) {
      try {
        body = await request.json();
      } catch (e) {
        body = await request.text();
      }
    } else {
      body = await request.text();
    }
  }

  // 4. 构造标准回显响应
  const responseData = {
    status: 200,
    success: true,
    message: "825412.xyz Webhook Gateway Received Successfully",
    gateway: "Cloudflare Edge Worker (825412.xyz)",
    timestamp: new Date().toISOString(),
    method: method,
    target: url.searchParams.get("target") || "default",
    url: request.url,
    client_ip: request.headers.get("cf-connecting-ip") || "127.0.0.1",
    client_country: request.headers.get("cf-ipcountry") || "CN",
    cf_ray: request.headers.get("cf-ray") || "local_dev",
    headers: headers,
    body: body
  };

  return new Response(JSON.stringify(responseData, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
      "Access-Control-Allow-Headers": "*",
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
}
