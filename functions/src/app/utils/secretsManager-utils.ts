import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

const client = new SecretManagerServiceClient();

export async function getEnv(name: string): Promise<string> {
    const secretName = `projects/${"v2-reconhecimento-alest"}/secrets/${name}/versions/${1}`
    const [secret] = await client.accessSecretVersion({
        name: secretName
    });

    return secret.payload?.data?.toString() || "";
}
