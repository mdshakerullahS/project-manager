"use client";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/src/components/ui/item";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type DataType = {
  title: string;
  count: number;
};
export default function Page() {
  const { data: session } = useSession();
  const [data, setData] = useState<DataType[]>([]);

  const router = useRouter();
  useEffect(() => {
    if (session?.user.accountType === "Individual")
      router.push("/dashboard/my-tasks");
  }, [session]);

  const getData = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error("Error fetching data");

      const result = await res.json();

      setData(result.data || []);
    } catch (error: any) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="grid grid-cols-3">
      {data.map((d) => (
        <Item variant="outline">
          <ItemContent>
            <ItemTitle>{d.count}</ItemTitle>
            <ItemDescription>{d.title} </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </div>
  );
}
