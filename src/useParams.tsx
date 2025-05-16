import { useRouter } from "./RouterProvider";
import { parseParams } from "./RouterProvider";

export function useParams(): Record<string, string> {
	const { currentRoute, routePattern } = useRouter();

	const findIndex = string.find(currentRoute, "?")[0];
	const cleanUrl = findIndex ? string.sub(currentRoute, 1, findIndex - 1) : currentRoute;

	return parseParams(cleanUrl, routePattern);
}
