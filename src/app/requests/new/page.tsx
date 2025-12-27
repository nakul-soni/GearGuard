'use client';

import { Suspense, use } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RequestForm } from '@/components/requests/RequestForm';

function NewRequestContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const equipmentId = searchParams.get('equipmentId') || undefined;
  const date = searchParams.get('date') || undefined;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>

      <Card className="border-none bg-card/50 shadow-xl backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create Maintenance Request</CardTitle>
        </CardHeader>
        <CardContent>
          <RequestForm 
            prefilledEquipmentId={equipmentId} 
            prefilledDate={date}
            onSuccess={() => router.push('/requests')} 
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default function NewRequestPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewRequestContent />
    </Suspense>
  );
}
