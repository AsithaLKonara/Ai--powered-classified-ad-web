'use client'

import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'

interface Category {
    id: string
    name: string
    slug: string
}

interface Location {
    id: string
    name: string
    slug: string
}

interface SearchFilters {
    query: string
    minPrice: number
    maxPrice: number
    categories: string[]
    locations: string[]
    radius: number
    condition?: string
    sortBy: string
}

interface AdvancedSearchProps {
    onSearch: (filters: SearchFilters) => void
    initialFilters?: Partial<SearchFilters>
}

export function AdvancedSearch({ onSearch, initialFilters }: AdvancedSearchProps) {
    const [showFilters, setShowFilters] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [locations, setLocations] = useState<Location[]>([])

    const [filters, setFilters] = useState<SearchFilters>({
        query: initialFilters?.query || '',
        minPrice: initialFilters?.minPrice || 0,
        maxPrice: initialFilters?.maxPrice || 10000000,
        categories: initialFilters?.categories || [],
        locations: initialFilters?.locations || [],
        radius: initialFilters?.radius || 50,
        condition: initialFilters?.condition,
        sortBy: initialFilters?.sortBy || 'newest',
    })

    useEffect(() => {
        fetchCategories()
        fetchLocations()
    }, [])

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories')
            if (res.ok) {
                const data = await res.json()
                setCategories(data)
            }
        } catch (error) {
            console.error('Failed to fetch categories:', error)
        }
    }

    const fetchLocations = async () => {
        try {
            const res = await fetch('/api/locations')
            if (res.ok) {
                const data = await res.json()
                setLocations(data)
            }
        } catch (error) {
            console.error('Failed to fetch locations:', error)
        }
    }

    const handleCategoryToggle = (categoryId: string) => {
        setFilters((prev) => ({
            ...prev,
            categories: prev.categories.includes(categoryId)
                ? prev.categories.filter((id) => id !== categoryId)
                : [...prev.categories, categoryId],
        }))
    }

    const handleLocationToggle = (locationId: string) => {
        setFilters((prev) => ({
            ...prev,
            locations: prev.locations.includes(locationId)
                ? prev.locations.filter((id) => id !== locationId)
                : [...prev.locations, locationId],
        }))
    }

    const handleSearch = () => {
        onSearch(filters)
    }

    const handleReset = () => {
        const resetFilters: SearchFilters = {
            query: '',
            minPrice: 0,
            maxPrice: 10000000,
            categories: [],
            locations: [],
            radius: 50,
            sortBy: 'newest',
        }
        setFilters(resetFilters)
        onSearch(resetFilters)
    }

    const activeFiltersCount =
        filters.categories.length +
        filters.locations.length +
        (filters.condition ? 1 : 0) +
        (filters.minPrice > 0 || filters.maxPrice < 10000000 ? 1 : 0)

    return (
        <div className="bg-white rounded-lg shadow-md">
            {/* Search Bar */}
            <div className="p-4 border-b">
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <Input
                            type="text"
                            placeholder="Search for anything..."
                            value={filters.query}
                            onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                            className="pl-10"
                        />
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => setShowFilters(!showFilters)}
                        className="relative"
                    >
                        <SlidersHorizontal className="w-5 h-5 mr-2" />
                        Filters
                        {activeFiltersCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {activeFiltersCount}
                            </span>
                        )}
                    </Button>
                    <Button onClick={handleSearch}>Search</Button>
                </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
                <div className="p-6 space-y-6 border-b bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Price Range */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Price Range (LKR)</Label>
                            <div className="space-y-4">
                                <Slider
                                    value={[filters.minPrice, filters.maxPrice]}
                                    onValueChange={([min, max]) =>
                                        setFilters({ ...filters, minPrice: min, maxPrice: max })
                                    }
                                    max={10000000}
                                    step={10000}
                                    className="w-full"
                                />
                                <div className="flex gap-2 items-center">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) =>
                                            setFilters({ ...filters, minPrice: Number(e.target.value) })
                                        }
                                        className="w-full"
                                    />
                                    <span className="text-gray-500">-</span>
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) =>
                                            setFilters({ ...filters, maxPrice: Number(e.target.value) })
                                        }
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Categories */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Categories</Label>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {categories.map((category) => (
                                    <div key={category.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`category-${category.id}`}
                                            checked={filters.categories.includes(category.id)}
                                            onCheckedChange={() => handleCategoryToggle(category.id)}
                                        />
                                        <label
                                            htmlFor={`category-${category.id}`}
                                            className="text-sm cursor-pointer"
                                        >
                                            {category.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Locations */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Locations</Label>
                            <div className="max-h-48 overflow-y-auto space-y-2">
                                {locations.map((location) => (
                                    <div key={location.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={`location-${location.id}`}
                                            checked={filters.locations.includes(location.id)}
                                            onCheckedChange={() => handleLocationToggle(location.id)}
                                        />
                                        <label
                                            htmlFor={`location-${location.id}`}
                                            className="text-sm cursor-pointer"
                                        >
                                            {location.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Additional Filters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Condition */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Condition</Label>
                            <div className="flex gap-2">
                                {['NEW', 'USED', 'REFURBISHED'].map((condition) => (
                                    <button
                                        key={condition}
                                        onClick={() =>
                                            setFilters({
                                                ...filters,
                                                condition: filters.condition === condition ? undefined : condition,
                                            })
                                        }
                                        className={`px-4 py-2 rounded-lg border transition-colors ${filters.condition === condition
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                                            }`}
                                    >
                                        {condition}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sort By */}
                        <div className="space-y-3">
                            <Label className="text-base font-semibold">Sort By</Label>
                            <select
                                value={filters.sortBy}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-600 focus:outline-none"
                            >
                                <option value="newest">Newest First</option>
                                <option value="oldest">Oldest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="popular">Most Popular</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 justify-end pt-4 border-t">
                        <Button variant="outline" onClick={handleReset}>
                            <X className="w-4 h-4 mr-2" />
                            Reset Filters
                        </Button>
                        <Button onClick={handleSearch}>Apply Filters</Button>
                    </div>
                </div>
            )}
        </div>
    )
}
