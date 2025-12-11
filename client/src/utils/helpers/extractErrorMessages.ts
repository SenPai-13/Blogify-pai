import { AxiosError } from "axios";

export function extractErrorMessages(error: unknown): string {
    const messages: string[] = [];
    const visited = new Set<any>();
    const stack: any[] = [];

    const axiosError = error as AxiosError<any>;
    if (axiosError?.response?.data) {
        stack.push(axiosError.response.data);
    } else if (axiosError?.message) {
        return axiosError.message;
    } else {
        return "An unknown error occurred";
    }

    while (stack.length > 0) {
        const current = stack.pop();

        if (!current || visited.has(current)) continue;
        visited.add(current);

        if (typeof current === "string") {
            if (/<(html|head|body|!DOCTYPE)/i.test(current)) {
                return "Server not responding";
            }
            messages.push(current);
        } else if (Array.isArray(current)) {
            stack.push(...current);
        } else if (typeof current === "object") {
            stack.push(...Object.values(current));
        }
    }

    return messages.length ? messages.join(", ") : "An unknown error occurred";
}