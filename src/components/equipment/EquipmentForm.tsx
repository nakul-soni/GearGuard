'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/store/useStore';
import { Equipment, EquipmentCategory } from '@/types';
import { toast } from 'sonner';

const equipmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  serialNumber: z.string().min(2, 'Serial number is required'),
  purchaseDate: z.string(),
  warrantyInfo: z.string(),
  location: z.string().min(2, 'Location is required'),
  department: z.string().min(2, 'Department is required'),
  assignedEmployee: z.string().min(2, 'Assigned employee is required'),
  maintenanceTeamId: z.string(),
  category: z.enum(['Manufacturing', 'Transportation', 'Computing', 'Office', 'Other']),
});

interface EquipmentFormProps {
  onSuccess?: () => void;
  initialData?: Equipment;
}

export function EquipmentForm({ onSuccess, initialData }: EquipmentFormProps) {
  const { addEquipment, updateEquipment, teams } = useStore();

  const form = useForm<z.infer<typeof equipmentSchema>>({
    resolver: zodResolver(equipmentSchema),
    defaultValues: initialData || {
      name: '',
      serialNumber: '',
      purchaseDate: new Date().toISOString().split('T')[0],
      warrantyInfo: '',
      location: '',
      department: '',
      assignedEmployee: '',
      maintenanceTeamId: teams[0]?.id || '',
      category: 'Manufacturing',
    },
  });

    function onSubmit(values: z.infer<typeof equipmentSchema>) {
      if (initialData) {
        updateEquipment(initialData.id, values);
        toast.success('Equipment updated successfully');
      } else {
        const newEquipment = {
          ...values,
          status: 'Active' as EquipmentStatus,
          defaultTechnicianId: '',
        };
        addEquipment(newEquipment);
        toast.success('Equipment added successfully');
      }
      onSuccess?.();
    }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment Name</FormLabel>
                <FormControl>
                  <Input placeholder="CNC Milling Machine" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="serialNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Serial Number</FormLabel>
                <FormControl>
                  <Input placeholder="SN-2023-XYZ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    <SelectItem value="Transportation">Transportation</SelectItem>
                    <SelectItem value="Computing">Computing</SelectItem>
                    <SelectItem value="Office">Office</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maintenanceTeamId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maintenance Team</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {teams.map((team) => (
                      <SelectItem key={team.id} value={team.id}>
                        {team.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input placeholder="Production" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assignedEmployee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Employee</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Physical Location</FormLabel>
                <FormControl>
                  <Input placeholder="Bay 4, Floor 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="purchaseDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Purchase Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="warrantyInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Warranty Information</FormLabel>
              <FormControl>
                <Input placeholder="3 years parts and labor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" className="w-full sm:w-auto">
            {initialData ? 'Update Equipment' : 'Add Equipment'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
