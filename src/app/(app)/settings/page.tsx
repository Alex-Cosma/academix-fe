"use client"

import { useEffect, useState, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useUserFields, useUpdateFields } from "@/hooks/use-user-fields"
import { FIELDS_OF_INTEREST } from "@/config/fields-of-interest"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { ErrorBoundaryFallback } from "@/components/error-boundary"
import { SettingsFieldSelector } from "@/components/settings/settings-field-selector"
import { apiClient } from "@/lib/api-client"
import { Check, Loader2, Save, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

function SuccessToast({ message, show }: { message: string; show: boolean }) {
  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg border bg-card px-4 py-3 shadow-lg transition-all duration-300",
        show
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <Check className="h-4 w-4 text-green-500" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  )
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const {
    data: userProfile,
    isLoading: isProfileLoading,
    isError,
    error,
    refetch,
  } = useUserFields()
  const updateFields = useUpdateFields()

  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [isFieldsInitialized, setIsFieldsInitialized] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Initialize selected fields from user profile
  useEffect(() => {
    if (userProfile?.interests && !isFieldsInitialized) {
      setSelectedFields(userProfile.interests)
      setIsFieldsInitialized(true)
    }
  }, [userProfile?.interests, isFieldsInitialized])

  const showSuccessToast = useCallback((message: string) => {
    setToastMessage(message)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000)
  }, [])

  const toggleField = useCallback((slug: string) => {
    setSelectedFields((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((f) => f !== slug)
      }
      if (prev.length >= 7) return prev
      return [...prev, slug]
    })
  }, [])

  const handleSaveInterests = async () => {
    try {
      await updateFields.mutateAsync(selectedFields)
      showSuccessToast("Interests updated successfully!")
    } catch {
      // Error handled by mutation
    }
  }

  const handleDeleteAccount = async () => {
    setIsDeleting(true)
    try {
      await apiClient.delete("/users/me")
      window.location.href = "/login"
    } catch {
      setIsDeleting(false)
    }
  }

  const initials = session?.user?.name
    ? session.user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U"

  const hasChanges =
    isFieldsInitialized &&
    JSON.stringify([...selectedFields].sort()) !==
      JSON.stringify([...(userProfile?.interests ?? [])].sort())

  if (isError) {
    return (
      <main className="container mx-auto max-w-2xl p-4 sm:p-6">
        <ErrorBoundaryFallback
          message={error?.message ?? "Failed to load settings"}
          onRetry={() => refetch()}
        />
      </main>
    )
  }

  return (
    <main className="container mx-auto max-w-2xl p-4 sm:p-6">
      <h1 className="font-serif text-2xl font-bold sm:text-3xl">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage your profile and preferences
      </p>

      <div className="mt-6 space-y-6">
        {/* Profile section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Profile</CardTitle>
            <CardDescription>Your account information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={session?.user?.image ?? undefined}
                  alt={session?.user?.name ?? "User"}
                />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-medium">
                  {session?.user?.name ?? "User"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {session?.user?.email ?? ""}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interests section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Fields of Interest</CardTitle>
            <CardDescription>
              Select up to 7 fields to personalize your feed. Changes will
              update your paper recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isProfileLoading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                <SettingsFieldSelector
                  fields={FIELDS_OF_INTEREST}
                  selectedFields={selectedFields}
                  onToggleField={toggleField}
                />
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {selectedFields.length}/7 fields selected
                  </p>
                  <Button
                    onClick={handleSaveInterests}
                    disabled={!hasChanges || updateFields.isPending}
                    size="sm"
                  >
                    {updateFields.isPending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Account section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Account</CardTitle>
            <CardDescription>
              Manage your account settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Account</DialogTitle>
                  <DialogDescription>
                    Are you sure you want to delete your account? This action
                    cannot be undone. All your data, bookmarks, and preferences
                    will be permanently removed.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    variant="destructive"
                    onClick={handleDeleteAccount}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete Account
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* Toast notification */}
      <SuccessToast message={toastMessage} show={showToast} />
    </main>
  )
}
