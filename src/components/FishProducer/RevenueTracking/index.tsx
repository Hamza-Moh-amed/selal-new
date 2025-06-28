"use client";

import { useState } from "react";
import {
  Calendar,
  TrendingUp,
  DollarSign,
  CreditCard,
  Download,
  Filter,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface Transaction {
  id: string;
  type: "earning" | "fee" | "deposit" | "refund";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  customerName: string;
  boxId?: string;
  paymentMethod: "card" | "cash" | "bank_transfer";
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-001",
    type: "earning",
    description: "Box rental - Premium Box × 5",
    amount: 375.0,
    date: "2024-01-18",
    status: "completed",
    customerName: "Ahmed Hassan",
    boxId: "BOX-001",
    paymentMethod: "card",
  },
  {
    id: "TXN-002",
    type: "deposit",
    description: "Box deposit - Standard Box × 10",
    amount: 500.0,
    date: "2024-01-17",
    status: "completed",
    customerName: "Mohamed Ali",
    boxId: "BOX-002",
    paymentMethod: "bank_transfer",
  },
  {
    id: "TXN-003",
    type: "fee",
    description: "Platform service fee",
    amount: -25.0,
    date: "2024-01-17",
    status: "completed",
    customerName: "System",
    paymentMethod: "card",
  },
  {
    id: "TXN-004",
    type: "earning",
    description: "Express delivery surcharge",
    amount: 150.0,
    date: "2024-01-16",
    status: "completed",
    customerName: "Fatma Omar",
    boxId: "BOX-003",
    paymentMethod: "card",
  },
  {
    id: "TXN-005",
    type: "refund",
    description: "Box deposit refund",
    amount: -150.0,
    date: "2024-01-15",
    status: "completed",
    customerName: "Sara Ahmed",
    boxId: "BOX-005",
    paymentMethod: "bank_transfer",
  },
  {
    id: "TXN-006",
    type: "earning",
    description: "Box rental - Large Box × 3",
    amount: 300.0,
    date: "2024-01-14",
    status: "pending",
    customerName: "Omar Mahmoud",
    boxId: "BOX-004",
    paymentMethod: "card",
  },
  {
    id: "TXN-007",
    type: "deposit",
    description: "Box deposit - Premium Box × 2",
    amount: 100.0,
    date: "2024-01-13",
    status: "completed",
    customerName: "Layla Hassan",
    boxId: "BOX-006",
    paymentMethod: "cash",
  },
  {
    id: "TXN-008",
    type: "fee",
    description: "Payment processing fee",
    amount: -15.0,
    date: "2024-01-12",
    status: "completed",
    customerName: "System",
    paymentMethod: "card",
  },
];

export default function RevenueTracking() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [dateRange, setDateRange] = useState("7days");
  const [transactionType, setTransactionType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const getTransactionColor = (type: string) => {
    switch (type) {
      case "earning":
        return "bg-green-100 text-green-800";
      case "deposit":
        return "bg-blue-100 text-blue-800";
      case "fee":
        return "bg-red-100 text-red-800";
      case "refund":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case "card":
        return <CreditCard className="h-4 w-4" />;
      case "cash":
        return <DollarSign className="h-4 w-4" />;
      case "bank_transfer":
        return (
          <div className="h-4 w-4 rounded bg-blue-500 flex items-center justify-center text-white text-xs">
            B
          </div>
        );
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  // Calculate summary statistics
  const totalEarnings = transactions
    .filter((t) => t.type === "earning" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFees = Math.abs(
    transactions
      .filter((t) => t.type === "fee" && t.status === "completed")
      .reduce((sum, t) => sum + t.amount, 0)
  );

  const totalDeposits = transactions
    .filter((t) => t.type === "deposit" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = transactions
    .filter((t) => t.status === "pending")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const netRevenue = totalEarnings - totalFees;

  // Filter transactions
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.customerName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      transactionType === "all" || transaction.type === transactionType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="w-full mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Revenue Tracking</h1>
          <p className="text-muted-foreground">
            Monitor your earnings, fees, and transaction history
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Earnings
                </p>
                <p className="text-2xl font-bold text-green-600">
                  EGP {totalEarnings.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  +12% from last period
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Net Revenue
                </p>
                <p className="text-2xl font-bold">
                  EGP {netRevenue.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">After fees</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Deposits
                </p>
                <p className="text-2xl font-bold text-blue-600">
                  EGP {totalDeposits.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">Held deposits</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="text-blue-600 font-bold text-sm">D</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Pending
                </p>
                <p className="text-2xl font-bold text-yellow-600">
                  EGP {pendingAmount.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">Processing</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Overview</CardTitle>
          <CardDescription>
            Daily revenue for the selected period
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Revenue chart would be displayed here
              </p>
              <p className="text-sm text-muted-foreground">
                Integration with charting library needed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <Select value={transactionType} onValueChange={setTransactionType}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="earning">Earnings</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="fee">Fees</SelectItem>
                <SelectItem value="refund">Refunds</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            Detailed list of all your transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getPaymentMethodIcon(transaction.paymentMethod)}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{transaction.description}</p>
                      <Badge className={getTransactionColor(transaction.type)}>
                        {transaction.type.charAt(0).toUpperCase() +
                          transaction.type.slice(1)}
                      </Badge>
                      <Badge className={getStatusColor(transaction.status)}>
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{transaction.id}</span>
                      <span>{transaction.customerName}</span>
                      <span>
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                      {transaction.boxId && <span>{transaction.boxId}</span>}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-lg font-bold ${
                      transaction.amount >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.amount >= 0 ? "+" : ""}EGP{" "}
                    {transaction.amount.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {transaction.paymentMethod.replace("_", " ")}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No transactions found
              </h3>
              <p className="text-muted-foreground">
                {searchTerm || transactionType !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "No transactions available for the selected period"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Fee Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Fee Breakdown</CardTitle>
          <CardDescription>Understanding your fees and charges</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Platform Service Fee</p>
                <p className="text-sm text-muted-foreground">
                  5% of total earnings
                </p>
              </div>
              <p className="font-bold text-red-600">
                EGP {(totalEarnings * 0.05).toFixed(2)}
              </p>
            </div>

            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Payment Processing Fee</p>
                <p className="text-sm text-muted-foreground">
                  2.9% + EGP 2.50 per transaction
                </p>
              </div>
              <p className="font-bold text-red-600">
                EGP {(totalFees - totalEarnings * 0.05).toFixed(2)}
              </p>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <p className="font-bold">Total Fees</p>
              <p className="font-bold text-red-600">
                EGP {totalFees.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
