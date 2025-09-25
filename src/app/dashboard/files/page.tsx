import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type FileRow = {
  id: string
  name: string
  size: string
  date: string
}

const mockFiles: FileRow[] = [
  { id: '1', name: 'The Silent Patient.epub', size: '1.2 MB', date: '8:16 PM' },
  { id: '2', name: 'Project Hail Mary.epub', size: '3.8 MB', date: '7:04 PM' },
  { id: '3', name: 'Atomic Habits.epub', size: '912 KB', date: '6:20 PM' },
  { id: '4', name: 'Educated: A Memoir.epub', size: '2.1 MB', date: '5:30 PM' },
]

export default function FilesPage() {
  return (
    <main className="min-h-[60vh] w-full bg-background text-foreground flex items-start justify-center p-6">
      <div className="w-full max-w-5xl">
        <Card>
          <CardHeader>
            <CardTitle>All Files</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[56px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="hidden md:table-cell">Size</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFiles.map((f) => (
                  <TableRow key={f.id} className="hover:bg-muted/30">
                    <TableCell className="py-3">
                      <Image src="/file.svg" alt="file" width={20} height={20} className="opacity-80" />
                    </TableCell>
                    <TableCell className="font-medium">{f.name}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{f.date}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">{f.size}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}



