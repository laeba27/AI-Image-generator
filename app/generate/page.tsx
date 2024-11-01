"use client";
import { Wand2, Download, Sparkles as SparklesIcon, Edit2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import imagePlaceholder from "@/public/image-placeholder.png";
import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@uidotdev/usehooks";
import Image from "next/image";
import { useEffect, useState } from "react";
import Spinner from "@/components/spinner";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Sparkles from "@/components/Sparkles";
import ShareMenu from "@/components/ShareMenu";
import ImageEditor from "@/components/ImageEditor";

type ImageResponse = {
  b64_json: string;
  timings: { inference: number };
};

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [iterativeMode, setIterativeMode] = useState(false);
  const [userAPIKey, setUserAPIKey] = useState("");
  const debouncedPrompt = useDebounce(prompt, 300);
  const [generations, setGenerations] = useState<{ prompt: string; image: ImageResponse }[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>();
  const [isEditing, setIsEditing] = useState(false);

  const { data: image, isFetching } = useQuery({
    placeholderData: (previousData) => previousData,
    queryKey: [debouncedPrompt],
    queryFn: async () => {
      const baseUrl =
        process.env.NODE_ENV === "development"
          ?  "http://localhost:3000"
          : "https://ai-image-generator-phi-seven.vercel.app" ;

      let res = await fetch(`${baseUrl}/api/generateImage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt, userAPIKey, iterativeMode }),
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }
      return (await res.json()) as ImageResponse;
    },
    enabled: !!debouncedPrompt.trim(),
    staleTime: Infinity,
    retry: false,
  });

  const isDebouncing = prompt !== debouncedPrompt;

  useEffect(() => {
    if (image && !generations.map((g) => g.image).includes(image)) {
      setGenerations((images) => [...images, { prompt, image }]);
      setActiveIndex(generations.length);
    }
  }, [generations, image, prompt]);

  const activeImage = activeIndex !== undefined ? generations[activeIndex].image : undefined;

  const handleDownload = (imageData: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imageData}`;
    link.download = fileName;
    link.click();
  };

  const handleEditedImage = (editedImageUrl: string) => {
    const base64Data = editedImageUrl.split(',')[1];
    
    if (activeIndex !== undefined && generations[activeIndex]) {
      const updatedGenerations = [...generations];
      updatedGenerations[activeIndex] = {
        ...updatedGenerations[activeIndex],
        image: {
          ...updatedGenerations[activeIndex].image,
          b64_json: base64Data
        }
      };
      setGenerations(updatedGenerations);
    }
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-[#0f1420] to-black text-white relative overflow-hidden">
      {/* Background Effects */}
      <Sparkles />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black/50 to-black pointer-events-none" />

      <header className="container mx-auto flex flex-col sm:flex-row items-center justify-between p-4 md:p-6 space-y-4 sm:space-y-0 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center space-x-3 group"
        >
          <Link href="/" className="flex items-center space-x-3">
            <Wand2 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-400 group-hover:text-purple-600 transition-colors duration-500" />
            <span className="text-2xl sm:text-4xl font-extrabold tracking-wide bg-gradient-to-br from-blue-400 to-purple-700 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-blue-700 transition-all duration-500 ease-in-out">
              PicturaMind
            </span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-xs"
        >
          <label className="text-xs text-gray-300">
            [Optional] Add your{" "}
            <a
              href="https://api.together.xyz/settings/api-keys"
              target="_blank"
              className="underline underline-offset-4 transition hover:text-blue-400"
            >
              Together API Key
            </a>
          </label>
          <Input
            placeholder="API Key"
            type="password"
            value={userAPIKey}
            className="mt-1 bg-white/5 border-white/10 text-gray-200 placeholder:text-gray-400 focus:border-blue-500/50 transition-colors"
            onChange={(e) => setUserAPIKey(e.target.value)}
          />
        </motion.div>
      </header>

      <main className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center"
        >
          <form className="mt-10 w-full max-w-xl">
            <fieldset>
              <div className="relative group">
                <Textarea
                  spellCheck={false}
                  placeholder="Describe your imagination..."
                  required
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full resize-none bg-white/5 border-white/10 rounded-xl px-4 py-2 text-base placeholder:text-gray-400 focus:border-blue-500/50 transition-all duration-300 min-h-[80px] max-h-[120px]"
                />
                <motion.div
                  animate={isFetching || isDebouncing ? { opacity: 1 } : { opacity: 0 }}
                  className="absolute bottom-2 right-3 flex items-center gap-2"
                >
                  <SparklesIcon className="w-4 h-4 text-purple-400 animate-pulse" />
                  <Spinner className="size-4" />
                </motion.div>
              </div>

              <div className="mt-3 flex items-center justify-end gap-2 text-sm">
                <label className="flex items-center gap-2 text-gray-300">
                  Consistency mode
                  <Switch
                    checked={iterativeMode}
                    onCheckedChange={setIterativeMode}
                    className="data-[state=checked]:bg-purple-600"
                  />
                </label>
              </div>
            </fieldset>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex w-full grow flex-col items-center justify-center pb-8 pt-4 text-center mt-8"
        >
          <AnimatePresence mode="wait">
            {!activeImage || !prompt ? (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="max-w-xl md:max-w-4xl lg:max-w-3xl"
              >
                <p className="text-gray-400 md:text-xl lg:text-2xl">
                  Enter a prompt and watch your imagination come to life...
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mt-4 flex w-full max-w-4xl flex-col justify-center"
              >
                <div className="relative group">
                  <Image
                    placeholder="blur"
                    blurDataURL={imagePlaceholder.blurDataURL}
                    width={1024}
                    height={768}
                    src={`data:image/png;base64,${activeImage.b64_json}`}
                    alt=""
                    className={`${
                      isFetching ? "animate-pulse" : ""
                    } max-w-full rounded-xl object-cover shadow-lg shadow-black/50 transition-transform duration-300 group-hover:scale-[1.01]`}
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      className="p-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg hover:bg-white/20 transition-all duration-300"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="w-5 h-5 text-white" />
                    </motion.button>
                    <ShareMenu 
                      imageUrl={`data:image/png;base64,${activeImage.b64_json}`} 
                    />
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      whileHover={{ scale: 1.1 }}
                      className="p-3 bg-white/10 backdrop-blur-md rounded-full shadow-lg hover:bg-white/20 transition-all duration-300"
                      onClick={() => handleDownload(activeImage?.b64_json || "", "generated_image.png")}
                    >
                      <Download className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                >
                  {generations.map((generatedImage, i) => (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className={`w-32 shrink-0 transition-all duration-300 ${
                        activeIndex === i ? "opacity-100 ring-2 ring-purple-500" : "opacity-50"
                      }`}
                      onClick={() => setActiveIndex(i)}
                    >
                      <Image
                        placeholder="blur"
                        blurDataURL={imagePlaceholder.blurDataURL}
                        width={1024}
                        height={768}
                        src={`data:image/png;base64,${generatedImage.image.b64_json}`}
                        alt=""
                        className="max-w-full rounded-lg object-cover shadow-sm shadow-black/50"
                      />
                    </motion.button>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>
      {isEditing && activeImage && (
        <ImageEditor
          imageUrl={`data:image/png;base64,${activeImage.b64_json}`}
          onSave={handleEditedImage}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  );
}
