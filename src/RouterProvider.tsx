import React, { createContext, useContext, useEffect, useState } from "@rbxts/react";
import { PageMap } from "./RouteLoader";

interface RouterContextType {
	currentRoute: string;
	routePattern: string;
	push: (path: string) => void;
	replace: (path: string) => void;
	routeMap: PageMap;
}

const RouterContext = createContext<RouterContextType>({
	currentRoute: "/",
	routePattern: "",
	push: () => {},
	replace: () => {},
	routeMap: {},
});

export const useRouter = () => useContext(RouterContext);

export const RouterProvider: React.FC<{ children: React.ReactNode; routeMap: PageMap }> = ({ children, routeMap }) => {
	const [currentRoute, setCurrentRoute] = useState("/");
	const [routePattern, setRoutePattern] = useState<string>(currentRoute);

	useEffect(() => {
		const findIndex = string.find(currentRoute, "?")[0];
		const cleanUrl = findIndex ? string.sub(currentRoute, 1, findIndex - 1) : currentRoute;
		const match = matchRoute(cleanUrl, routeMap);
		if (match) {
			const [pattern] = match;
			setRoutePattern(pattern);
		} else {
			setRoutePattern(""); // Route doesn't exist
		}
	}, [currentRoute]);

	const push = (path: string) => setCurrentRoute(path);
	const replaceFn = (path: string) => setCurrentRoute(path);

	return (
		<RouterContext.Provider value={{ routeMap, currentRoute, routePattern, push, replace: replaceFn }}>
			{children}
		</RouterContext.Provider>
	);
};

// Dynamic segment extraction
// router/parseParams.ts
export function parseParams(actualPath: string, routePattern: string): Record<string, string> {
	const params: Record<string, string> = {};

	const pathSegments = actualPath.split("/").filter((s) => s !== "");
	const patternSegments = routePattern.split("/").filter((s) => s !== "");

	if (pathSegments.size() !== patternSegments.size()) {
		return params;
	}

	for (let i = 0; i < patternSegments.size(); i++) {
		const patternSegment = patternSegments[i];
		const pathSegment = pathSegments[i];

		const foundParameters = patternSegment.match("^%[(.-)%]$")[0] as string | undefined;

		if (foundParameters !== undefined) {
			const paramName = foundParameters;
			params[paramName] = pathSegment;
		} else if (patternSegment !== pathSegment) {
			return {}; // No match
		}
	}

	return params;
}

export function matchRoute(path: string, routeMap: PageMap): [string, Record<string, string>] | undefined {
	for (const [pattern, _] of pairs(routeMap)) {
		const params = parseParams(path, pattern as string);

		let keyCount = 0;
		for (const _ of pairs(params)) {
			keyCount++;
		}
		if (keyCount > 0 || pattern === path) {
			return [pattern as string, params];
		}
	}
	return undefined;
}
