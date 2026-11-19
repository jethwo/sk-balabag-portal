import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Italic, List, ListOrdered } from "lucide-react";
import { cn } from "@/lib/utils";

/** TipTap rich-text editor. Calls onChange with HTML every time the text changes. */
export default function RichTextEditor({ value, onChange }: { value: string; onChange: (html: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: { attributes: { class: "rich min-h-32 rounded-b-md border border-ink/20 bg-cream p-3 focus:outline-2 focus:outline-purple" } },
  });
  if (!editor) return null;

  const tools = [
    { Icon: Bold, run: () => editor.chain().focus().toggleBold().run(), on: editor.isActive("bold"), label: "Bold" },
    { Icon: Italic, run: () => editor.chain().focus().toggleItalic().run(), on: editor.isActive("italic"), label: "Italic" },
    { Icon: Heading2, run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), on: editor.isActive("heading", { level: 2 }), label: "Heading" },
    { Icon: List, run: () => editor.chain().focus().toggleBulletList().run(), on: editor.isActive("bulletList"), label: "Bullet list" },
    { Icon: ListOrdered, run: () => editor.chain().focus().toggleOrderedList().run(), on: editor.isActive("orderedList"), label: "Numbered list" },
  ];
  return (
    <div>
      <div className="flex gap-1 rounded-t-md border border-b-0 border-ink/20 bg-paper p-1">
        {tools.map(({ Icon, run, on, label }) => (
          <button key={label} type="button" title={label} onClick={run}
            className={cn("rounded p-1.5 hover:bg-cream", on && "bg-purple text-cream hover:bg-purple")}><Icon size={16} /></button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
