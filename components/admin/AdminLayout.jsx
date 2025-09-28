"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { LayoutDashboard, Package, Users, ShoppingCart, Menu, Home } from "lucide-react"

const navigation = [
    {
        name: "Tableau de bord",
        href: "/delta",
        icon: LayoutDashboard,
    },
    {
        name: "Catégories",
        href: "/delta/categories",
        icon: Users,
    },
    {
        name: "Produits",
        href: "/delta/products",
        icon: Package,
    },
    {
        name: "Commandes",
        href: "/delta/orders",
        icon: ShoppingCart,
    },
]

export default function AdminLayout({ children }) {
    const router = useRouter()
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const Sidebar = ({ className }) => (
        <div className={cn("flex flex-col h-full", className)}>
            <div className="flex items-center gap-2 px-6 py-4 border-b">
                <Package className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg">Admin Delta</span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                {navigation.map((item) => {
                    const isActive = router.pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                            )}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <item.icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            <div className="px-4 py-4 border-t">
                <Link
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                    <Home className="h-4 w-4" />
                    Retour au site
                </Link>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-card">
                    <Sidebar />
                </div>
            </div>

            {/* Mobile Sidebar */}
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetContent side="left" className="p-0 w-72">
                    <Sidebar />
                </SheetContent>
            </Sheet>

            {/* Main Content */}
            <div className="lg:pl-72">
                {/* Mobile Header */}
                <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b bg-card px-4 shadow-sm lg:hidden">
                    <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="sm">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Ouvrir le menu</span>
                            </Button>
                        </SheetTrigger>
                    </Sheet>

                    <div className="flex items-center gap-2">
                        <Package className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Admin Delta</span>
                    </div>
                </div>

                {/* Page Content */}
                <main className="py-6 px-4 lg:px-8">{children}</main>
            </div>
        </div>
    )
}