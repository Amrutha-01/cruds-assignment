import Image from "next/image";
import MainPage from "./components/MainPage";
import { ChakraProvider } from "@chakra-ui/react";

export default function Home() {
  return (
    <ChakraProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <MainPage />
      </main>
    </ChakraProvider>
  );
}
