'use client';

import { useEffect, useState } from 'react';
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
  FormDescription,
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
import { MaintenanceRequest, RequestType, RequestStatus } from '@/types';
import { toast } from 'sonner';

const requestSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  equipmentId: z.string().min(1, 'Please select equipment'),
  type: z.enum(['Corrective', 'Preventive']),
  scheduledDate: z.string().optional(),
  assignedTechnicianId: z.string().optional(),
  status: z.enum(['New', 'In Progress', 'Repaired', 'Scrap']),
});

interface RequestFormProps {
  onSuccess?: () => void;
  initialData?: MaintenanceRequest;
  prefilledEquipmentId?: string;
  prefilledDate?: string;
}

export function RequestForm({ onSuccess, initialData, prefilledEquipmentId, prefilledDate }: RequestFormProps) {
  const { addRequest, updateRequest, equipment, teams, users } = useStore();
  const [selectedEquipmentTeamId, setSelectedEquipmentTeamId] = useState<string | null>(null);

  const form = useForm<z.infer<typeof requestSchema>>({
    resolver: zodResolver(requestSchema),
    defaultValues: initialData || {
      subject: '',
      equipmentId: prefilledEquipmentId || '',
      type: 'Corrective',
      scheduledDate: prefilledDate || new Date().toISOString().split('T')[0],
      assignedTechnicianId: '',
      status: 'New',
    },
  });

  const watchEquipmentId = form.watch('equipmentId');

  useEffect(() => {
    if (watchEquipmentId) {
      const selectedEq = equipment.find(e => e.id === watchEquipmentId);
      if (selectedEq) {
        setSelectedEquipmentTeamId(selectedEq.maintenanceTeamId);
        // Auto-fill logic could go here if we had more fields in the request form
        // that depend on the equipment (like category, though category is on the eq itself)
      }
    }
  }, [watchEquipmentId, equipment]);

  const availableTechnicians = selectedEquipmentTeamId 
    ? users.filter(u => u.teamId === selectedEquipmentTeamId)
    : [];

  function onSubmit(values: z.infer<typeof requestSchema>) {
    if (initialData) {
      updateRequest(initialData.id, values);
      toast.success('Maintenance request updated');
    } else {
      const newRequest = {
        ...values,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addRequest(newRequest);
      toast.success('Maintenance request created');
    }
    onSuccess?.();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject / Issue Description</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Hydraulic leak in main valve" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="equipmentId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Equipment</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {equipment.map((eq) => (
                      <SelectItem key={eq.id} value={eq.id}>
                        {eq.name} ({eq.serialNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Request Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Corrective">Corrective (Breakdown)</SelectItem>
                    <SelectItem value="Preventive">Preventive (Routine)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {form.watch('type') === 'Preventive' && (
          <FormField
            control={form.control}
            name="scheduledDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Scheduled Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Repaired">Repaired</SelectItem>
                    <SelectItem value="Scrap">Scrap</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assignedTechnicianId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Assigned Technician</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={!watchEquipmentId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={watchEquipmentId ? "Select technician" : "Select equipment first"} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {availableTechnicians.map((tech) => (
                      <SelectItem key={tech.id} value={tech.id}>
                        {tech.name}
                      </SelectItem>
                    ))}
                    {availableTechnicians.length === 0 && watchEquipmentId && (
                      <SelectItem value="none" disabled>No technicians in this team</SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormDescription className="text-[10px]">
                  Only technicians from the equipment's assigned team are shown.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="submit" className="w-full sm:w-auto shadow-lg shadow-primary/20">
            {initialData ? 'Update Request' : 'Create Request'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
