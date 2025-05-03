import { getEmailById } from "@/_actions/prospects/email.action";
import { notFound } from "next/navigation";
import EditorHeader from "../components/editor-header";
import { ElementsSidebar } from "../components/elements-sidebar";
import Canvas from "../components/canvas";
import Settings from "../components/settings";

export default async function EmailEditorPage() {

    return (
        <div>
            <EditorHeader />
            <div className="grid grid-cols-5">
                <ElementsSidebar />
                <div className="col-span-3 bg-gray-200">
                    <Canvas />
                </div>
                <Settings />
            </div>
        </div>
    );
}
