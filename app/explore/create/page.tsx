import { useState } from "react";
import { useRouter } from "next/navigation";
import { Leaf, Upload } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { createContent } from "@/lib/actions/user.actions";
import ImagePicker from "./image-picker";

export default function CreateContentPage() {
  async function saveContent(formData) {
    "use server";

    const content = {
      name: formData.get("name"),
      type: formData.get("type"),
      description: formData.get("description"),
      details: formData.get("details"),
      image: formData.get("image"),
    };

    createContent(content);

    console.log(content);
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-background border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-6 w-6" />
            <span className="font-bold text-xl">PlantAnimal Wiki</span>
          </Link>
          <nav>
            <Button variant="ghost" asChild>
              <Link href="/explore">Explore</Link>
            </Button>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold mb-8">Create New Content</h1>
          <form action={saveContent} className="space-y-6">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="Enter the name of the plant or animal"
                required
              />
            </div>
            <div>
              <Label>Type</Label>
              <RadioGroup name="type" className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="plant" id="plant" />
                  <Label htmlFor="plant">Plant</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="animal" id="animal" />
                  <Label htmlFor="animal">Animal</Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a detailed description"
                required
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="details">Details</Label>
              <Textarea
                id="details"
                name="details"
                placeholder="Provide detailed details"
                required
                className="min-h-[100px]"
              />
            </div>
            <div>
              <Label htmlFor="image">Image</Label>
              <div className="mt-1 flex items-center space-x-4">
                <ImagePicker label="Your image" name="image" />
              </div>
            </div>
            <Button type="submit" className="w-full">
              <>
                <Upload className="mr-2 h-4 w-4" />
                Create
              </>
            </Button>
          </form>
        </div>
      </main>
      <footer className="bg-gray-100 dark:bg-gray-800 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-400">
          © 2024 Nature Navigator Wiki. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
