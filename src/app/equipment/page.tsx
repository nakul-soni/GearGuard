'use client';

import { useState, useMemo } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useStore } from '@/store/useStore';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { EquipmentForm } from '@/components/equipment/EquipmentForm';
import { EquipmentCategory } from '@/types';

export default function EquipmentListPage() {
  const equipment = useStore((state) => state.equipment);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredEquipment = useMemo(() => {
    return equipment.filter((eq) => {
      const matchesSearch = 
        eq.name.toLowerCase().includes(search.toLowerCase()) || 
        eq.serialNumber.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || eq.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [equipment, search, category]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Equipment Fleet</h1>
          <p className="text-muted-foreground">Manage and track all company assets and machinery.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              Add Equipment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card/95 backdrop-blur-xl">
            <DialogHeader>
              <DialogTitle>Add New Equipment</DialogTitle>
            </DialogHeader>
            <EquipmentForm onSuccess={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or serial number..."
            className="pl-10 bg-card/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px] bg-card/50">
              <Filter className="mr-2 h-4 w-4 opacity-50" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Transportation">Transportation</SelectItem>
              <SelectItem value="Computing">Computing</SelectItem>
              <SelectItem value="Office">Office</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {filteredEquipment.map((eq, index) => (
            <motion.div
              key={eq.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              <EquipmentCard equipment={eq} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredEquipment.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-accent p-6 mb-4">
            <Search className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-semibold">No equipment found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
