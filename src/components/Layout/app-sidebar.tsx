"use client";

import * as React from "react";
import {
	IconChartBar,
	IconDashboard,
	IconDatabase,
	IconFileWord,
	IconFolder,
	IconListDetails,
	IconReport,
	IconSettings,
} from "@tabler/icons-react";

import { NavMain } from "@/components/Layout/nav-main";
import { NavUser } from "@/components/Layout/nav-user";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
} from "@/components/ui/sidebar";

const data = {
	user: {
		name: "User",
		email: "user@example.com",
		avatar: "/avatars/user.jpg",
	},

	navMain: [
		{
			title: "Boats",
			url: "/dashboard/boats",
			icon: IconDashboard,
		},

		{
			title: "Boxes",
			url: "/dashboard/boxes",
			icon: IconChartBar,
		},
		{
			title: "Handover Confirmation",
			url: "/dashboard/handover-confirmation",
			icon: IconFolder,
		},
		{
			title: "Handover History",
			url: "/dashboard/handover-history",
			icon: IconFolder,
		},
		{
			title: "Revenue Tracking",
			url: "/dashboard/revenue",
			icon: IconChartBar,
		},
		{
			title: "Profile",
			url: "/dashboard/profile",
			icon: IconListDetails,
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "#",
			icon: IconSettings,
		},
	],
	documents: [
		{
			name: "Data Library",
			url: "#",
			icon: IconDatabase,
		},
		{
			name: "Reports",
			url: "#",
			icon: IconReport,
		},
		{
			name: "Word Assistant",
			url: "#",
			icon: IconFileWord,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar collapsible="offcanvas" {...props}>
			<SidebarHeader>
				<span className="text-3xl font-semibold">Selal</span>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
