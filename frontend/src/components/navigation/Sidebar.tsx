'use client'


import { Sidebar } from "flowbite-react";
import {FC, useState} from "react";
import { BiBuoy } from "react-icons/bi";
import {
	HiArrowSmRight,
	HiChartPie,
	HiInbox, HiMenuAlt1,
	HiShoppingBag,
	HiTable,
	HiUser,
	HiViewBoards, HiX,
} from "react-icons/hi";
import { twMerge } from "tailwind-merge";


export function NavSidebar () {

	const  [isSidebarCollapsed, setSidebarCollapsed] = useState(true)

	const SidebarCollapseIcon = () => {
		const onClick = () => {
			setSidebarCollapsed(!isSidebarCollapsed)
		}
		if (isSidebarCollapsed) {
			return <Sidebar.Item onClick={onClick} icon={ HiMenuAlt1 }  >
				expand
			</Sidebar.Item>
		} else {
			return <Sidebar.Item onClick={onClick} icon={HiX}> collapse </Sidebar.Item>
		}
	}
	return (
		<Sidebar
			aria-label="Sidebar with multi-level dropdown example"
			collapsed={isSidebarCollapsed}
			id="sidebar"
			className={twMerge(
				"fixed inset-y-0 left-0 z-20 flex h-full shrink-0 flex-col border-r border-gray-200 duration-75 dark:border-gray-700 lg:flex",
				isSidebarCollapsed && "hidden w-16",
			)}
		>
			<Sidebar.Items>
				<Sidebar.ItemGroup>
					<SidebarCollapseIcon />
					<Sidebar.Item href="#" icon={HiChartPie}>
						Dashboard
					</Sidebar.Item>
					<Sidebar.Item href="#" icon={HiViewBoards}>
						Kanban
					</Sidebar.Item>
					<Sidebar.Item href="#" icon={HiInbox}>
						Inbox
					</Sidebar.Item>
					<Sidebar.Item href="#" icon={HiUser}>
						Users
					</Sidebar.Item>
					<Sidebar.Item href="#" icon={HiShoppingBag}>
						Products
					</Sidebar.Item>
					<Sidebar.Item href="#" icon={HiArrowSmRight}>
						Sign In
					</Sidebar.Item>
					<Sidebar.Item href="#" icon={HiTable}>
						Sign Up
					</Sidebar.Item>
				</Sidebar.ItemGroup>
				<Sidebar.ItemGroup>
					<Sidebar.Item href="#" icon={HiChartPie}>
						Upgrade to Pro
					</Sidebar.Item>
					<Sidebar.Item href="#" icon={HiViewBoards}>
						Documentation
					</Sidebar.Item>
					<Sidebar.Item href="#" icon={BiBuoy}>
						Help
					</Sidebar.Item>
				</Sidebar.ItemGroup>
			</Sidebar.Items>
		</Sidebar>
	);
};