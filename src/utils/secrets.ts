import 'server-only';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
    region: "eu-central-1",
});

let configCache: Record<string, any> | null = null;
let cacheExpiry = 0;
let loadingPromise: Promise<Record<string, any>> | null = null;
const CACHE_DURATION = 5 * 60 * 1000;

// Function to validate that environment variables are actually set
function validateEnvironmentVariables(): boolean {
    const requiredVars = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'KEYCLOAK_CLIENT_ID', 'KEYCLOAK_CLIENT_SECRET', 'KEYCLOAK_ISSUER'];
    const missing = requiredVars.filter(key => !process.env[key]);
    
    if (missing.length > 0) {
        console.warn(`[SECRETS] Missing environment variables: ${missing.join(', ')}`);
        return false;
    }
    return true;
}

export async function getConfig(): Promise<Record<string, any>> {
    const isProduction = process.env.NODE_ENV === 'production';
    
    // In production, always validate environment variables first
    if (isProduction && configCache && Date.now() < cacheExpiry) {
        // Double-check that environment variables are still set (pod restart detection)
        if (validateEnvironmentVariables()) {
            console.log('[SECRETS] Using cached configuration');
            return configCache;
        } else {
            console.warn('[SECRETS] Environment variables lost (possible pod restart), invalidating cache');
            configCache = null;
            cacheExpiry = 0;
        }
    }
    
    // If already loading, wait for the existing promise
    if (loadingPromise) {
        console.log('[SECRETS] Configuration loading already in progress, waiting...');
        return loadingPromise;
    }

    if (!isProduction) {
        // In development, return environment variables from .env.local
        const devConfig = {
            InvestBaseUrl: process.env.INVEST_BASE_URL || "",
            FxBaseUrl: process.env.FX_BASE_URL || "",
            NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",
            NEXTAUTH_URL: process.env.NEXTAUTH_URL || "",
            KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID || "",
            KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET || "",
            KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER || "",
        };
        configCache = devConfig;
        cacheExpiry = Date.now() + CACHE_DURATION;
        console.log('[SECRETS] Using development configuration');
        return devConfig;
    }

    // Production - create the loading promise
    loadingPromise = (async () => {
        try {
            // Production - load from AWS Secrets Manager with retry logic
            let lastError: Error | null = null;
            const maxRetries = 3;
            
            // Check if AWS credentials are available
            const hasAWSCredentials = !!(
                process.env.AWS_ACCESS_KEY_ID || 
                process.env.AWS_PROFILE || 
                process.env.AWS_ROLE_ARN ||
                process.env.AWS_WEB_IDENTITY_TOKEN_FILE ||
                process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI ||
                process.env.AWS_CONTAINER_CREDENTIALS_FULL_URI
            );
            
            if (!hasAWSCredentials) {
                console.warn('[SECRETS] No explicit AWS credentials detected. Relying on IAM role or instance profile.');
            }
            
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    console.log(`[SECRETS] Attempting to load secrets (attempt ${attempt}/${maxRetries})...`);
                    
                    const command = new GetSecretValueCommand({
                        SecretId: "rbal-investment-web-secret-cm",
                    });

                    const response = await client.send(command);

                    if (!response.SecretString) {
                        throw new Error('Empty secret response from AWS Secrets Manager');
                    }

                    const config = JSON.parse(response.SecretString);

                    // Validate required secrets are present
                    const requiredSecrets = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'KEYCLOAK_CLIENT_ID', 'KEYCLOAK_CLIENT_SECRET', 'KEYCLOAK_ISSUER'];
                    const missingSecrets = requiredSecrets.filter(key => !config[key]);
                    
                    if (missingSecrets.length > 0) {
                        throw new Error(`Missing required secrets in AWS response: ${missingSecrets.join(', ')}`);
                    }

                    // Set environment variables
                    process.env.NEXTAUTH_SECRET = config.NEXTAUTH_SECRET;
                    process.env.NEXTAUTH_URL = config.NEXTAUTH_URL;
                    process.env.KEYCLOAK_CLIENT_ID = config.KEYCLOAK_CLIENT_ID;
                    process.env.KEYCLOAK_CLIENT_SECRET = config.KEYCLOAK_CLIENT_SECRET;
                    process.env.KEYCLOAK_ISSUER = config.KEYCLOAK_ISSUER;
                    
                    configCache = config;
                    cacheExpiry = Date.now() + CACHE_DURATION;

                    console.log('[SECRETS] Successfully loaded and cached secrets from AWS');
                    return config;
                    
                } catch (error) {
                    lastError = error instanceof Error ? error : new Error(String(error));
                    console.error(`[SECRETS] Attempt ${attempt} failed:`, lastError.message);
                    
                    if (attempt < maxRetries) {
                        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
                        console.log(`[SECRETS] Retrying in ${delay}ms...`);
                        await new Promise(resolve => setTimeout(resolve, delay));
                    }
                }
            }
            
            // All attempts failed
            console.error('[SECRETS] All attempts to load secrets failed');
            throw new Error(`Unable to load configuration in production environment after ${maxRetries} attempts. Last error: ${lastError?.message}`);
            
        } finally {
            // Clear the loading promise when done (success or failure)
            loadingPromise = null;
        }
    })();
    
    return loadingPromise;
}

export async function getConfigValue(key: string): Promise<string | undefined> {
    const config = await getConfig();
    return config[key];
}

// Helper functions for specific configurations
export async function getKeycloakConfig() {
    const config = await getConfig();
    return {
        clientId: config.KEYCLOAK_CLIENT_ID,
        clientSecret: config.KEYCLOAK_CLIENT_SECRET,
        issuer: config.KEYCLOAK_ISSUER,
    };
}

export async function getNextAuthConfig() {
    const config = await getConfig();
    return {
        secret: config.NEXTAUTH_SECRET,
        url: config.NEXTAUTH_URL,
    };
}

export async function initializeSecrets() {
    try {
        await getConfig(); // This will load secrets and set environment variables
        console.log("Secrets initialized successfully");
        return Promise.resolve();
    } catch (error) {
        console.error("Failed to initialize secrets:", error);
        throw error;
    }
}