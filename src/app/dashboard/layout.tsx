import { Toaster } from "sonner";
import { SidebarProvider } from "@/src/components/ui/sidebar";
import AppSidebar from "@/src/components/appSidebar";
import Header from "@/src/components/header";
import { ProjectsProvider } from "../context/ProjectContext";
import { TasksProvider } from "../context/TaskContext";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ProjectsProvider>
      <TasksProvider>
        <SidebarProvider>
          <AppSidebar />
          <div className="w-full">
            <Header />
            <div className="px-3 py-1">
              {children}
              <Toaster />
            </div>
          </div>
        </SidebarProvider>
      </TasksProvider>
    </ProjectsProvider>
  );
}
