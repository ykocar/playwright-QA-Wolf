let faker;

async function initializeFaker() {
    if (!faker) {
        try {
            const { faker: fakerInstance } = await import("@faker-js/faker");
            faker = fakerInstance;
        } catch (error) {
            console.error("Error importing faker:", error);
            throw error;
        }
    }
}

export async function createRandomCredentials() {
    await initializeFaker();

    const username = faker.internet.username()
        .replace(/[^a-zA-Z0-9]/g, "")
        .slice(0, 12) || `user${Date.now()}`;

    const password = faker.internet.password({ length: 14 });

    return { username, password };
}