"use client";

import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  LucideIcon,
  Settings,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";

type SidebarItemType = {
  label: string;
  icon: LucideIcon;
};

const sidebarItems: SidebarItemType[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Projects", icon: FolderKanban },
  { label: "My Tasks", icon: CheckSquare },
  { label: "Teams", icon: Users },
  { label: "Employees", icon: User },
  { label: "Settings", icon: Settings },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (status === "loading") return null;
  if (!session) return null;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="h-full justify-between">
          <div className="space-y-6">
            <SidebarGroupLabel className="text-xl font-bold">
              TaskFlow
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {sidebarItems.map((item) => {
                  const href =
                    item.label === "Dashboard"
                      ? "/dashboard"
                      : `/dashboard/${item.label
                          .toLowerCase()
                          .replaceAll(" ", "-")}`;

                  const isActive = pathname === href;

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={href}>
                          <item.icon strokeWidth={isActive ? 2.5 : 2} />
                          <span className="text-base">{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </div>

          <SidebarFooter>
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger className="w-full flex items-center justify-between gap-8 p-2 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-lg cursor-pointer">
                <p>{session.user.name?.split(" ").slice(0, 2).join(" ")}</p>
                {session?.user.image ? (
                  <div className="w-8 h-8 rounded-full overflow-hidden relative">
                    <Image
                      src={`${session.user.image}`}
                      fill
                      sizes="32px"
                      alt="Profile"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <span className="text-xl font-semibold w-8 h-8 rounded-full">
                    {session?.user?.name?.charAt(0)?.toUpperCase() ?? "?"}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onSelect={() => signOut()}>
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
