'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Bell, MessageCircle, CheckCircle, XCircle, Clock } from 'lucide-react'

type EscalatedIssue = {
  id: string
  user: string
  issue: string
  timestamp: string
  status: 'pending' | 'in_progress' | 'resolved'
  responded: boolean
}

// const mockEscalatedIssues: EscalatedIssue[] = [
//   { id: '1', user: 'John Doe', issue: 'SmartHome Hub Wi-Fi Connection', timestamp: '2023-06-10 14:30', status: 'pending', responded: false },
//   { id: '2', user: 'Jane Smith', issue: 'Device Pairing Failure', timestamp: '2023-06-10 15:45', status: 'in_progress', responded: true },
//   { id: '3', user: 'Bob Johnson', issue: 'Firmware Update Error', timestamp: '2023-06-10 16:20', status: 'resolved', responded: true },
//   { id: '4', user: 'Alice Brown', issue: 'Smart Lock Malfunction', timestamp: '2023-06-10 17:10', status: 'pending', responded: false },
//   { id: '5', user: 'Charlie Wilson', issue: 'Thermostat Not Responding', timestamp: '2023-06-10 18:05', status: 'in_progress', responded: true },
// ]

export default function AgentDashboard() {
  const [issues, setIssues] = useState<EscalatedIssue[]>([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    async function fetchIssues() {
      const response = await fetch('/api/issues')
      if (response.ok) {
        const data = await response.json()
        setIssues(data)
      } else {
        // Handle error
      }
    }
    fetchIssues()
  }, [])



  const filteredIssues = issues.filter(issue => 
    issue.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.issue.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const pendingIssues = filteredIssues.filter(issue => issue.status === 'pending')
  const inProgressIssues = filteredIssues.filter(issue => issue.status === 'in_progress')
  const resolvedIssues = filteredIssues.filter(issue => issue.status === 'resolved')

  const handleStatusChange = async (id: string, newStatus: 'pending' | 'in_progress' | 'resolved') => {
    const response = await fetch(`/api/issues/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })

    if (response.ok) {
      const updatedIssue = await response.json()
      setIssues(issues.map(issue => (issue.id === id ? updatedIssue : issue)))
    }
  }

  const handleResponseToggle = async (id: string) => {
    const issue = issues.find(issue => issue.id === id)
    const response = await fetch(`/api/issues/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responded: !issue?.responded })
    })

    if (response.ok) {
      const updatedIssue = await response.json()
      setIssues(issues.map(issue => (issue.id === id ? updatedIssue : issue)))
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Agent Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback>AG</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Escalated Issues Overview</CardTitle>
            <CardDescription>Manage and respond to customer issues that require human assistance.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <Badge variant="secondary">{pendingIssues.length} Pending</Badge>
                <Badge variant="secondary">{inProgressIssues.length} In Progress</Badge>
                <Badge variant="secondary">{resolvedIssues.length} Resolved</Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Issues</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <IssueTable issues={filteredIssues} onStatusChange={handleStatusChange} onResponseToggle={handleResponseToggle} />
          </TabsContent>
          <TabsContent value="pending">
            <IssueTable issues={pendingIssues} onStatusChange={handleStatusChange} onResponseToggle={handleResponseToggle} />
          </TabsContent>
          <TabsContent value="in_progress">
            <IssueTable issues={inProgressIssues} onStatusChange={handleStatusChange} onResponseToggle={handleResponseToggle} />
          </TabsContent>
          <TabsContent value="resolved">
            <IssueTable issues={resolvedIssues} onStatusChange={handleStatusChange} onResponseToggle={handleResponseToggle} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

function IssueTable({ 
  issues, 
  onStatusChange, 
  onResponseToggle 
}: { 
  issues: EscalatedIssue[], 
  onStatusChange: (id: string, status: 'pending' | 'in_progress' | 'resolved') => void,
  onResponseToggle: (id: string) => void
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>User</TableHead>
          <TableHead>Issue</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Responded</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {issues.map((issue) => (
          <TableRow key={issue.id}>
            <TableCell>{issue.user}</TableCell>
            <TableCell>{issue.issue}</TableCell>
            <TableCell>{issue.timestamp}</TableCell>
            <TableCell>
              <Badge 
                variant={issue.status === 'resolved' ? 'default' : 'outline'}
                className={`
                  ${issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : ''}
                  ${issue.status === 'in_progress' ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : ''}
                  ${issue.status === 'resolved' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
                `}
              >
                {issue.status === 'pending' && <Clock className="w-4 h-4 mr-1" />}
                {issue.status === 'in_progress' && <MessageCircle className="w-4 h-4 mr-1" />}
                {issue.status === 'resolved' && <CheckCircle className="w-4 h-4 mr-1" />}
                {issue.status.replace('_', ' ')}
              </Badge>
            </TableCell>
            <TableCell>
              <motion.div
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onResponseToggle(issue.id)}
                >
                  {issue.responded ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </Button>
              </motion.div>
            </TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant={issue.status === 'pending' ? 'default' : 'outline'}
                  onClick={() => onStatusChange(issue.id, 'pending')}
                >
                  Pending
                </Button>
                <Button 
                  size="sm" 
                  variant={issue.status === 'in_progress' ? 'default' : 'outline'}
                  onClick={() => onStatusChange(issue.id, 'in_progress')}
                >
                  In Progress
                </Button>
                <Button 
                  size="sm" 
                  variant={issue.status === 'resolved' ? 'default' : 'outline'}
                  onClick={() => onStatusChange(issue.id, 'resolved')}
                >
                  Resolved
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}