import { create } from "zustand";

export type UserType = {
  _id: string;
  name: string;
};

type EmployeeStore = {
  employees: UserType[];
  loading: boolean;
  error: string | null;
  getEmployees: () => Promise<void>;
};

const useEmployees = create<EmployeeStore>((set) => ({
  employees: [],
  loading: false,
  error: null,

  getEmployees: async () => {
    try {
      set({ loading: true });

      const res = await fetch("/api/employees");
      if (!res.ok) throw new Error("Failed to fetch employees");

      const data = await res.json();

      set({ employees: data.employees, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useEmployees;
