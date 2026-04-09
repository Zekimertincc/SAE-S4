const BASE_URL = 'http://127.0.0.1:5000/api'

export const BAC_TYPES = ['Général', 'STI2D', 'STL', 'STMG', 'ST2S', 'PRO', 'Autre']
export const DEPARTMENTS = ['Informatique', 'GACO', 'INFOCOM', 'QLIO']

// ─── Token storage ───────────────────────────────────────

let _token: string | null = null

export function getToken(): string | null {
  return _token
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (_token) headers['Authorization'] = `Bearer ${_token}`
  return headers
}

// ─── Types ───────────────────────────────────────────────

export interface Visitor {
  id: string
  first_name: string
  last_name: string
  email: string
  bac_type: string
  department: string
  ine?: string
  reorientation: boolean
  dossier_particulier: boolean
  created_at: string
  visit_count: number
}

export interface Stats {
  total_visitors: number
  by_department: { department: string; count: number }[]
  by_bac_type: { bac_type: string; count: number }[]
}

export interface Pagination {
  page: number
  limit: number
  total: number
}

export interface VisitorsResponse {
  data: Visitor[]
  pagination: Pagination
}

// ─── Auth ────────────────────────────────────────────────

export async function login(password: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) return false
  const json = await res.json()
  if (json.token) {
    _token = json.token
    return true
  }
  return false
}

// ─── Visiteurs ───────────────────────────────────────────

export async function getVisitors(
  page: number,
  limit: number,
  department: string,
  bacFilter = '',
  reoFilter = '',
  dateFilter = '',
  search = '',
): Promise<VisitorsResponse> {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) })
  if (department) params.set('department', department)
  if (bacFilter) params.set('bac_type', bacFilter)
  if (reoFilter) params.set('reorientation', reoFilter)
  if (dateFilter) params.set('date', dateFilter)
  if (search) params.set('search', search)

  const res = await fetch(`${BASE_URL}/visitors?${params}`, { headers: authHeaders() })
  if (!res.ok) throw new Error('Erreur lors de la récupération des visiteurs')
  return res.json()
}

export async function createVisitor(data: object): Promise<Visitor> {
  const res = await fetch(`${BASE_URL}/visitors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erreur lors de la création du visiteur')
  return res.json()
}

export async function updateVisitor(id: string, data: object): Promise<Visitor> {
  const res = await fetch(`${BASE_URL}/visitors/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Erreur lors de la modification du visiteur')
  return res.json()
}

export async function deleteVisitor(id: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/visitors/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  if (!res.ok) throw new Error('Erreur lors de la suppression du visiteur')
}

// ─── Stats ───────────────────────────────────────────────

export async function getStats(): Promise<Stats> {
  const totalRes = await fetch(`${BASE_URL}/stats/total`)
  const deptRes = await fetch(`${BASE_URL}/stats/department`)
  const bacRes = await fetch(`${BASE_URL}/stats/bac_type`)

  const totalJson = await totalRes.json()
  const deptJson = await deptRes.json()
  const bacJson = await bacRes.json()

  return {
    total_visitors: totalJson.total_visitors,
    by_department: deptJson.by_department,
    by_bac_type: bacJson.by_bac_type,
  }
}

// ─── Export CSV ──────────────────────────────────────────

export async function changePassword(_currentPassword: string, newPassword: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/admin/password`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify({ new_password: newPassword }),
  })
  if (!res.ok) {
    const json = await res.json()
    throw new Error(json.error || 'Erreur lors du changement de mot de passe')
  }
}

export interface ExportFilters {
  fields?: string
  department?: string
  bac_type?: string
  reorientation?: string
  date?: string
  search?: string
}

export function getExportUrl(filters: ExportFilters = {}): string {
  const params = new URLSearchParams()
  if (_token) params.set('token', _token)
  if (filters.fields) params.set('fields', filters.fields)
  if (filters.department) params.set('department', filters.department)
  if (filters.bac_type) params.set('bac_type', filters.bac_type)
  if (filters.reorientation) params.set('reorientation', filters.reorientation)
  if (filters.date) params.set('date', filters.date)
  if (filters.search) params.set('search', filters.search)
  return `${BASE_URL}/visitors/export?${params}`
}
