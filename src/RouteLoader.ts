// router/RouteLoader.ts
import React from "@rbxts/react";

export interface PageMap {
	[path: string]: PageEntry;
}

export interface PageEntry {
	component: () => React.Element;
	layouts: (({ children }: { children: React.Element }) => React.Element)[];
}

function resolvePathFromInstance(instance: Instance, basePath: string): string {
	const name = instance.Name;

	// Remove trailing slash if any (for cleanliness)
	const cleanBase = basePath.gsub("//", "/")[0];

	if (name === "page") {
		// If basePath is "", then this is root
		return cleanBase === "" ? "/" : cleanBase;
	}

	if (name.match("^%[.+%]$")) {
		const param = name.sub(2, -2); // Strip [ ]
		return `${cleanBase}/${":" + param}`;
	}

	return `${cleanBase}/${name}`;
}

export function loadRoutesFromFolder(folder: Instance): PageMap {
	const map: PageMap = {};

	const walk = (
		parent: Instance,
		basePath = "",
		layouts: (({ children }: { children: React.Element }) => React.Element)[] = [],
	) => {
		let nextLayouts = [...layouts];

		for (const child of parent.GetChildren()) {
			if (child.IsA("ModuleScript") && child.Name === "layout") {
				const layoutModule = require(child) as {
					default?: ({ children }: { children: React.Element }) => React.Element;
				};
				if (layoutModule.default) {
					nextLayouts.push(layoutModule.default);
				}
			}
		}

		for (const child of parent.GetChildren()) {
			if (child.IsA("ModuleScript") && child.Name !== "layout") {
				const routePath = resolvePathFromInstance(child, basePath);
				const component = (require(child) as { default?: () => React.Element }).default!;
				map[routePath] = {
					component,
					layouts: nextLayouts,
				};
			} else if (child.IsA("Folder")) {
				const newPath = `${basePath}/${child.Name}`;
				walk(child, newPath, nextLayouts);
			}
		}
	};

	walk(folder);
	return map;
}
