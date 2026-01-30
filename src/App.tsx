import { Routes, Route, Navigate } from "react-router-dom"
import { Layout } from "@/components/layout/layout"
import { Dashboard } from "@/pages/dashboard"
import { TransactionsPage } from "./pages/transactions"
import { LoginPage } from "./pages/auth/login"
import { AuthGuard } from "./components/auth/auth-guard"
import { GoalsPage } from "./pages/goals"
import { SubscriptionsPage } from "./pages/subscriptions"
import { InvestmentsPage } from "./pages/investments"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={
        <AuthGuard>
          <Layout />
        </AuthGuard>
      }>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/goals" element={<GoalsPage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/investments" element={<InvestmentsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
