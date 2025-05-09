import { getEmailById } from "@/_actions/prospects/email.action";
import { notFound } from "next/navigation";
import EditorHeader from "../components/editor-header";
import { ElementsSidebar } from "../components/elements-sidebar";
import Canvas from "../components/canvas";
import Settings from "../components/settings";
import { ScreenSizeProvider } from "@/contexts/ScreenSizeContext";

export default async function EmailEditorPage() {

    return (
        <ScreenSizeProvider>
        <div className=" h-[calc(100vh-56px)] ">
            <EditorHeader />
                <div className="grid grid-cols-5 h-full">
                <ElementsSidebar />
                <div className="col-span-3 bg-gray-200 h-full flex justify-center items-center">
                    <Canvas />
                </div>
                <Settings />
            </div>
        </div>
        </ScreenSizeProvider>
    );
}
