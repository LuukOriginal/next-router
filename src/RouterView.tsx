// router/RouterView.tsx
import React from "@rbxts/react";
import { useRouter } from "./RouterProvider";

const NotFound = () => {
	const router = useRouter();

	return (
		<frame Size={UDim2.fromScale(1, 1)} BackgroundColor3={new Color3(1, 0.35, 0.35)}>
			<textlabel
				Text="404: Not Found"
				Size={UDim2.fromScale(1, 0.5)}
				TextScaled={true}
				BackgroundTransparency={1}
			/>
			<textbutton
				key="TextButton"
				TextWrapped={true}
				BorderSizePixel={0}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				BackgroundTransparency={0.5}
				FontFace={
					new Font(
						"rbxasset://fonts/families/SourceSansPro.json",
						Enum.FontWeight.Regular,
						Enum.FontStyle.Normal,
					)
				}
				Text={"Go back to home"}
				TextScaled={true}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				AnchorPoint={new Vector2(0.5, 1)}
				Position={UDim2.fromScale(0.5, 0.75)}
				TextSize={14}
				Size={UDim2.fromOffset(200, 50)}
				Event={{
					Activated: () => {
						router.replace(`/`);
					},
				}}
			>
				<uicorner CornerRadius={new UDim(0, 10)} />
			</textbutton>
		</frame>
	);
};

export const RouterView = () => {
	const { routeMap, routePattern } = useRouter();

	const entry = routeMap[routePattern];
	if (!entry) return <NotFound />;

	let element = entry.component();

	for (let i = entry.layouts.size() - 1; i >= 0; i--) {
		const Layout = entry.layouts[i];
		element = <Layout>{element}</Layout>;
	}

	return element;
};
