"use client";

import { useState, useEffect } from "react";
import { DataManager, TestCatalogItem } from "@/lib/data-manager";
import { Plus, Edit2, Trash2, Save, X, Search, ArrowUp, ArrowDown } from "lucide-react";

export default function TestCatalogManagementPage() {
  const [tests, setTests] = useState<TestCatalogItem[]>([]);
  const [filteredTests, setFilteredTests] = useState<TestCatalogItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingTest, setEditingTest] = useState<TestCatalogItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showAddParamModal, setShowAddParamModal] = useState(false);
  const [newParamName, setNewParamName] = useState("");
  const [newParamValue, setNewParamValue] = useState("");
  const [newParamUnit, setNewParamUnit] = useState("");

  const dataManager = DataManager.getInstance();

  const categories = [
    "All",
    "Hematology",
    "Biochemistry",
    "Immunology",
    "Endocrinology",
    "Urinalysis",
    "Coagulation",
    "Renal",
    "Hormone",
    "Infectious Disease",
    "Andrology",
    "Cardiac Markers",
    "Glucose",
  ];

  useEffect(() => {
    loadTests();
  }, []);

  useEffect(() => {
    filterTests();
  }, [searchTerm, selectedCategory, tests]);

  const loadTests = async () => {
    setIsLoading(true);
    try {
      const catalog = await dataManager.getTestCatalog();
      setTests(catalog);
    } catch (error) {
      console.error("Error loading test catalog:", error);
      alert("Failed to load test catalog");
    } finally {
      setIsLoading(false);
    }
  };

  const filterTests = () => {
    let filtered = tests;

    if (selectedCategory !== "All") {
      filtered = filtered.filter((test) => test.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (test) =>
          test.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTests(filtered);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingTest({
      code: "",
      name: "",
      defaultPrice: 0,
      estimatedCost: 0,
      unit: "",
      referenceRange: {},
      category: "Biochemistry",
      componentOrder: [],
      unitPerTest: {},
    });
  };

  const handleEdit = (test: TestCatalogItem) => {
    const allKeys = Object.keys(test.referenceRange);
    const existingOrder = test.componentOrder || [];
    
    const missingKeys = allKeys.filter(key => !existingOrder.includes(key));
    const completeOrder = [...existingOrder, ...missingKeys];
    
    setEditingTest({ 
      ...test,
      componentOrder: completeOrder,
      unitPerTest: test.unitPerTest || {},
    });
    setIsAddingNew(false);
  };

  const handleSave = async () => {
    if (!editingTest) return;

    if (!editingTest.code || !editingTest.name) {
      alert("Test code and name are required");
      return;
    }

    try {
      if (isAddingNew) {
        const existing = await dataManager.getTestByCode(editingTest.code);
        if (existing) {
          alert("Test code already exists");
          return;
        }
        await dataManager.addTestToCatalog(editingTest);
        alert("Test added successfully");
      } else {
        await dataManager.addTestToCatalog(editingTest);
        alert("Test updated successfully");
      }

      await loadTests();
      setEditingTest(null);
      setIsAddingNew(false);
    } catch (error) {
      console.error("Error saving test:", error);
      alert("Failed to save test");
    }
  };

  const handleDelete = async (testCode: string) => {
    if (!confirm("Are you sure you want to delete this test?")) return;

    try {
      await dataManager.removeTestFromCatalog(testCode);
      alert("Test deleted successfully");
      await loadTests();
    } catch (error) {
      console.error("Error deleting test:", error);
      alert("Failed to delete test");
    }
  };

  const handleCancel = () => {
    setEditingTest(null);
    setIsAddingNew(false);
  };

  const updateEditingTest = (field: string, value: any) => {
    if (!editingTest) return;
    setEditingTest({ ...editingTest, [field]: value });
  };

  const updateReferenceRange = (key: string, value: string) => {
    if (!editingTest) return;
    setEditingTest({
      ...editingTest,
      referenceRange: { ...editingTest.referenceRange, [key]: value },
    });
  };

  const updateUnitPerTest = (key: string, value: string) => {
    if (!editingTest) return;
    const updatedUnits = { ...(editingTest.unitPerTest || {}) };
    if (value.trim()) {
      updatedUnits[key] = value;
    } else {
      delete updatedUnits[key];
    }
    setEditingTest({
      ...editingTest,
      unitPerTest: updatedUnits,
    });
  };

  const openAddParamModal = () => {
    setNewParamName("");
    setNewParamValue("");
    setNewParamUnit("");
    setShowAddParamModal(true);
  };

  const handleAddParameter = () => {
    if (!editingTest || !newParamName.trim()) {
      alert("Parameter name is required");
      return;
    }

    // Add to reference range
    updateReferenceRange(newParamName.trim(), newParamValue.trim());
    
    // Add to unit per test if provided
    if (newParamUnit.trim()) {
      const updatedUnits = { ...(editingTest.unitPerTest || {}) };
      updatedUnits[newParamName.trim()] = newParamUnit.trim();
      setEditingTest({
        ...editingTest,
        unitPerTest: updatedUnits,
      });
    }
    
    // Add to component order
    const updatedOrder = [...(editingTest.componentOrder || []), newParamName.trim()];
    setEditingTest({
      ...editingTest,
      componentOrder: updatedOrder,
    });

    setShowAddParamModal(false);
    setNewParamName("");
    setNewParamValue("");
    setNewParamUnit("");
  };

  const removeReferenceRangeField = (key: string) => {
    if (!editingTest) return;
    const updated = { ...editingTest.referenceRange };
    delete updated[key];
    
    // Remove from unit per test
    const updatedUnits = { ...(editingTest.unitPerTest || {}) };
    delete updatedUnits[key];
    
    // Remove from component order
    const updatedOrder = (editingTest.componentOrder || []).filter(k => k !== key);
    
    setEditingTest({ 
      ...editingTest, 
      referenceRange: updated,
      unitPerTest: updatedUnits,
      componentOrder: updatedOrder,
    });
  };

  const moveComponentUp = (index: number) => {
    if (!editingTest || !editingTest.componentOrder || index === 0) return;
    
    const newOrder = [...editingTest.componentOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    
    setEditingTest({ ...editingTest, componentOrder: newOrder });
  };

  const moveComponentDown = (index: number) => {
    if (!editingTest || !editingTest.componentOrder) return;
    if (index === editingTest.componentOrder.length - 1) return;
    
    const newOrder = [...editingTest.componentOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    
    setEditingTest({ ...editingTest, componentOrder: newOrder });
  };

  const getOrderedReferenceRangeEntries = () => {
    if (!editingTest) return [];
    
    const allKeys = Object.keys(editingTest.referenceRange);
    const orderedKeys = editingTest.componentOrder || [];
    
    const orderedEntries = orderedKeys
      .filter(key => allKeys.includes(key))
      .map(key => [key, editingTest.referenceRange[key]] as [string, any]);
    
    const remainingKeys = allKeys.filter(key => !orderedKeys.includes(key));
    const remainingEntries = remainingKeys.map(key => [key, editingTest.referenceRange[key]] as [string, any]);
    
    return [...orderedEntries, ...remainingEntries];
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl">Loading test catalog...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Test Catalog Management</h1>
        <p className="text-gray-600">Manage laboratory tests and their parameters</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by code or name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            <Plus className="h-5 w-5" />
            Add New Test
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredTests.length} of {tests.length} tests
        </div>
      </div>

      {/* Add Parameter Modal */}
      {showAddParamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b bg-linear-to-r from-green-600 to-green-700">
              <h3 className="text-xl font-bold text-white">Add New Parameter</h3>
              <button
                onClick={() => setShowAddParamModal(false)}
                className="text-white hover:bg-green-800 rounded-full p-2 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Parameter Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newParamName}
                  onChange={(e) => setNewParamName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Serum Creatinine"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Reference Range/Value
                </label>
                <input
                  type="text"
                  value={newParamValue}
                  onChange={(e) => setNewParamValue(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., 0.5 - 1.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Unit (Optional)
                </label>
                <input
                  type="text"
                  value={newParamUnit}
                  onChange={(e) => setNewParamUnit(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., mg/dL, IU/L"
                />
              </div>
            </div>

            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={handleAddParameter}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <Plus className="h-5 w-5" />
                Add Parameter
              </button>
              <button
                onClick={() => setShowAddParamModal(false)}
                className="flex-1 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Overlay */}
      {editingTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-5xl my-8">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b bg-linear-to-r from-blue-600 to-blue-700">
              <h2 className="text-2xl font-bold text-white">
                {isAddingNew ? "Add New Test" : "Edit Test"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-white hover:bg-blue-800 rounded-full p-2 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Test Code */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Test Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingTest.code}
                    onChange={(e) => updateEditingTest("code", e.target.value.toUpperCase())}
                    disabled={!isAddingNew}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder="e.g., FBC, LIPID"
                  />
                </div>

                {/* Test Name */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Test Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={editingTest.name}
                    onChange={(e) => updateEditingTest("name", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Full Blood Count"
                  />
                </div>

                {/* Default Price */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Default Price (LKR)
                  </label>
                  <input
                    type="number"
                    value={editingTest.defaultPrice}
                    onChange={(e) =>
                      updateEditingTest("defaultPrice", parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Estimated Cost */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Estimated Cost (LKR)
                  </label>
                  <input
                    type="number"
                    value={editingTest.estimatedCost}
                    onChange={(e) =>
                      updateEditingTest("estimatedCost", parseFloat(e.target.value))
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Unit */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Unit</label>
                  <input
                    type="text"
                    value={editingTest.unit}
                    onChange={(e) => updateEditingTest("unit", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., mg/dL, per test"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Category</label>
                  <select
                    value={editingTest.category}
                    onChange={(e) => updateEditingTest("category", e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Checkboxes */}
              <div className="flex flex-wrap gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingTest.isQualitative || false}
                    onChange={(e) =>
                      updateEditingTest("isQualitative", e.target.checked)
                    }
                    className="h-5 w-5 text-blue-600"
                  />
                  <label className="text-sm font-medium text-gray-700">Qualitative Test</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingTest.hasGraph || false}
                    onChange={(e) =>
                      updateEditingTest("hasGraph", e.target.checked)
                    }
                    className="h-5 w-5 text-blue-600"
                  />
                  <label className="text-sm font-medium text-gray-700">Has Graph</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingTest.hasMealOptions || false}
                    onChange={(e) =>
                      updateEditingTest("hasMealOptions", e.target.checked)
                    }
                    className="h-5 w-5 text-blue-600"
                  />
                  <label className="text-sm font-medium text-gray-700">Has Meal Options</label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingTest.hasMultipleMealOptions || false}
                    onChange={(e) =>
                      updateEditingTest("hasMultipleMealOptions", e.target.checked)
                    }
                    className="h-5 w-5 text-blue-600"
                  />
                  <label className="text-sm font-medium text-gray-700">Multiple Meal Options</label>
                </div>
              </div>

              {/* Reference Range with Component Order */}
              <div className="mt-6 border-t pt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-lg font-semibold text-gray-800">
                    Reference Range Parameters & Order
                  </label>
                  <button
                    onClick={openAddParamModal}
                    className="text-sm text-white flex items-center gap-1 bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                    Add Parameter
                  </button>
                </div>

                <div className="space-y-2 max-h-96 overflow-y-auto bg-gray-50 rounded-lg p-4">
                  {getOrderedReferenceRangeEntries().map(([key, value], index) => (
                    <div key={key} className="flex gap-2 items-center bg-white p-2 rounded-lg shadow-sm">
                      {/* Order Controls */}
                      <div className="flex flex-col gap-0.5">
                        <button
                          onClick={() => moveComponentUp(index)}
                          disabled={index === 0}
                          className="text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => moveComponentDown(index)}
                          disabled={index === getOrderedReferenceRangeEntries().length - 1}
                          className="text-gray-500 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      {/* Order Number */}
                      <div className="w-7 h-7 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full font-semibold text-xs">
                        {index + 1}
                      </div>

                      {/* Parameter Name */}
                      <input
                        type="text"
                        value={key}
                        disabled
                        className="w-1/3 px-3 py-1.5 border border-gray-300 rounded-md bg-gray-50 font-medium text-sm"
                        placeholder="Parameter"
                      />

                      {/* Reference Range */}
                      <input
                        type="text"
                        value={typeof value === "string" ? value : JSON.stringify(value)}
                        onChange={(e) => updateReferenceRange(key, e.target.value)}
                        className="w-1/3 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Range"
                      />

                      {/* Unit Per Test */}
                      <input
                        type="text"
                        value={(editingTest.unitPerTest && editingTest.unitPerTest[key]) || ""}
                        onChange={(e) => updateUnitPerTest(key, e.target.value)}
                        className="w-1/4 px-3 py-1.5 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        placeholder="Unit"
                      />

                      {/* Delete Button */}
                      <button
                        onClick={() => removeReferenceRangeField(key)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete parameter"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {getOrderedReferenceRangeEntries().length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No reference range parameters added yet. Click "Add Parameter" to get started.
                    </div>
                  )}
                </div>

                <div className="mt-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <strong>Tip:</strong> Use the arrow buttons to reorder parameters. This order will be used when displaying test results.
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex gap-3 p-6 border-t bg-gray-50">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                <Save className="h-5 w-5" />
                Save Test
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                <X className="h-5 w-5" />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tests List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parameters
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTests.map((test) => (
                <tr key={test.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {test.code}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {test.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {test.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    LKR {test.defaultPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {test.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {Object.keys(test.referenceRange).length} params
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(test)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                      title="Edit test"
                    >
                      <Edit2 className="h-5 w-5 inline" />
                    </button>
                    {/* <button
                      onClick={() => handleDelete(test.code)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete test"
                    >
                      <Trash2 className="h-5 w-5 inline" />
                    </button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredTests.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No tests found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>
  );
}