"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Camera, Leaf, ScanSearch, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchContents } from "@/lib/actions/user.actions";
import Profile from "./profile";

// Simulated search results with more details
const simulatedResults = [
  {
    id: 1,
    type: "plant",
    name: "Oak Tree",
    description:
      "A large deciduous tree known for its strong wood and distinctive leaves.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 2,
    type: "animal",
    name: "Red Fox",
    description:
      "A small omnivorous mammal known for its reddish-orange fur and bushy tail.",
    image: "/placeholder.svg?height=200&width=200",
  },
  {
    id: 3,
    type: "plant",
    name: "Sunflower",
    description:
      "A tall annual plant with large yellow flowers and edible seeds.",
    image: "/placeholder.svg?height=200&width=200",
  },
];

export default function ExplorePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
  };

  useEffect(() => {
    const loadContents = async () => {
      const contents = await fetchContents();
      console.log(contents);
      setResults(contents);
    };

    loadContents();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6" />
            <span className="font-bold text-xl">NatureNavigator</span>
          </Link>
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search plants and animals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full"
                // onClick={() => setIsImageUploadOpen(true)}
              >
                <ScanSearch className="h-4 w-4" />
                <span className="sr-only">Visual search</span>
              </Button>
            </div>
          </form>
          <nav>
            <Button variant="ghost" asChild>
              <Link href="/">Home</Link>
            </Button>
          </nav>
          <Profile />
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">
            Explore Plants and Animals
          </h1>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {results.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg overflow-hidden shadow-sm"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2">{item.name}</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    {item.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">
                      {item.type}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => router.push(`/explore/${item.$id}`)}
                    >
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <footer className="bg-gray-100 dark:bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2024 nature-vigator Wiki. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
