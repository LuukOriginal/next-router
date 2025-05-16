// router/useSearchParams.ts
import { useRouter } from "./RouterProvider";

export function useSearchParams(): Record<string, string> {
	const { currentRoute } = useRouter();

	const queryIndex = currentRoute.find("?")[0];
	if (!queryIndex) return {};

	const queryString = currentRoute.sub(queryIndex + 1);
	const params: Record<string, string> = {};

	for (const pair of queryString.split("&")) {
		const [key, value] = pair.split("=");
		if (key && value) {
			params[key] = value;
		}
	}

	return params;
}
