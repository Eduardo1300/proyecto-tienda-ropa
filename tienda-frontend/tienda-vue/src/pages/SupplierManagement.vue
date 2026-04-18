<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-12 px-4 relative overflow-hidden">
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="bg-gradient-to-r from-yellow-600 via-orange-600 to-red-600 rounded-2xl p-8 text-white shadow-2xl mb-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-4xl font-extrabold flex items-center gap-3">
              🚚 Gestión de Proveedores
            </h1>
            <p class="text-yellow-100 text-lg mt-2">Administra tus proveedores y relaciones comerciales</p>
          </div>
          <button 
            @click="showAddModal = true"
            class="px-6 py-3 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30"
          >
            + Nuevo Proveedor
          </button>
        </div>
      </div>

      <div class="flex gap-4 mb-6">
        <button 
          @click="activeTab = 'list'"
          :class="activeTab === 'list' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300'"
          class="px-6 py-2 rounded-xl font-semibold transition-all"
        >
          📋 Lista de Proveedores
        </button>
        <button 
          @click="activeTab = 'stats'"
          :class="activeTab === 'stats' ? 'bg-purple-600 text-white' : 'bg-white/10 text-gray-300'"
          class="px-6 py-2 rounded-xl font-semibold transition-all"
        >
          📊 Estadísticas
        </button>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>

      <div v-else-if="activeTab === 'list'" class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div 
            v-for="supplier in suppliers" 
            :key="supplier.id"
            class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-purple-500/50 transition-all cursor-pointer"
            @click="selectSupplier(supplier)"
          >
            <div class="flex items-start justify-between mb-4">
              <div>
                <h3 class="text-white font-bold text-xl">{{ supplier.name }}</h3>
                <p class="text-gray-400 text-sm">Código: {{ supplier.code }}</p>
              </div>
              <span 
                :class="supplier.isActive ? 'bg-green-500/30 text-green-300' : 'bg-red-500/30 text-red-300'"
                class="px-3 py-1 rounded-full text-xs"
              >
                {{ supplier.isActive ? 'Activo' : 'Inactivo' }}
              </span>
            </div>

            <div class="space-y-2 text-sm">
              <p class="text-gray-300">📧 {{ supplier.email || 'Sin email' }}</p>
              <p class="text-gray-300">📞 {{ supplier.phone || 'Sin teléfono' }}</p>
              <p class="text-gray-300">🏙️ {{ supplier.city || 'Sin ciudad' }}, {{ supplier.country || 'Sin país' }}</p>
            </div>

            <div class="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
              <div class="flex items-center gap-1">
                <span class="text-yellow-400">★</span>
                <span class="text-white font-semibold">{{ supplier.rating }}</span>
              </div>
              <span class="text-gray-400 text-sm">{{ supplier.totalOrders }} pedidos</span>
            </div>
          </div>
        </div>

        <div v-if="suppliers.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">📦</div>
          <p class="text-gray-400 text-lg">No hay proveedores registrados</p>
          <button 
            @click="showAddModal = true"
            class="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
          >
            Agregar Primer Proveedor
          </button>
        </div>
      </div>

      <div v-else-if="activeTab === 'stats'" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div class="text-4xl mb-2">🏢</div>
          <p class="text-gray-400 text-sm">Total Proveedores</p>
          <p class="text-3xl font-bold text-white">{{ suppliers.length }}</p>
        </div>
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div class="text-4xl mb-2">✅</div>
          <p class="text-gray-400 text-sm">Activos</p>
          <p class="text-3xl font-bold text-green-400">{{ activeSuppliers }}</p>
        </div>
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div class="text-4xl mb-2">📦</div>
          <p class="text-gray-400 text-sm">Total Pedidos</p>
          <p class="text-3xl font-bold text-blue-400">{{ totalOrders }}</p>
        </div>
        <div class="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div class="text-4xl mb-2">💰</div>
          <p class="text-gray-400 text-sm">Total Gastado</p>
          <p class="text-3xl font-bold text-yellow-400">S/ {{ totalSpent.toFixed(2) }}</p>
        </div>
      </div>

      <div v-if="selectedSupplier" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div class="flex justify-between items-start mb-6">
            <h2 class="text-2xl font-bold text-white">{{ selectedSupplier.name }}</h2>
            <button @click="selectedSupplier = null" class="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>

          <div class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="bg-white/5 rounded-xl p-4">
                <p class="text-gray-400 text-sm">Código</p>
                <p class="text-white font-semibold">{{ selectedSupplier.code }}</p>
              </div>
              <div class="bg-white/5 rounded-xl p-4">
                <p class="text-gray-400 text-sm">Estado</p>
                <span :class="selectedSupplier.isActive ? 'text-green-400' : 'text-red-400'" class="font-semibold">
                  {{ selectedSupplier.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
              <div class="bg-white/5 rounded-xl p-4">
                <p class="text-gray-400 text-sm">Persona de Contacto</p>
                <p class="text-white">{{ selectedSupplier.contactPerson || 'No definido' }}</p>
              </div>
              <div class="bg-white/5 rounded-xl p-4">
                <p class="text-gray-400 text-sm">Teléfono</p>
                <p class="text-white">{{ selectedSupplier.phone || 'No definido' }}</p>
              </div>
            </div>

            <div class="bg-white/5 rounded-xl p-4">
              <p class="text-gray-400 text-sm mb-2">Dirección</p>
              <p class="text-white">{{ selectedSupplier.address || 'No definida' }}, {{ selectedSupplier.city }}, {{ selectedSupplier.country }}</p>
            </div>

            <div class="bg-white/5 rounded-xl p-4">
              <p class="text-gray-400 text-sm mb-2">Términos de Pago</p>
              <p class="text-white">{{ selectedSupplier.paymentTerms }}</p>
            </div>

            <div class="flex gap-4">
              <button 
                @click="editSupplier(selectedSupplier)"
                class="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700"
              >
                ✏️ Editar
              </button>
              <button 
                @click="toggleSupplierStatus(selectedSupplier)"
                class="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700"
              >
                {{ selectedSupplier.isActive ? '❌ Desactivar' : '✅ Activar' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div class="bg-gray-900 border border-white/20 rounded-2xl p-6 max-w-xl w-full">
          <h2 class="text-2xl font-bold text-white mb-6">Agregar Nuevo Proveedor</h2>
          
          <form @submit.prevent="addSupplier" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-gray-400 text-sm mb-1 block">Nombre *</label>
                <input v-model="newSupplier.name" required class="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label class="text-gray-400 text-sm mb-1 block">Código *</label>
                <input v-model="newSupplier.code" required class="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label class="text-gray-400 text-sm mb-1 block">Persona de Contacto</label>
                <input v-model="newSupplier.contactPerson" class="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label class="text-gray-400 text-sm mb-1 block">Teléfono</label>
                <input v-model="newSupplier.phone" class="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white" />
              </div>
              <div class="col-span-2">
                <label class="text-gray-400 text-sm mb-1 block">Email</label>
                <input v-model="newSupplier.email" type="email" class="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white" />
              </div>
              <div class="col-span-2">
                <label class="text-gray-400 text-sm mb-1 block">Dirección</label>
                <input v-model="newSupplier.address" class="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label class="text-gray-400 text-sm mb-1 block">Ciudad</label>
                <input v-model="newSupplier.city" class="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label class="text-gray-400 text-sm mb-1 block">País</label>
                <input v-model="newSupplier.country" class="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white" />
              </div>
              <div class="col-span-2">
                <label class="text-gray-400 text-sm mb-1 block">Términos de Pago</label>
                <select v-model="newSupplier.paymentTerms" class="w-full bg-white/10 border border-white/20 rounded-xl p-3 text-white">
                  <option value="contado" class="text-gray-900">Contado</option>
                  <option value="net15" class="text-gray-900">Net 15 días</option>
                  <option value="net30" class="text-gray-900">Net 30 días</option>
                  <option value="net45" class="text-gray-900">Net 45 días</option>
                  <option value="net60" class="text-gray-900">Net 60 días</option>
                </select>
              </div>
            </div>

            <div class="flex gap-4 pt-4">
              <button type="button" @click="showAddModal = false" class="flex-1 px-4 py-2 border border-white/30 text-white rounded-xl hover:bg-white/10">
                Cancelar
              </button>
              <button type="submit" class="flex-1 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700">
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api from '../api'

interface Supplier {
  id: number
  name: string
  code: string
  contactPerson?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  country?: string
  paymentTerms: string
  rating: number
  isActive: boolean
  totalOrders: number
  totalSpent: number
  lastOrderDate?: string
}

const suppliers = ref<Supplier[]>([])
const selectedSupplier = ref<Supplier | null>(null)
const loading = ref(true)
const activeTab = ref('list')
const showAddModal = ref(false)

const newSupplier = ref({
  name: '',
  code: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  paymentTerms: 'net30',
  rating: 5
})

const activeSuppliers = computed(() => suppliers.value.filter(s => s.isActive).length)
const totalOrders = computed(() => suppliers.value.reduce((sum, s) => sum + s.totalOrders, 0))
const totalSpent = computed(() => suppliers.value.reduce((sum, s) => sum + s.totalSpent, 0))

const fetchSuppliers = async () => {
  try {
    const response = await api.get('/suppliers')
    suppliers.value = response.data?.data || response.data || []
  } catch (error) {
    console.error('Error fetching suppliers:', error)
  } finally {
    loading.value = false
  }
}

const selectSupplier = (supplier: Supplier) => {
  selectedSupplier.value = supplier
}

const addSupplier = async () => {
  try {
    await api.post('/suppliers', newSupplier.value)
    showAddModal.value = false
    newSupplier.value = {
      name: '',
      code: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      paymentTerms: 'net30',
      rating: 5
    }
    fetchSuppliers()
  } catch (error) {
    console.error('Error adding supplier:', error)
  }
}

const editSupplier = (supplier: Supplier) => {
  console.log('Edit supplier:', supplier.id)
}

const toggleSupplierStatus = async (supplier: Supplier) => {
  try {
    await api.patch(`/suppliers/${supplier.id}`, { isActive: !supplier.isActive })
    fetchSuppliers()
    selectedSupplier.value = null
  } catch (error) {
    console.error('Error updating supplier:', error)
  }
}

onMounted(() => {
  fetchSuppliers()
})
</script>