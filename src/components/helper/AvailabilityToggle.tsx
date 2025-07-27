"use client"

import { useState } from 'react'
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"

const BASE_URL = "https://helper-finder.azurewebsites.net"

export const AvailabilityToggle = ({ initialStatus = false }) => {
  const { user } = useAuth()
  const [isAvailable, setIsAvailable] = useState(initialStatus)
  const [isLoading, setIsLoading] = useState(false)

  const handleToggle = async () => {
    if (!user?.id) {
      toast.error('Không thể xác định ID người dùng')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`${BASE_URL}/api/Helper/${isAvailable ? 'OfflineRequest' : 'OnlineRequest'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user.id),
      })

      const data = await response.json()
      
      if (data.success) {
        setIsAvailable(!isAvailable)
        toast.success(data.data.message)
      } else {
        toast.error('Không thể thay đổi trạng thái. Vui lòng thử lại sau.')
      }
    } catch (error) {
      toast.error('Đã có lỗi xảy ra. Vui lòng thử lại sau.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <Switch
        checked={isAvailable}
        onCheckedChange={handleToggle}
        disabled={isLoading}
      />
      <span className="text-sm font-medium">
        {isLoading ? 'Đang cập nhật...' : isAvailable ? 'Đang hoạt động' : 'Không hoạt động'}
      </span>
    </div>
  )
} 