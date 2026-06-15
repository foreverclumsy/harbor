const ALLOWED_HOSTS = [
  "api.strem.io",
  "v3-cinemeta.strem.io",
  "opensubtitles-v3.strem.io",
  "opensubtitles.strem.io",
  "opensubtitles.stremio.homes",
  "api.real-debrid.com",
  "api.alldebrid.com",
  "api.torbox.app",
  "debrid-link.com",
  "www.premiumize.me",
];

export async function onRequest(context) {
  const path = context.params.path;

  if (!path || path.length < 2) {
    return new Response("Invalid proxy request", { status: 400 });
  }

  const host = path[0];

  if (!ALLOWED_HOSTS.includes(host)) {
    return new Response("Host not allowed", { status: 403 });
  }

  const targetPath = "/" + path.slice(1).join("/");

  const url = new URL(context.request.url);
  const target = `https://${host}${targetPath}${url.search}`;

  const headers = new Headers(context.request.headers);
  headers.delete("host");

  const response = await fetch(target, {
    method: context.request.method,
    headers,
    body:
      context.request.method === "GET" ||
      context.request.method === "HEAD"
        ? undefined
        : await context.request.arrayBuffer(),
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
}
