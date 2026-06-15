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

const ALLOWED_SUFFIXES = [
  ".elfhosted.com",
  ".strem.fun",
  ".strem.io",
  ".stremio.homes",
  ".debridio.com",
  ".workers.dev",
  ".fly.dev",
  ".onrender.com",
  ".vercel.app",
  ".netlify.app",
  ".railway.app",
  ".deno.dev",
  ".baby-beamup.club",
];

export async function onRequest(context) {
  const path = context.params.path;

  if (!path || path.length < 2) {
    return new Response("Invalid proxy request", { status: 400 });
  }

  const host = path[0];

  console.log(`Proxy request: ${host}`);

  const allowed =
    ALLOWED_HOSTS.includes(host) ||
    ALLOWED_SUFFIXES.some((suffix) => host.endsWith(suffix));

  if (!allowed) {
    console.log(`Blocked proxy host: ${host}`);

    return new Response(`Host not allowed: ${host}`, {
      status: 403,
    });
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
