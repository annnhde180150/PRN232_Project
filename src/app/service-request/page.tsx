'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ServiceRequestPage() {
    const router = useRouter();

    useEffect(() => {
        // Redirect to the view requests page by default
        const redirectTimeout = setTimeout(() => {
            router.push('/service-request/view');
        }, 500); // Short delay for better UX

        return () => clearTimeout(redirectTimeout);
    }, [router]);

    return (
        <div className="container mx-auto py-8 text-center">
            <div className="py-12 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-lg">Đang chuyển hướng đến trang yêu cầu dịch vụ...</p>
            </div>
        </div>
    );
}