import { LoaderFunctionArgs, createCookie, redirect } from "@vercel/remix";

let secret = process.env.COOKIE_SECRET || "default";
if (secret === "default") {
  console.warn(
    "🚨 Переменная среды COOKIE_SECRET не установлена, используется стандартное значение. Приложение небезопасно для публичного использования.",
  );
  secret = "default-secret";
}

const cookie = createCookie("auth", {
  secrets: [secret],
  // 30 days
  maxAge: 30 * 24 * 60 * 60,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});

export async function getAuthFromRequest(request: Request): Promise<string | null> {
  const userId = await cookie.parse(request.headers.get("Cookie"));
  return userId ?? null;
}

export async function setAuthOnResponse<TResponse extends Response>(
  response: TResponse,
  userId: string,
): Promise<TResponse> {
  const header = await cookie.serialize(userId);
  response.headers.append("Set-Cookie", header);
  return response;
}

export async function clearAuth(redirectUrl: string) {
  return redirect(redirectUrl, {
    headers: {
      "Set-Cookie": await cookie.serialize("", {
        maxAge: 0,
      }),
    },
  });
}

export async function requireAuthCookie(request: Request) {
  const userId = await getAuthFromRequest(request);
  if (!userId) {
    throw await clearAuth("/");
  }
  return userId;
}

export async function redirectIfLoggedInLoader({ request }: LoaderFunctionArgs) {
  const userId = await getAuthFromRequest(request);
  if (userId) {
    throw redirect("/");
  }
  return null;
}
