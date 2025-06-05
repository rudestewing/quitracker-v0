"use client";

import TrackerApp from "../components/TrackerApp";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div>
      {/* Color Mood Demo Link */}
      {/* <div className="fixed top-4 right-4 z-50">
        <Link href="/color-mood-demo">
          <Button variant="outline" size="sm">
            🎨 Color Mood Demo
          </Button>
        </Link>
      </div> */}

      <TrackerApp />
    </div>
  );
}
