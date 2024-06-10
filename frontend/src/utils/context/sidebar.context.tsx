"use client";

/**
 * @author @tulup-conner https://github.com/tulup-conner
 * @description Sidebar context to manage the state of the sidebar to help with the sidebar collapse and expand including mobile tap events
 * @documentation https://github.com/tulupinc/flowbite-next-starter/blob/main/context/SidebarContext.tsx
 */



import {FC, PropsWithChildren} from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface SidebarContextProps {
	isCollapsed: boolean;
	setCollapsed: (isOpen: boolean) => void;
}

const SidebarContext = createContext<SidebarContextProps>(
	{} as SidebarContextProps,
);

export const SidebarProvider: FC<PropsWithChildren> = function ({ children }) {

	const [isCollapsed, setCollapsed] = useState(true);
	const [location, setLocation] = useState("");

	useEffect(() => {
	setLocation(isBrowser() ? window.location.pathname : "/");


	}, []);

	// Close Sidebar on page change
	useEffect(() => {
			setCollapsed(true);
	}, [location]);

	// Close Sidebar on mobile tap inside main content
	useEffect(() => {
		function handleMobileTapInsideMain(event: MouseEvent) {
			const main = document.querySelector("#main-content");
			const isClickInsideMain = main?.contains(event.target as Node);

			if (isSmallScreen() && isClickInsideMain) {
				setCollapsed(true);
			}
		}

		document.addEventListener("mousedown", handleMobileTapInsideMain);

		return () => {
			document.removeEventListener("mousedown", handleMobileTapInsideMain);
		};
	}, []);

	// Update local storage when collapsed state changed
	useEffect(() => {
		localStorage.setItem("isSidebarCollapsed", isCollapsed ? "true" : "false");
	}, [isCollapsed]);

	return (
		<SidebarContext.Provider
			value={{
				isCollapsed,
				setCollapsed,
			}}
		>
			{children}
		</SidebarContext.Provider>
	);
};

export function useSidebarContext(): SidebarContextProps {
	const context = useContext(SidebarContext);

	if (typeof context === "undefined") {
		throw new Error(
			"useSidebarContext should be used within the SidebarContext provider!",
		);
	}

	return context;
}

function isBrowser(): boolean {
	return typeof window !== "undefined";
}


export function isSmallScreen(): boolean {
	return isBrowser() && window.innerWidth < 768;
}