"use client";

import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import CloseButton from "@/src/components/CloseButton";

const ModelPreview = dynamic(() => import("@/src/components/ModelPreview"), {
  ssr: false,
});

const PROJECTS: Record<string, { name: string; modelSrc: string }> = {
  agora: {
    name: "Agora",
    modelSrc: "/assets/projects/agora/agora.glb",
  },
  "the-web": {
    name: "The Web",
    modelSrc: "/assets/projects/the web/the-web.glb",
  },
};

export default function ProjectPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const project = PROJECTS[slug];

  if (!project) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-cream">
        <p className="font-clash text-charcoal">Project not found</p>
      </div>
    );
  }

  const handleClose = () => router.push("/");

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-cream">
      {/* Project title */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="fixed top-8 left-8 z-40 font-clash text-2xl md:text-3xl font-semibold text-charcoal"
      >
        {project.name}
      </motion.h1>

      {/* Close button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="fixed top-8 right-8 z-50"
      >
        <CloseButton onClick={handleClose} />
      </motion.div>

      {/* Interactive Model */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full"
      >
        <ModelPreview
          modelSrc={project.modelSrc}
          interactive={true}
        />
      </motion.div>
    </main>
  );
}
