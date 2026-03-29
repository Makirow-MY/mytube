"use client"

import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { videoUpdateSchema } from '@/db/schema';
import { trpc } from '@/trpc/client';
import { CopyIcon, DeleteIcon, Globe2Icon, ImagePlusIcon, Loader2Icon, LockIcon, MoreVerticalIcon, RefreshCcw, RotateCcwIcon, SparklesIcon, TrashIcon, WifiOff } from 'lucide-react';
import React, { Suspense, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { ErrorBoundary } from 'react-error-boundary';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { SnakeCaseTitle } from "@/lib/utils";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { VideoPlayer } from '@/modules/videos/ui/components/video-player';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import { THUMBNAIL_FALLBACK } from '@/modules/videos/constants';
import { ThumbnailUploadModal } from '../../components/thumbnail-upload';

interface FormProps {
  videoId: string;
}
export function FormSection({ videoId }: FormProps) {

  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary
        fallbackRender={({ resetErrorBoundary }) => (
          <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 p-8 text-center border-y bg-muted/40">
            <WifiOff className="h-16 w-16 text-muted-foreground/70" strokeWidth={1.5} />

            <div className="space-y-2">
              <h3 className="text-xl font-medium">You're offline</h3>
              <p className="text-muted-foreground max-w-md">
                Check your internet connection and try again.
                This page requires an active connection to load your videos.
              </p>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={() =>{
                const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId })
  const [categories] = trpc.categories.getMany.useSuspenseQuery()
  const utils = trpc.useUtils()
     utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId })
                //window.location.reload();
              }}
              className="gap-2"
            >
              <RefreshCcw className="h-4 w-4" />
              Retry
            </Button>

            <p className="text-xs text-muted-foreground mt-4">
              If the problem continues, check your network or try again later.
            </p>
          </div>
        )}
      >
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  )
}
export function FormSectionSkeleton() {
  return (
    <div className="space-y-8">
      {/* Header area - title + actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />           {/* "Video Details" title */}
          <Skeleton className="h-4 w-48" />           {/* subtitle */}
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-24 rounded-md" />   {/* Save button */}
          <Skeleton className="h-10 w-10 rounded-md" />   {/* More menu icon */}
        </div>
      </div>

      {/* Main grid layout - same as real component */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left column - form fields */}
        <div className="space-y-10 lg:col-span-3">
          {/* Title field */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" />           {/* Label */}
            <Skeleton className="h-10 w-full rounded-md" /> {/* Input */}
          </div>

          {/* Description field */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-56 w-full rounded-md" /> {/* Tall textarea */}
          </div>

            <div className="space-y-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="rounded-md relative h-[84px]
                w-[153px] group" /> {/* Tall textarea */}
          </div>

          


          {/* Category select */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>

        {/* Right column - video preview + metadata */}
        <div className="lg:col-span-2 space-y-8">
          {/* Video player area + card */}
          <div className="rounded-xl overflow-hidden border bg-muted/40">
            {/* Video preview */}
            <Skeleton className="aspect-video w-full rounded-t-xl" />

            {/* Metadata blocks inside card */}
            <div className="p-5 space-y-6">
              {/* Video link block */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />           {/* "Video link" label */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 flex-1" />
                  <Skeleton className="h-8 w-8 rounded-md" /> {/* Copy icon */}
                </div>
              </div>

              {/* Video Status */}
              <div className="flex justify-between items-center">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-5 w-32" />
                </div>
              </div>

              {/* Subtitles Status */}
              <div className="flex justify-between items-center">
                <div className="space-y-1.5">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-5 w-40" />
                </div>
              </div>
            </div>
          </div>

          {/* Visibility field (below the card in your layout) */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function FormSectionSuspense({ videoId }: FormProps) {
  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId })
  const [categories] = trpc.categories.getMany.useSuspenseQuery()
  const utils = trpc.useUtils()
  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      utils.studio.getOne.invalidate({ id: videoId })
      toast.success("Video updated sucessfully")
    },
    onError: (error) => {
      toast.error("Failed to save video. Poor internet connection")
    },
  })

  const remove = trpc.videos.remove.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
      toast.success("Video removed sucessfully")
      router.push(`/studio`)
    },
    onError: (error) => {
      toast.error("Failed to delete video. Poor internet connection")
    },
  })

   const restoreThumbnail = trpc.videos.restoreThumbnail.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate();
       utils.studio.getOne.invalidate({id: videoId});
      toast.success("Original Video Thumbnail Restored Sucessfully")
    
    },
    onError: (error) => {
      toast.error("Failed to restore video original thumbnail. Poor internet connection")
    },
  })
  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  })

  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutate(data);
  }


  const fullUrl = `${process.env.VERCEL_URL || "http://localhost:3000"}/videos/${videoId}`

  const [isCopied, setIsCopied] = useState(false)

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false);
    }, 3000);
  }
  return (
    <>
        
        <ThumbnailUploadModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        videoId={videoId}
        />

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className='flex items-center justify-between mb-6'>
          <div>
            <h1 className='text-2xl font-bold'>Video Details</h1>
            <p className='tex-xs text-muted-foreground'>Manage your video details</p>
          </div>

          <div className='flex items-center gap-x-2'>
            <Button type='submit' className='flex gap-1 items-center' disabled={update.isPending}>
              {!update.isPending ? "Save" : <> <Loader2Icon className='animate-spin' /> Saving... </>}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant={"ghost"} size={"icon"}>
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                <DropdownMenuItem className='cursor-pointer' onClick={() => remove.mutate({ id: videoId })}>
                  <TrashIcon className='size-4 mr-2' /> Delete
                </DropdownMenuItem>

              </DropdownMenuContent>

            </DropdownMenu>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-5 mb-9 gap-6' >
          <div className='space-y-8 lg:col-span-3' >
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input  {...field}
                      placeholder='Add a title to your video'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea  {...field}
                      value={field.value ?? ""}
                      rows={10}
                      className='resize-none'
                      placeholder='Add a description to your video'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              name='thumbnailUrl'
              control={form.control}
              render={() => (
                <FormItem>
                  <FormLabel>Thumbnail</FormLabel>
                  <FormControl>
                    <div className='p-0.5 border border-dashed border-neutral-400 relative h-[84px]
                w-[153px] group
                '>
                      <Image
                        fill
                        className='object-cover'
                        src={video.thumbnailUrl ?? THUMBNAIL_FALLBACK}
                        alt='thumbnail'
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type='button'
                            size={"icon"}
                            className='bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 duration-300 size-7'
                          >
                            <MoreVerticalIcon className='text-white' />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align='start' side='right'>

                          <DropdownMenuItem onClick={() => setModalOpen(true)}
                           className='cursor-pointer'>
                            <ImagePlusIcon className='size-4 mr-1' />
                            Change
                          </DropdownMenuItem>
                          {/* <DropdownMenuItem className='cursor-pointer'>
                            <SparklesIcon className='size-4 mr-1' />
                            AI-Generated
                          </DropdownMenuItem> */}
                          <DropdownMenuItem
                          onClick={() => restoreThumbnail.mutate({id: videoId})}
                          className='cursor-pointer'>
                            <RotateCcwIcon className='size-4 mr-1' />
                            Restore
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='categoryId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>

                      <SelectTrigger>
                        <SelectValue placeholder="select a Category" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>)
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>


          <div className='flex flex-col gap-y-8 space-y-8 lg:col-span-2'>
            <div className='flex flex-col gap-4 rounded-xl overflow-hidden w-full h-fit bg-secondary'>
              <div className='aspect-video overflow-hidden relative'>

                <VideoPlayer
                  playbackId={video.muxPlaybakId}
                  thumbnailUrl={video.thumbnailUrl}
                />
              </div>
              <div>
                <div className='p-4 flex flex-col gap-y-6'>
                  <div className='flex justify-between items-center gap-x-2'>
                    <div className='flex flex-col gap-y-1'>
                      <p className='text-muted-foreground  text-xs'>
                        Video link
                      </p>
                      <div className='flex items-center gap-x-2'>
                        <Link href={`/videos/${video.id}`}>
                          <p className='line-clamp-1 text-sm text-blue-500'>
                            {fullUrl}
                          </p>
                        </Link>

                        <Button type='button'
                          variant={"ghost"}
                          size={"icon"}
                          className='shrink-0'
                          onClick={onCopy}
                          disabled={false}
                        >
                          <CopyIcon />
                        </Button>
                      </div>
                    </div>
                  </div>


                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className='text-xs text-muted-foreground'>Video Status</p>
                      <p className='text-sm'>
                        {
                          SnakeCaseTitle(video.muxStatus || "Preparing")
                        }
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-y-1">
                      <p className='text-xs text-muted-foreground'>Subtitles Status</p>
                      <p className='text-sm'>
                        {
                          SnakeCaseTitle(video.muxTrackStatus || "No Subtitles for this video")
                        }
                      </p>
                    </div>
                  </div>


                </div>
              </div>

            </div>


            <FormField
              control={form.control}
              name="videoVisibility"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Visibility</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl>

                      <SelectTrigger>
                        <SelectValue placeholder="select visibility" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      <SelectItem value="private">
                        <div className='flex items-center gap-2'>
                          <LockIcon className='size-4 mr-2' />
                          Private
                        </div>
                      </SelectItem>
                      <SelectItem value="public">
                        <div className='flex items-center gap-2'>
                          <Globe2Icon className='size-4 mr-2' />
                          Public
                        </div>

                      </SelectItem>

                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />



          </div>



        </div>
      </form>
    </Form>

    

    </>

  )
}
