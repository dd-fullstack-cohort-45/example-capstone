import React from "react";

export type LayoutProps = {
	children: React.ReactNode
}


type DefaultParams = { slug?: string };


export type PageProps<T = DefaultParams> = {
	params: T;
	searchParams: { [key: string]: string | string[] | undefined };
};


