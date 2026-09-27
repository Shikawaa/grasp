const productionAuthEnvKeys = [
    "NEON_AUTH_BASE_URL",
    "NEON_AUTH_COOKIE_SECRET",
    "OWNER_EMAILS",
];

if (process.env.VERCEL_ENV === "production") {
    const missingKeys = productionAuthEnvKeys.filter(
        (key) => !process.env[key]?.trim(),
    );
    if (missingKeys.length > 0) {
        throw new Error(
            `Configuration de production incomplète. Variables serveur manquantes : ${missingKeys.join(", ")}.`,
        );
    }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "X-Frame-Options", value: "DENY" },
                ],
            },
        ];
    },
};

export default nextConfig;
