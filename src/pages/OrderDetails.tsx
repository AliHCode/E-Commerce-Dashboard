import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "@/contexts/DataContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Printer, Download, Mail, MapPin, Calendar, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";

export function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useData();
  const order = orders.find(o => o.id === id);

  if (!order) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">Order not found</h2>
        <button
          onClick={() => navigate("/orders")}
          className="mt-4 text-primary-600 hover:underline"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/orders")}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
              Order #{order.id}
              <span className={cn(
                "text-sm px-2.5 py-0.5 rounded-full font-medium border",
                order.status === "Completed" && "bg-green-50 text-green-700 border-green-200",
                order.status === "Processing" && "bg-blue-50 text-blue-700 border-blue-200",
                order.status === "Pending" && "bg-yellow-50 text-yellow-700 border-yellow-200",
                order.status === "Cancelled" && "bg-red-50 text-red-700 border-red-200",
              )}>
                {order.status}
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1">Placed on {order.date}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="h-9 px-3 rounded-md bg-white border border-gray-200 text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button className="h-9 px-3 rounded-md bg-white border border-gray-200 text-gray-700 text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Order Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2].map((item) => (
                  <div key={item} className="flex items-start gap-4 pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                      <img
                        src={`https://picsum.photos/seed/${item}/200/200`}
                        alt="Product"
                        className="w-full h-full object-cover rounded-lg"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900">Premium Mechanical Keyboard</h3>
                      <p className="text-sm text-gray-500 mt-1">Variant: Space Gray / Red Switches</p>
                      <div className="mt-2 flex items-center gap-4 text-sm">
                        <span className="text-gray-500">Qty: 1</span>
                        <span className="font-medium text-gray-900">$129.99</span>
                      </div>
                    </div>
                    <div className="text-right font-medium text-gray-900">$129.99</div>
                  </div>
                ))}
              </div>
              <div className="mt-8 space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal</span>
                  <span>$259.98</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Shipping</span>
                  <span>$15.00</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Tax</span>
                  <span>$24.00</span>
                </div>
                <div className="flex justify-between text-base font-bold text-gray-900 pt-3 border-t border-gray-100">
                  <span>Total</span>
                  <span>{order.amount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pl-6 border-l-2 border-gray-100 space-y-8">
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-green-500 ring-4 ring-white"></div>
                  <p className="text-sm font-medium text-gray-900">Order Delivered</p>
                  <p className="text-xs text-gray-500 mt-0.5">Oct 24, 2023 at 2:30 PM</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-primary-500 ring-4 ring-white"></div>
                  <p className="text-sm font-medium text-gray-900">Out for Delivery</p>
                  <p className="text-xs text-gray-500 mt-0.5">Oct 24, 2023 at 8:00 AM</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-gray-300 ring-4 ring-white"></div>
                  <p className="text-sm font-medium text-gray-900">Order Placed</p>
                  <p className="text-xs text-gray-500 mt-0.5">{order.date}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <span className="font-medium text-sm">AM</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                  <p className="text-xs text-gray-500">12 previous orders</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-4 h-4 text-gray-400" />
                <a href={`mailto:${order.email}`} className="hover:text-primary-600">{order.email}</a>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span>New York, USA</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <address className="text-sm text-gray-600 not-italic leading-relaxed">
                {order.customer}<br />
                123 Main Street, Apt 4B<br />
                New York, NY 10001<br />
                United States
              </address>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="w-8 h-5 bg-gray-100 rounded border border-gray-200 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-gray-500" />
                </div>
                <span>Visa ending in 4242</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
