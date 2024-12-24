import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { FileText, Download } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'

interface ImportUsersDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function ImportUsersDialog({ isOpen, onClose }: ImportUsersDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast({
          title: 'Invalid file type',
          description: 'Please select a CSV file.',
          variant: 'destructive',
        })
        e.target.value = ''
        return
      }
      setFile(selectedFile)
    }
  }

  const handleImport = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file to import.',
        variant: 'destructive',
      })
      return
    }

    if (!user?.attributes?.email) {
      toast({
        title: 'Error',
        description: 'Admin email not found. Please sign in again.',
        variant: 'destructive',
      })
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/import-users', {
        method: 'POST',
        headers: {
          'x-admin-email': user.attributes.email,
        },
        body: formData,
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: 'Success',
          description: `Imported ${result.importedCount} users successfully.`,
        })
        onClose()
      } else {
        const error = await response.json()
        throw new Error(error.message)
      }
    } catch (error) {
      console.error('Error importing users:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to import users. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Users</DialogTitle>
          <DialogDescription>
            Upload a CSV file containing user information. The file should include columns for email, firstName, lastName, and optional columns for role, gender, and team.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Alert>
            <FileText className="h-4 w-4" />
            <AlertDescription>
              Required CSV format: email, firstName, lastName, role (optional), gender (optional), team (optional)
            </AlertDescription>
          </Alert>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="file" className="text-right">
              Select CSV File
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".csv"
              className="col-span-3"
            />
          </div>
        </div>
        <div className="flex justify-between items-center">
          <Link href="/api/sample-users-csv" className="flex items-center text-sm text-blue-600 hover:underline">
            <Download className="h-4 w-4 mr-1" />
            Download sample CSV
          </Link>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleImport} disabled={!file || isUploading}>
              {isUploading ? 'Importing...' : 'Import'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

