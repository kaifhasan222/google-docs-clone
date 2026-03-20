"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Editor, Element as SlateElement, Transforms } from "slate"
import type { Descendant } from "slate"
import type { TRenderElementProps, TRenderLeafProps } from "@udecode/slate-react"
import {
  createPlateEditor,
  Plate,
  PlateContent,
  useEditorRef,
  ParagraphPlugin,
} from "@udecode/plate-common/react"
import { BoldPlugin, ItalicPlugin, UnderlinePlugin } from "@udecode/plate-basic-marks/react"
import debounce from "lodash.debounce"
import { createClient } from "@/utils/supabase/client"
import { Bold, Heading1, Heading2, Italic, List, ListOrdered, Underline } from "lucide-react"

type EditorValue = Descendant[]

interface PlateEditorProps {
  documentId: string
  initialContent: EditorValue
}

const LIST_TYPES = ["ul", "ol"] as const
type BlockFormat = "h1" | "h2" | "ul" | "ol"

function getNodeType(node: unknown) {
  if (!SlateElement.isElement(node)) return ""
  return String((node as { type?: string }).type ?? "")
}

function isBlockActive(editor: Editor, format: string) {
  const [match] = Editor.nodes(editor, {
    match: (node) => getNodeType(node) === format,
  })

  return Boolean(match)
}

function toggleBlock(editor: Editor, format: BlockFormat) {
  const isList = LIST_TYPES.includes(format as (typeof LIST_TYPES)[number])
  const isActive = isBlockActive(editor, format)

  Transforms.unwrapNodes(editor, {
    match: (node) => LIST_TYPES.includes(getNodeType(node) as (typeof LIST_TYPES)[number]),
    split: true,
  })

  Transforms.setNodes(
    editor,
    { type: isActive ? ParagraphPlugin.key : isList ? "li" : format } as never,
    {
      match: (node) => SlateElement.isElement(node) && Editor.isBlock(editor, node),
    }
  )

  if (!isActive && isList) {
    Transforms.wrapNodes(editor, { type: format, children: [] } as never)
  }
}

function EditorLeaf(props: TRenderLeafProps) {
  const { attributes, children, leaf } = props

  let content = children

  if (leaf.bold) {
    content = <strong>{content}</strong>
  }
  if (leaf.italic) {
    content = <em>{content}</em>
  }
  if (leaf.underline) {
    content = <u>{content}</u>
  }

  return <span {...attributes}>{content}</span>
}

function EditorElement(props: TRenderElementProps) {
  const { attributes, children, element } = props

  switch (element.type) {
    case "h1":
      return (
        <h1 {...attributes} className="mb-4 mt-6 text-4xl font-semibold tracking-tight text-foreground first:mt-0">
          {children}
        </h1>
      )
    case "h2":
      return (
        <h2 {...attributes} className="mb-3 mt-5 text-3xl font-semibold tracking-tight text-foreground first:mt-0">
          {children}
        </h2>
      )
    case "h3":
      return (
        <h3 {...attributes} className="mb-3 mt-4 text-2xl font-semibold tracking-tight text-foreground first:mt-0">
          {children}
        </h3>
      )
    case "ul":
      return (
        <ul {...attributes} className="my-3 list-disc pl-6 text-[15px] leading-8 text-foreground">
          {children}
        </ul>
      )
    case "ol":
      return (
        <ol {...attributes} className="my-3 list-decimal pl-6 text-[15px] leading-8 text-foreground">
          {children}
        </ol>
      )
    case "li":
      return <li {...attributes}>{children}</li>
    case "lic":
      return (
        <p {...attributes} className="my-0 text-[15px] leading-8 text-foreground">
          {children}
        </p>
      )
    default:
      return (
        <p {...attributes} className="my-3 text-[15px] leading-8 text-foreground">
          {children}
        </p>
      )
  }
}

function ToolbarButton({
  children,
  isActive = false,
  onClick,
  onMouseDown,
  title,
}: {
  children: React.ReactNode
  isActive?: boolean
  onClick?: (event: React.MouseEvent) => void
  onMouseDown?: (event: React.MouseEvent) => void
  title: string
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={[
        "inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors",
        isActive
          ? "border-border bg-secondary text-foreground"
          : "border-transparent text-muted-foreground hover:border-border hover:bg-secondary hover:text-foreground",
      ].join(" ")}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {children}
    </button>
  )
}

function Toolbar() {
  const editor = useEditorRef()
  const slateEditor = editor as unknown as Editor
  const selection = editor.selection
  const blockEntry = selection
    ? Editor.above(slateEditor, {
        at: selection,
        match: (node) => SlateElement.isElement(node) && Editor.isBlock(slateEditor, node),
      })
    : undefined
  const activeBlockType = blockEntry && "type" in blockEntry[0] ? String(blockEntry[0].type ?? "") : "p"
  const listEntry = selection
    ? Editor.above(slateEditor, {
        at: selection,
        match: (node) => LIST_TYPES.includes(getNodeType(node) as (typeof LIST_TYPES)[number]),
      })
    : undefined
  const activeListType = listEntry && "type" in listEntry[0] ? String(listEntry[0].type ?? "") : ""
  const currentMarks = (Editor.marks(slateEditor) ?? {}) as Record<string, boolean>

  const preserveSelection = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleToggleMark = (key: string) => {
    editor.tf.toggle.mark({ key })
  }

  const handleToggleHeading = (type: "h1" | "h2") => {
    toggleBlock(slateEditor, type)
  }

  const handleToggleBulletedList = () => {
    toggleBlock(slateEditor, "ul")
  }

  const handleToggleNumberedList = () => {
    toggleBlock(slateEditor, "ol")
  }

  return (
    <div
      className="sticky top-0 z-10 flex items-center gap-1 border-b bg-background/90 px-3 py-2 backdrop-blur"
      contentEditable={false}
    >
      <div className="flex items-center gap-1 rounded-full border bg-background px-1.5 py-1 shadow-sm">
        <ToolbarButton
          title="Heading 1"
          isActive={activeBlockType === "h1"}
          onMouseDown={preserveSelection}
          onClick={() => handleToggleHeading("h1")}
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Heading 2"
          isActive={activeBlockType === "h2"}
          onMouseDown={preserveSelection}
          onClick={() => handleToggleHeading("h2")}
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton
          title="Bold"
          isActive={Boolean(currentMarks.bold)}
          onMouseDown={preserveSelection}
          onClick={() => handleToggleMark(BoldPlugin.key)}
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Italic"
          isActive={Boolean(currentMarks.italic)}
          onMouseDown={preserveSelection}
          onClick={() => handleToggleMark(ItalicPlugin.key)}
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Underline"
          isActive={Boolean(currentMarks.underline)}
          onMouseDown={preserveSelection}
          onClick={() => handleToggleMark(UnderlinePlugin.key)}
        >
          <Underline className="h-4 w-4" />
        </ToolbarButton>
        <div className="mx-1 h-5 w-px bg-border" />
        <ToolbarButton
          title="Bulleted list"
          isActive={activeListType === "ul"}
          onMouseDown={preserveSelection}
          onClick={handleToggleBulletedList}
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          title="Numbered list"
          isActive={activeListType === "ol"}
          onMouseDown={preserveSelection}
          onClick={handleToggleNumberedList}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
      </div>
    </div>
  )
}

export function PlateEditor({ documentId, initialContent }: PlateEditorProps) {
  const [saveStatus, setSaveStatus] = useState<"Saved" | "Saving..." | "Unsaved changes">("Saved")
  const supabase = createClient()

  const editor = useMemo(
    () =>
      createPlateEditor({
        plugins: [
          ParagraphPlugin,
          BoldPlugin,
          ItalicPlugin,
          UnderlinePlugin,
        ],
        value: initialContent as never,
      }),
    [initialContent]
  )
  const runtimeEditor = editor as unknown as {
    children: EditorValue
    onChange: () => void
  }

  const autoSave = useMemo(
    () =>
      debounce(async (newValue: EditorValue) => {
        setSaveStatus("Saving...")
        const { error } = await supabase
          .from("documents")
          .update({ content: newValue, updated_at: new Date().toISOString() })
          .eq("id", documentId)

        if (!error) {
          setSaveStatus("Saved")
        }
      }, 2200),
    [documentId, supabase]
  )

  useEffect(() => {
    const channel = supabase
      .channel(`doc-${documentId}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "documents", filter: `id=eq.${documentId}` },
        (payload: { new: { content?: EditorValue } }) => {
          if (
            payload.new.content &&
            JSON.stringify(payload.new.content) !== JSON.stringify(runtimeEditor.children)
          ) {
            runtimeEditor.children = payload.new.content
            runtimeEditor.onChange()
            setSaveStatus("Saved")
          }
        }
      )
      .subscribe()

    return () => {
      autoSave.cancel()
      supabase.removeChannel(channel)
    }
  }, [autoSave, documentId, runtimeEditor, supabase])

  const handleChange = ({ value: newValue }: { value: EditorValue }) => {
    setSaveStatus("Unsaved changes")
    autoSave(newValue)
  }

  return (
    <div className="relative flex h-full min-h-[60vh] w-full flex-col overflow-hidden rounded-[1.75rem] border bg-background shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b bg-muted/20 px-4 py-3">
        <div className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Editor</div>
        <div className="rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm">
          {saveStatus}
        </div>
      </div>

      <Plate editor={editor} onChange={handleChange}>
        <Toolbar />
        <div className="docs-grid flex-1 overflow-auto bg-[linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(255,255,255,0.96))] px-4 py-6 sm:px-6 sm:py-8 dark:bg-[linear-gradient(to_bottom,rgba(17,24,39,0.92),rgba(17,24,39,0.98))]">
          <div className="mx-auto min-h-full w-full max-w-[8.5in] rounded-[1.5rem] border border-border/70 bg-background px-5 py-6 shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:px-8 sm:py-10">
            <PlateContent
              className="min-h-[52vh] w-full border-0 text-[15px] leading-8 text-foreground outline-none focus-visible:outline-none max-w-none"
              placeholder="Start typing your document..."
              renderElement={EditorElement}
              renderLeaf={EditorLeaf}
            />
          </div>
        </div>
      </Plate>
    </div>
  )
}
