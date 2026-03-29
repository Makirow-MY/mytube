"use client"
import { trpc } from '@/trpc/client';
import { ErrorBoundary} from 'react-error-boundary';
import { Suspense } from 'react';
import {FilterCarousel} from "@/components/filter-carousel"
import { useRouter } from 'next/navigation';

interface CategoriesSectionProps {
    categoryId?: string;
}

 

export const CategoriesSectionn = ({categoryId}: CategoriesSectionProps) => {
     return  (
    <Suspense fallback={<FilterCarousel isLoading={true} onSelect={() => {}} data={[]} />} >
        <ErrorBoundary fallback={<div>Something went wrong...</div>}>
             <CategoriesSectionSuspense categoryId={categoryId} />
        </ErrorBoundary>    
    </Suspense>
    );
}

 const CategoriesSectionSuspense = ({categoryId}: CategoriesSectionProps) => {
      const router = useRouter();
      const [categories] = trpc.categories.getMany.useSuspenseQuery();

      const data = categories.map((cat) => ({
        value: cat.id,
        label: cat.name,
      }))



      const onSelect = (value: string | null) => {
        console.log("Selected category:", value);
           const url = new URL(window.location.href);
        if (value) {
          url.searchParams.set("categoryId", value);
        } else {
          url.searchParams.delete("categoryId");
        }
        router.push(url.toString());
    }


  return  <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />;
}