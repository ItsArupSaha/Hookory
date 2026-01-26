"use client"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useState, useEffect } from "react"

interface EditPostDialogProps {
    open: boolean
    initialContent: string
    onClose: () => void
    onSave: (newContent: string) => void
}

export function EditPostDialog({ open, initialContent, onClose, onSave }: EditPostDialogProps) {
    const [content, setContent] = useState(initialContent)

    useEffect(() => {
        setContent(initialContent)
    }, [initialContent, open])

    const handleSave = () => {
        onSave(content)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Edit Post</DialogTitle>
                </DialogHeader>
                <div className="py-4">
                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="min-h-[300px] font-sans text-sm resize-y"
                        placeholder="Edit your post content..."
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="button-primary bg-purple-600 hover:bg-purple-700 text-white">
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
