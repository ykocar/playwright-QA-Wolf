export function getEnvVar(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing env var: ${name}. Put it in .env.local`);
    }
    return value;
}
