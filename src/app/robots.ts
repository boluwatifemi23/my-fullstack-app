import { MetadataRoute } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/", "/api/", "/checkout", "/cart", "/profile", "/login", "/signup"],
      },
    ],
    sitemap: `${appUrl}/sitemap.xml`,
  };
}