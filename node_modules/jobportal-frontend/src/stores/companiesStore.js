import { defineStore } from 'pinia'
import { apiRequest } from '@/services/httpClient'

const mapCompany = (company) => ({
  id: company._id,
  name: company.name,
  industry: company.industry || 'Innovación',
  rating: company.avgRating ?? 0,
  location: company.location || 'Global',
  description: company.description,
  raw: company
})

export const useCompaniesStore = defineStore('companies', {
  state: () => ({
    companies: [],
    loading: false,
    error: ''
  }),
  actions: {
    async fetchCompanies(params = {}) {
      this.loading = true
      this.error = ''
      try {
        const data = await apiRequest('/companies', { params })
        this.companies = Array.isArray(data) ? data.map(mapCompany) : []
      } catch (error) {
        this.error = error.message
        this.companies = []
      } finally {
        this.loading = false
      }
    }
  }
})
