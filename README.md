# @rbxts/next-router

A Next.js inspired file-based routing system for @rbxts/react.

> **Note:** This package is currently under active development. The API may change significantly between versions and should not be considered stable yet.

## Features

- 📁 File-based routing
- 🧩 Nested layouts
- 🔄 Dynamic routes with parameters
- 🔍 URL search parameters

## Installation

```bash
npm install @rbxts/next-router
```

Make sure you have the peer dependencies installed in your project:

```bash
npm install @rbxts/react @rbxts/react-roblox
```

## Quick Start

### File Structure

Create a folder structure for your routes:

```
src/
└── routes/
    ├── page.tsx       # Home page (/)
    ├── layout.tsx     # Root layout
    ├── about/
    │   └── page.tsx   # About page (/about)
    └── users/
        ├── page.tsx   # Users list page (/users)
        └── [id]/      # Dynamic route
            └── page.tsx # User detail page (/users/:id)
```

### Setting Up

1. Create your route components:

```tsx
// src/routes/page.tsx
import React from "@rbxts/react";

export default function HomePage() {
  return (
    <frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
      <textlabel
        Text="Welcome to the Home Page!"
        Size={UDim2.fromScale(1, 0.5)}
        TextScaled={true}
        BackgroundTransparency={1}
      />
    </frame>
  );
}
```

2. Create layouts (optional):

```tsx
// src/routes/layout.tsx
import React from "@rbxts/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={new Color3(0.9, 0.9, 0.9)}>
      <uipadding PaddingLeft={new UDim(0, 20)} PaddingRight={new UDim(0, 20)} 
                PaddingTop={new UDim(0, 20)} PaddingBottom={new UDim(0, 20)} />
      {children}
    </frame>
  );
}
```

3. Initialize the router in your main app:

```tsx
// src/app.tsx
import React from "@rbxts/react";
import { RouterProvider, RouterView, loadRoutesFromFolder } from "@rbxts/next-router";

// Assuming you have a folder in ReplicatedStorage
const routesFolder = game.GetService("ReplicatedStorage").FindFirstChild("routes")!;

export default function App() {
  // Load routes from your folder structure
  const routeMap = loadRoutesFromFolder(routesFolder);
  
  return (
    <RouterProvider routeMap={routeMap}>
      <RouterView />
    </RouterProvider>
  );
}
```

## API Reference

### Components

#### `<RouterProvider>`

The provider component that makes routing available throughout your app.

```tsx
<RouterProvider routeMap={routeMap}>
  {children}
</RouterProvider>
```

Props:
- `routeMap`: Object containing route definitions
- `children`: React children

#### `<RouterView>`

Renders the current route based on the URL.

```tsx
<RouterView />
```

### Hooks

#### `useRouter()`

Access the router instance to navigate and get current route information.

```tsx
const router = useRouter();

// Navigate to a new route
router.push("/users/123");

// Replace current route
router.replace("/login");

// Access current route
print(router.currentRoute); // e.g., "/users/123"
```

#### `useParams()`

Access route parameters from dynamic routes.

```tsx
// In a component rendered for route "/users/:id"
const params = useParams();
print(params.id); // e.g., "123"
```

#### `useSearchParams()`

Access and modify URL search parameters.

```tsx
const searchParams = useSearchParams();
print(searchParams.get("sort")); // e.g., "asc"
```

### Functions

#### `loadRoutesFromFolder(folder: Instance): PageMap`

Loads routes from a folder structure.

```tsx
const routeMap = loadRoutesFromFolder(routesFolder);
```

## Dynamic Routes

Create dynamic routes by using brackets in folder names:

```
src/routes/users/[id]/page.tsx
```

Then access the parameter using the `useParams` hook:

```tsx
import React from "@rbxts/react";
import { useParams } from "@rbxts/next-router";

export default function UserPage() {
  const params = useParams();
  
  return (
    <frame Size={UDim2.fromScale(1, 1)} BackgroundTransparency={1}>
      <textlabel
        Text={`User ID: ${params.id}`}
        Size={UDim2.fromScale(1, 0.5)}
        TextScaled={true}
        BackgroundTransparency={1}
      />
    </frame>
  );
}
```

## Nested Layouts

Layouts can be nested to create consistent UI across routes:

```
src/routes/
├── layout.tsx         # Applied to all routes
└── dashboard/
    ├── layout.tsx     # Applied to all dashboard routes
    ├── page.tsx       # Dashboard home
    └── settings/
        └── page.tsx   # Dashboard settings
```

Each layout wraps its children:

```tsx
// src/routes/dashboard/layout.tsx
import React from "@rbxts/react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={new Color3(0.8, 0.8, 0.9)}>
      <textlabel
        Text="Dashboard"
        Size={UDim2.new(1, 0, 0, 50)}
        TextScaled={true}
        BackgroundTransparency={1}
      />
      <frame 
        Size={UDim2.new(1, 0, 1, -50)} 
        Position={UDim2.fromOffset(0, 50)}
        BackgroundTransparency={1}
      >
        {children}
      </frame>
    </frame>
  );
}
```

## Navigation

Use the `useRouter` hook to navigate programmatically:

```tsx
import React from "@rbxts/react";
import { useRouter } from "@rbxts/next-router";

export default function Navigation() {
  const router = useRouter();
  
  return (
    <textbutton
      Text="Go to Dashboard"
      Size={UDim2.fromOffset(200, 50)}
      Event={{
        Activated: () => {
          router.push("/dashboard");
        },
      }}
    />
  );
}
```

## License

ISC