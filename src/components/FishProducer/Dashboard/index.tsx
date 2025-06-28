"use client";

import { useState } from "react";
import {
	Package,
	Ship,
	DollarSign,
	TrendingUp,
	Activity,
	Eye,
	ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import BoatForm from "../BoatForms/AddBoat";
import RequestBoxesForm from "../RequestBoxesForm";

interface DashboardStats {
	activeBoxes: number;
	pendingBoxes: number;
	totalRevenue: number;
	totalBoats: number;
	activeBoats: number;
	completedRequests: number;
	pendingRequests: number;
}

interface RecentActivity {
	id: string;
	type: "box_request" | "box_handover" | "boat_added" | "payment_received";
	description: string;
	timestamp: string;
	status: "completed" | "pending" | "in_progress";
}

interface PerformanceMetric {
	label: string;
	value: number;
	change: number;
	trend: "up" | "down" | "stable";
}

const mockStats: DashboardStats = {
	activeBoxes: 245,
	pendingBoxes: 32,
	totalRevenue: 45750,
	totalBoats: 8,
	activeBoats: 6,
	completedRequests: 127,
	pendingRequests: 15,
};

const mockActivities: RecentActivity[] = [
	{
		id: "1",
		type: "box_request",
		description: "New box request from Ahmed Hassan - 5 Premium boxes",
		timestamp: "2024-01-18T10:30:00Z",
		status: "pending",
	},
	{
		id: "2",
		type: "payment_received",
		description: "Payment received - EGP 750 from Mohamed Ali",
		timestamp: "2024-01-18T09:15:00Z",
		status: "completed",
	},
	{
		id: "3",
		type: "box_handover",
		description: "Box handover completed - BOX-001 returned by Fatma Omar",
		timestamp: "2024-01-18T08:45:00Z",
		status: "completed",
	},
	{
		id: "4",
		type: "boat_added",
		description: "New boat added to fleet - Sea Explorer",
		timestamp: "2024-01-17T16:20:00Z",
		status: "completed",
	},
	{
		id: "5",
		type: "box_request",
		description: "Express delivery request - 3 Large boxes",
		timestamp: "2024-01-17T14:10:00Z",
		status: "in_progress",
	},
];

const mockPerformance: PerformanceMetric[] = [
	{ label: "Box Utilization", value: 87, change: 5, trend: "up" },
	{ label: "Fleet Efficiency", value: 92, change: -2, trend: "down" },
	{ label: "Revenue Growth", value: 15, change: 8, trend: "up" },
	{ label: "Customer Satisfaction", value: 94, change: 3, trend: "up" },
];

export default function Dashboard() {
	const [isAddBoatModalOpen, setIsAddBoatModalOpen] = useState(false);
	const [isRequstBoxes, setIsRequstBoxes] = useState(false);

	const getActivityIcon = (type: string) => {
		switch (type) {
			case "box_request":
				return <Package className="h-4 w-4" />;
			case "box_handover":
				return <ArrowRight className="h-4 w-4" />;
			case "boat_added":
				return <Ship className="h-4 w-4" />;
			case "payment_received":
				return <DollarSign className="h-4 w-4" />;
			default:
				return <Activity className="h-4 w-4" />;
		}
	};

	const getActivityColor = (type: string) => {
		switch (type) {
			case "box_request":
				return "bg-blue-100 text-blue-600";
			case "box_handover":
				return "bg-green-100 text-green-600";
			case "boat_added":
				return "bg-purple-100 text-purple-600";
			case "payment_received":
				return "bg-emerald-100 text-emerald-600";
			default:
				return "bg-gray-100 text-gray-600";
		}
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800";
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "in_progress":
				return "bg-blue-100 text-blue-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const getTrendIcon = (trend: string, change: number) => {
		if (trend === "up") {
			return <TrendingUp className="h-4 w-4 text-green-600" />;
		}
		return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
	};

	return (
		<div className=" p-6 space-y-8 w-full">
			{/* Header */}
			<div className="space-y-2">
				<h1 className="text-3xl font-bold">Dashboard</h1>
				<p className="text-muted-foreground">
					Welcome back! Here&apos;s an overview of your boat management system.
				</p>
			</div>

			{/* First Section: Key Metrics */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{/* Active & Pending Boxes */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Active Boxes
								</p>
								<p className="text-2xl font-bold text-green-600">
									{mockStats.activeBoxes}
								</p>
								<p className="text-xs text-muted-foreground">
									{mockStats.pendingBoxes} pending
								</p>
							</div>
							<div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
								<Package className="h-6 w-6 text-green-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Total Revenue */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Total Revenue
								</p>
								<p className="text-2xl font-bold">
									EGP {mockStats.totalRevenue.toLocaleString()}
								</p>
								<p className="text-xs text-green-600">+12% this month</p>
							</div>
							<div className="h-12 w-12 rounded-full bg-emerald-100 flex items-center justify-center">
								<DollarSign className="h-6 w-6 text-emerald-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Boats */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Fleet Size
								</p>
								<p className="text-2xl font-bold">{mockStats.totalBoats}</p>
								<p className="text-xs text-muted-foreground">
									{mockStats.activeBoats} active
								</p>
							</div>
							<div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
								<Ship className="h-6 w-6 text-blue-600" />
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Requests Status */}
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm font-medium text-muted-foreground">
									Requests
								</p>
								<p className="text-2xl font-bold">
									{mockStats.completedRequests}
								</p>
								<p className="text-xs text-muted-foreground">
									{mockStats.pendingRequests} pending
								</p>
							</div>
							<div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
								<Activity className="h-6 w-6 text-purple-600" />
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Second Section: Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
					<CardDescription>
						Frequently used actions for managing your fleet and operations
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
						{/* Add Boat */}
						<Dialog
							open={isAddBoatModalOpen}
							onOpenChange={setIsAddBoatModalOpen}
						>
							<DialogTrigger asChild>
								<Button variant="outline" className="h-24 flex-col gap-2 ">
									<Ship className="h-6 w-6" />
									<span>Add New Boat</span>
								</Button>
							</DialogTrigger>
							<DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
								<BoatForm />
							</DialogContent>
						</Dialog>

						{/* Request Boxes */}
						<Dialog open={isRequstBoxes} onOpenChange={setIsRequstBoxes}>
							<DialogTrigger asChild>
								<Button variant="outline" className="h-24 flex-col gap-2 ">
									<Package className="h-6 w-6" />
									<span>Request Boxes</span>
								</Button>
							</DialogTrigger>
							<DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
								<RequestBoxesForm />
							</DialogContent>
						</Dialog>

						{/* Confirm Boxes */}
						<Button variant="outline" className="h-24 flex-col gap-2">
							<ArrowRight className="h-6 w-6" />
							<span>Confirm Handover</span>
						</Button>
					</div>
				</CardContent>
			</Card>

			{/* Third Section: Recent Activities & Performance */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				{/* Recent Activities */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Activity className="h-5 w-5" />
							Recent Activities
						</CardTitle>
						<CardDescription>
							Latest updates and activities in your system
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{mockActivities.map((activity) => (
								<div
									key={activity.id}
									className="flex items-start gap-4 p-3 rounded-lg border"
								>
									<div
										className={`p-2 rounded-full ${getActivityColor(
											activity.type
										)}`}
									>
										{getActivityIcon(activity.type)}
									</div>
									<div className="flex-1 space-y-1">
										<p className="text-sm font-medium">
											{activity.description}
										</p>
										<div className="flex items-center gap-2">
											<p className="text-xs text-muted-foreground">
												{new Date(activity.timestamp).toLocaleString()}
											</p>
											<Badge
												className={getStatusColor(activity.status)}
												variant="secondary"
											>
												{activity.status.replace("_", " ")}
											</Badge>
										</div>
									</div>
								</div>
							))}
						</div>
						<div className="mt-4 pt-4 border-t">
							<Button variant="outline" className="w-full">
								<Eye className="h-4 w-4 mr-2" />
								View All Activities
							</Button>
						</div>
					</CardContent>
				</Card>

				{/* Performance Overview */}
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<TrendingUp className="h-5 w-5" />
							Performance Overview
						</CardTitle>
						<CardDescription>
							Key performance indicators and trends
						</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-6">
							{mockPerformance.map((metric, index) => (
								<div key={index} className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">{metric.label}</span>
										<div className="flex items-center gap-2">
											{getTrendIcon(metric.trend, metric.change)}
											<span className="text-sm font-bold">{metric.value}%</span>
										</div>
									</div>
									<Progress value={metric.value} className="h-2" />
									<div className="flex justify-between items-center">
										<span className="text-xs text-muted-foreground">
											Current performance
										</span>
										<span
											className={`text-xs font-medium ${
												metric.change > 0 ? "text-green-600" : "text-red-600"
											}`}
										>
											{metric.change > 0 ? "+" : ""}
											{metric.change}% vs last period
										</span>
									</div>
								</div>
							))}
						</div>
						<div className="mt-6 pt-4 border-t">
							<Button variant="outline" className="w-full">
								<TrendingUp className="h-4 w-4 mr-2" />
								View Detailed Analytics
							</Button>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Additional Quick Stats */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<Card>
					<CardContent className="pt-6">
						<div className="text-center space-y-2">
							<div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
								<Package className="h-8 w-8 text-blue-600" />
							</div>
							<h3 className="font-semibold">Box Utilization</h3>
							<p className="text-2xl font-bold text-blue-600">87%</p>
							<p className="text-sm text-muted-foreground">
								Average across all boats
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="text-center space-y-2">
							<div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
								<DollarSign className="h-8 w-8 text-green-600" />
							</div>
							<h3 className="font-semibold">Monthly Revenue</h3>
							<p className="text-2xl font-bold text-green-600">EGP 12,450</p>
							<p className="text-sm text-muted-foreground">
								This month's earnings
							</p>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="text-center space-y-2">
							<div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto">
								<Ship className="h-8 w-8 text-purple-600" />
							</div>
							<h3 className="font-semibold">Fleet Efficiency</h3>
							<p className="text-2xl font-bold text-purple-600">92%</p>
							<p className="text-sm text-muted-foreground">
								Operational efficiency
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
