"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DataManager } from "@/lib/data-manager"

interface TestSelectionProps {
  selectedTests: string[]
  onTestsChange: (testCodes: string[]) => void
}

export function TestSelectionComponent({ selectedTests, onTestsChange }: TestSelectionProps) {
  const [testCatalog, setTestCatalog] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const dataManager = DataManager.getInstance()
    const catalog = dataManager.getTestCatalog()
    setTestCatalog(catalog)
  }, [])

  const handleTestToggle = (testCode: string) => {
    if (isUpdating) {
      return
    }
    
    setIsUpdating(true)
    
    const newSelection = selectedTests.includes(testCode)
      ? selectedTests.filter(code => code !== testCode)
      : [...selectedTests, testCode]
    
    onTestsChange(newSelection)
    
    // Reset the updating flag after a short delay
    setTimeout(() => {
      setIsUpdating(false)
    }, 100)
  }

  const filteredTests = testCatalog.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const groupedTests = filteredTests.reduce((groups, test) => {
    const category = test.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(test)
    return groups
  }, {} as Record<string, any[]>)



  return (
    <Card>
      <CardHeader>
        <CardTitle>Select Tests</CardTitle>
        <CardDescription>
          Choose the tests to include in this report ({selectedTests.length} selected)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="testSearch">Search Tests</Label>
          <Input
            id="testSearch"
            placeholder="Search by test name, code, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Test Categories */}
        <div className="space-y-6">
          {Object.entries(groupedTests as Record<string, any[]>).map(([category, tests]) => (
            <div key={category} className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">{category}</Badge>
                <span className="text-sm text-muted-foreground">
                  {tests.filter(test => selectedTests.includes(test.code)).length} of {tests.length} selected
                </span>
              </div>
              
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {tests.map((test) => (
                  <div
                    key={test.code}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedTests.includes(test.code)
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-muted-foreground'
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      handleTestToggle(test.code)
                    }}
                  >
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        checked={selectedTests.includes(test.code)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {test.code}
                          </Badge>
                        </div>
                        <p className="font-medium text-sm">{test.name}</p>
                        <p className="text-xs text-muted-foreground">
                          LKR {test.defaultPrice.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {filteredTests.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No tests found matching your search.
          </div>
        )}
      </CardContent>
    </Card>
  )
}