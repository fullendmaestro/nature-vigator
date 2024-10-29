"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Leaf, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchContentById } from "@/lib/actions/user.actions";

export default function ItemDetailPage() {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await fetchContentById(id);
      setItem(data);
      console.log(data);
    };

    loadData();
  }, [id]);

  if (!item) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6" />
            <span className="font-bold text-xl">NatureNavigator</span>
          </Link>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/explore">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Explore
            </Link>
          </Button>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <img
                src={item.imageUrl}
                alt={item.name}
                width={600}
                height={400}
                className="rounded-lg shadow-md w-[600px] h-[400px]"
              />
            </div>
            <div>
              <h1 className="text-3xl font-bold mb-4">{item.name}</h1>
              <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mb-4">
                {item.type}
              </span>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {item.description}
              </p>
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <ul className="list-disc list-inside space-y-2">
                {JSON.parse(item.details).map((detail, index) => (
                  <li key={index} className="text-gray-600 dark:text-gray-300">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2024 PlantAnimal Wiki. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
