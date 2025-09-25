import { LoginForm } from '@/components/login-form'

export default function Page() {
  return (
    <div className="flex min-h-[600px] h-[60vh] w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginForm />
      </div>
    </div>
  )
}
